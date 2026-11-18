# Benchmark 0.9.3 update verification

Date: 18 November 2026. Local review only; no push or deployment.

Source run: `/home/yasin/Desktop/mesa_bench/runs/20261117T230132Z_v093/`.
All three files were read in full; JSON documents were fully parsed, including citation records and saved raw results. No raw question text or result payloads were copied into the public catalog.

Owner decisions: omit the provider/Ollama footnote; use **12.0 min**, computed directly from **722.83 seconds**, rather than the requested 12.1 min. The report explicitly says the 0.9.2 baseline also used local BGE-M3.

## Source checksums

| File | SHA-256 |
| --- | --- |
| RESULTS.md | `763ad13901e6df983728f38c31f5701667e1f27284210dcf31d9a14546949bb6` |
| test-metrikleri.json | `35e454d19bec69657f097e08199c8214eeffcf1b2f76888bc1873e60c202d695` |
| atif-metrikleri.json | `cc95c13c77b6633feb74d17a71b758ee9c76f3eda2aee4ce38e3a3a8aa87d0ee` |

## Main results: displayed English values

| Config | Hit@5 | Hit@1 | MRR | Hit@10 | Doc@1 | Doc@5 | p50 (s) | p95 (s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T0 | 38.0% | 22.3% | 0.297 | 47.9% | 43.8% | 57.9% | 0.45 | 0.94 |
| T1b | 67.8% | 38.8% | 0.522 | 77.7% | 57.9% | 77.7% | 1.37 | 2.36 |
| T2 | 74.4% | 57.9% | 0.656 | 81.0% | 69.4% | 79.3% | 2.02 | 3.00 |

## Question type Hit@5

| Type | T0 | T1b | T2 |
| --- | --- | --- | --- |
| exact | 69.4% | 88.9% | 97.2% |
| paraphrase | 17.9% | 69.2% | 71.8% |
| cross_document | 35.3% | 52.9% | 76.5% |
| number_date_docket | 27.6% | 48.3% | 48.3% |

## Citation Hit@5

| Config | Explicit (50) | Natural (40) |
| --- | --- | --- |
| T0 | 100.0% | 97.5% |
| T1b | 100.0% | 97.5% |
| T2 | 100.0% | 100.0% |

These results retain the 0.9.2 values for T0, T1b and selected T2. The separate T2-k50 citation measurements also give 100.0% for both sets; the page reports the selected T2 configuration.

## Other displayed numbers

- Hero: Hit@5 74.4%, Hit@1 57.9%, MRR 0.656, citation Hit@5 100.0%; all from 0.9.3 T2. The headline states that 0.9.2 and 0.9.3 share Hit@5/MRR at this displayed precision.
- Chart: new 0.9.3 bars are 38.0%, 67.8%, 74.4%; the historical configurations use their existing catalog values. No historical built-in reranker measurement is invented.
- Ingest T0: 445.87 s → 7.4 min; 5,041 chunks; 0.09 s/chunk.
- Ingest T1b: 722.83 s → 12.0 min; 5,041 chunks; 0.14 s/chunk.
- Rounded fully-ready acceptance values: T0 446 s, T1b 723 s.
- Number/date/docket T2: unchanged at 14/29 → 48.3% Hit@5.
- Dev-only request limit comparison: limit 50, Hit@5 0.7765 → 77.7%; limit 10 with 20 reranker candidates, Hit@5 0.7529 → 75.3%. Candidate pool and returned-result limit both change.
- Run footer: 18 November 2026, mesa-memory 0.9.3, 20261117T230132Z_v093.

## Validation

- `npm test`: passed (18 Python tests and all existing JavaScript test files).
- Production build into `/tmp/mesa-benchmark-v093-preview`: passed.
- `python3 scripts/check_site.py /tmp/mesa-benchmark-v093-preview`: passed; 230 localized routes, 273 HTML files.
- English and Turkish overview/report checked at 320, 390, 768, 1440 and 1920 px: no document overflow.
- Browser audit compares 192 numeric table cells against source values across the four EN/TR overview/report pages, plus hero values, new chart values, limitations and run footer.
- Accessibility at 390/1440 px, comparison switching, no-JavaScript reading and browser errors: passed.
- Historical catalog records are unchanged. Rendered EN/TR 0.9.0/0.9.2 reports match their original rendering, except the added 0.9.3 navigation link.
- Existing uncommitted generated HTML and unrelated changes were left untouched. Builds use a separate disposable output directory.
- Browser evidence: `/tmp/mesa-benchmark-v093-qa/`; full test log: `/tmp/mesa-benchmark-v093-tests.log`.

## Local preview

From the `site` repository:

```bash
export PATH="/home/yasin/.local/node/bin:$PATH"
python3 scripts/build_site.py --output /tmp/mesa-benchmark-v093-preview --site-url https://mesamemory.dev/
python3 -m http.server 8000 --bind 127.0.0.1 --directory /tmp/mesa-benchmark-v093-preview
```

Open `http://127.0.0.1:8000/benchmark/` or `http://127.0.0.1:8000/tr/benchmark/`.

No requested numeric value was unavailable. The two source discrepancies above were resolved by the owner.
