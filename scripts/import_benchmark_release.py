#!/usr/bin/env python3
"""Add one benchmark v2 release run to content/benchmark/catalog.json.

Every number comes from the run folder written by mesa_bench:
  test-metrics.json   test-split aggregates and per-category Hit@5
  dev-metrics.json    corpus ingest time of each first DEV store
  dev-rank-check.json fresh-store rank identity on DEV
  test-evidence/gpu.json   GPU the run used
  RESULTS.md          the run's own note on comparing speed across GPUs

Usage:
  python3 scripts/import_benchmark_release.py /path/to/mesa_bench/runs/<run-id> --version 0.9.5
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "content/benchmark/catalog.json"
SUITE = "tier-m-v2-test"
CONFIGS = {
    "T0": ("off", {"en": "Models off (T0)", "tr": "Modelsiz (T0)"}),
    "T1b": ("embedding", {"en": "BGE-M3 embeddings (T1b)", "tr": "BGE-M3 gömme modeli (T1b)"}),
    "T2": ("reranker", {"en": "BGE-M3 + built-in BGE reranker (T2)", "tr": "BGE-M3 + yerleşik BGE yeniden sıralayıcı (T2)"}),
}
TYPES = ("exact", "paraphrase", "cross_document", "number_date_docket")
# The run states this sentence; the Turkish text is its translation.
SPEED_NOTE_EN = "Search and ingest times are not comparable with earlier A100 runs; quality metrics are."
SPEED_NOTE_TR = "Arama ve içe alma süreleri önceki A100 koşularıyla karşılaştırılamaz; kalite ölçütleri karşılaştırılabilir."


def text(value: float) -> str:
    """Keep the evaluator's own decimal rounding."""
    return repr(float(value))


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("run", type=Path)
    parser.add_argument("--version", required=True)
    args = parser.parse_args()
    run = args.run.resolve()

    status = load(run / "runner-status.json")
    assert status["complete"] is True, "run is not complete"
    results = (run / "RESULTS.md").read_text(encoding="utf-8")
    assert f"mesa-memory {args.version}" in results, "RESULTS.md describes another version"
    test = load(run / "test-metrics.json")
    dev = load(run / "dev-metrics.json")
    ranks = load(run / "dev-rank-check.json")
    gpu = load(run / "test-evidence/gpu.json")
    gpu_label = "Colab " + gpu["gpu_name"].removeprefix("NVIDIA ").strip()

    speed_note = SPEED_NOTE_EN in results
    other_gpu = re.search(r"ran on one Colab (NVIDIA [^\n(]+)", results)

    overall = test["T2"]["overall"]
    categories = test["T2"]["categories"]
    question_types = {name: categories[name]["count_answerable"] for name in TYPES}
    assert sum(question_types.values()) == overall["count_answerable"]

    configs = []
    for config, (profile, label) in CONFIGS.items():
        o = test[config]["overall"]
        configs.append({
            "id": config, "label": label, "gpu": gpu_label, "source": run.name, "profile": profile, "experiment": False,
            "metrics": {
                "mrr": text(o["passage_mrr"]), "hit1": text(o["passage_hit@1"]), "hit5": text(o["passage_hit@5"]),
                "hit10": text(o["passage_hit@10"]), "doc1": text(o["document_hit@1"]), "doc5": text(o["document_hit@5"]),
                "p50": text(o["latency_p50_sec"]), "p95": text(o["latency_p95_sec"]),
            },
            "byType": {name: text(test[config]["categories"][name]["passage_hit@5"]) for name in TYPES},
        })
    ingest = [{"config": config, "minutes": text(dev[config]["ingest"]["fully_ready_seconds"] / 60),
               "chunks": dev[config]["ingest"]["chunks"]} for config in CONFIGS]

    identical = all(ranks[c]["identical"] == ranks[c]["questions"] for c in CONFIGS)
    dev_questions = dev["T0"]["overall"]["count_total"]
    runs_dir = run.parent
    test_reads = sorted(p.name for p in runs_dir.glob("*_v2_*") if (p / "test-metrics.json").is_file())
    t2 = configs[2]["metrics"]

    notes = []
    if other_gpu or speed_note:
        notes.append({
            "en": f"All rows ran on one {gpu_label} ({gpu['gpu_memory']} GPU memory). {SPEED_NOTE_EN}",
            "tr": f"Tüm satırlar tek bir {gpu_label} üzerinde çalıştı ({gpu['gpu_memory']} GPU belleği). {SPEED_NOTE_TR}",
        })
    notes.append({
        "en": f"Each configuration was built twice from scratch for the {dev_questions} dev questions"
              + (" and returned identical ranks both times" if identical else "")
              + "; the test split then ran once on the first store. T2 reranks up to 50 candidates.",
        "tr": f"Her yapılandırma {dev_questions} dev sorusu için iki kez sıfırdan kuruldu"
              + (" ve iki seferde de aynı sıraları döndürdü" if identical else "")
              + "; test bölümü ardından ilk depoda bir kez çalıştı. T2 en fazla 50 adayı yeniden sıralar.",
    })

    def pct(value: str, tr: bool) -> str:
        number = f"{float(value) * 100:.1f}"
        return f"%{number.replace('.', ',')}" if tr else f"{number}%"

    release = {
        "version": args.version,
        "date": status["time_utc"][:10],
        "suite": SUITE,
        "featured": "T2",
        "configs": configs,
        "summary": {
            "en": f"On benchmark v2 test questions, MESA {args.version} with the built-in reranker puts the correct passage in the first five results for {pct(t2['hit5'], False)} of answerable questions (MRR {float(t2['mrr']):.3f}).",
            "tr": f"Benchmark v2 test sorularında, yerleşik yeniden sıralayıcıyla MESA {args.version}, yanıtlanabilir soruların {pct(t2['hit5'], True)} kadarında doğru pasajı ilk beş sonuçta buluyor (MRR {f'{float(t2['mrr']):.3f}'.replace('.', ',')}).",
        },
        "notes": notes,
        "ingest": ingest,
        "citations": None,
    }

    suite = {
        "documents": dev["T0"]["ingest"]["documents"],
        "dev": dev_questions,
        "test": overall["count_total"],
        "answerable": overall["count_answerable"],
        "questionTypes": question_types,
        "method": {
            "en": (f"Benchmark v2 uses the same {dev['T0']['ingest']['documents']} Tier M Turkish legal documents with "
                   f"{dev_questions} development and {overall['count_total']} test questions. Every answer is tied to a verbatim quote in a source file. "
                   "An independent audit of the question set found dev/test overlaps and mislabelled categories; they were fixed and the scoring "
                   "tool was updated to evaluator v2.1 before the release runs. Configurations are checked on the dev split first, then each runs "
                   f"once on the test split. Retrieval scores use the {overall['count_answerable']} answerable test questions."),
            "tr": (f"Benchmark v2 aynı {dev['T0']['ingest']['documents']} Tier M Türk hukuku belgesini, {dev_questions} geliştirme ve "
                   f"{overall['count_total']} test sorusuyla kullanır. Her yanıt bir kaynak dosyadaki birebir alıntıya bağlıdır. Soru kümesinin "
                   "bağımsız denetimi dev/test çakışmaları ve yanlış etiketlenmiş kategoriler buldu; bunlar düzeltildi ve puanlama aracı sürüm "
                   "koşularından önce evaluator v2.1’e güncellendi. Yapılandırmalar önce dev bölümünde denetlenir, ardından her biri test bölümünde "
                   f"bir kez çalışır. Arama puanları yanıtlanabilir {overall['count_answerable']} test sorusunu kullanır."),
        },
        "limits": {
            "en": (f"The test split has been opened in {len(test_reads)} release runs, so it is not an untouched holdout. With the reranker, "
                   "scores are close to the ceiling, which leaves little room to show further gains. The corpus is small, and most questions name "
                   f"the law or decision they ask about. The {overall['count_no_answer']} questions with no answer in the corpus are not scored, "
                   "because MESA does not abstain. Retrieval quality on much larger collections has not been measured with this benchmark."),
            "tr": (f"Test bölümü {len(test_reads)} sürüm koşusunda açıldı; bu yüzden dokunulmamış bir ayrılmış küme değildir. Yeniden "
                   "sıralayıcıyla puanlar tavana yakındır; bu da yeni kazanımları göstermeye az yer bırakır. Derlem küçüktür ve soruların çoğu "
                   f"sorduğu kanunu veya kararı adıyla anar. Derlemde yanıtı olmayan {overall['count_no_answer']} soru puanlanmaz, çünkü MESA "
                   "yanıt vermekten kaçınmaz. Çok daha büyük koleksiyonlardaki arama kalitesi bu benchmark ile ölçülmedi."),
        },
    }

    catalog = load(CATALOG)
    catalog["suites"][SUITE] = suite
    catalog["releases"] = [r for r in catalog["releases"] if r["version"] != args.version] + [release]
    CATALOG.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Imported MESA {args.version} from {run.name}: T2 Hit@5 {t2['hit5']}, MRR {t2['mrr']}, GPU {gpu_label}; "
          f"test split opened in {len(test_reads)} runs: {', '.join(test_reads)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
