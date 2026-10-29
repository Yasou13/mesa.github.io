#!/usr/bin/env python3
"""Record real, model-disabled Core v0.9.0 CLI evidence in an isolated temp home.

Run with the pinned Core environment:
  /path/to/MESA/.venv/bin/python scripts/capture_first_search.py --core /path/to/MESA
No credentials or server logs are exported. No existing MESA home is used.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from importlib.metadata import version
from urllib.request import urlopen

BASELINE = "7062fafe2cff8442eb84d1da60df164099526c8e"
ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--core", type=Path, required=True)
    args = parser.parse_args()
    assert version("mesa-memory") == "0.9.0"
    assert subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=args.core, text=True).strip() == BASELINE
    from mesa_client import MesaV4Client

    evidence = {"version": "0.9.0", "commit": BASELINE,
                "recorded_at": datetime.now(timezone.utc).isoformat(),
                "models_enabled": False, "graph_enabled": False, "examples": {}}
    with tempfile.TemporaryDirectory(prefix="mesa-first-search-") as temporary:
        home = Path(temporary)
        env = {k: v for k, v in os.environ.items() if not k.startswith("MESA_")}
        env.update(MESA_HOME=str(home), MESA_PORT="18765", MESA_MODEL_ENABLED="false",
                   MESA_GRAPH_ENABLED="false", MESA_EXTERNAL_PROVIDER_ENABLED="false",
                   PYTHONDONTWRITEBYTECODE="1")
        command = [sys.executable, "-m", "mesa_mcp.codex_cli"]
        def cli(*parts):
            result = subprocess.run(command + list(parts), cwd=home, env=env, text=True,
                                    capture_output=True, check=True)
            return result.stdout.strip()
        with (home / "server.log").open("w") as log:
            server = subprocess.Popen(command + ["start"], cwd=home, env=env, stdout=log, stderr=log)
            try:
                for _ in range(120):
                    if server.poll() is not None:
                        raise RuntimeError("Isolated MESA server exited; no demo recorded")
                    try:
                        with urlopen("http://127.0.0.1:18765/health/init", timeout=2) as response:
                            if json.load(response).get("status") == "ready":
                                break
                    except OSError:
                        pass
                    time.sleep(0.5)
                else:
                    raise RuntimeError("Isolated MESA server did not become ready")
                credentials = json.loads((home / "credentials.json").read_text())
                with MesaV4Client(credentials["base_url"], api_key=credentials["api_key"]) as client:
                    for language, text, updated, query in [
                        ("en", "The Atlas archive opens at 09:00 on weekdays.", "The Atlas archive opens at 10:00 on weekdays.", "archive"),
                        ("tr", "Atlas arşivi hafta içi 09:00 saatinde açılır.", "Atlas arşivi hafta içi 10:00 saatinde açılır.", "arşivi"),
                    ]:
                        name = f"archive-{language}.txt"
                        source = f"file://{name}"
                        file = home / name
                        record = {"file": name, "source": source, "query": query, "text": text, "updated_text": updated}
                        for label, content in [("initial", text), ("updated", updated)]:
                            file.write_text(content + "\n", encoding="utf-8")
                            receipt = json.loads(cli("add", name, "--source", source, "--json"))
                            states = [client.wait_until_committed(mid, poll_interval_seconds=0.1)
                                      for mid in receipt["mutation_ids"]]
                            assert states and all(item["state"] == "COMMITTED" for item in states)
                            results = json.loads(cli("search", query, "--json"))
                            hits = [r for r in results if r.get("document_id") == receipt["document_id"]]
                            assert hits and any(content in (r.get("evidence_span") or r.get("content") or "") for r in hits)
                            if label == "updated":
                                assert all(text not in (r.get("evidence_span") or r.get("content") or "") for r in hits)
                            record[label] = {"receipt": receipt, "states": states, "results": hits,
                                             "terminal_output": cli("search", query)}
                        evidence["examples"][language] = record
                evidence["server_status"] = cli("status")
            finally:
                server.terminate()
                try:
                    server.wait(timeout=15)
                except subprocess.TimeoutExpired:
                    server.kill()
                    server.wait()
    output = ROOT / "content/examples/first-search.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Recorded real EN/TR search and revision evidence: {output}")


if __name__ == "__main__":
    main()
