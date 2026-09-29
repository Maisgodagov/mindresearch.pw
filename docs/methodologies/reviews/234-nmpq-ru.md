# NMP-Q — Russian adaptation

- Status: `implemented-local`; not deployed.
- Source: Maksimenko, Zolotareva, Kurapov & Kurapova (2025), DOI 10.31992/0869-3617-2025-34-8-9-93-113.
- Russian sample: 621 Russian university students, ages 16–29 (M=20.3, SD=1.47).
- Exact form: Appendix, 20 Russian items; response scale 1–5 with published labels.
- Scoring cross-check: appendix key assigns items 1–4 to information-access discomfort, 5–9 to disconnectedness from others, 10–15 to disconnectedness from close ones, and 16–20 to fear of missing news/messages. The four-factor model item assignment is independently stated in the factor-analysis table. Total is sum of all 20 items. No clinical cutoff is provided.
- Reliability: Cronbach alpha and McDonald's omega > .76 as reported by the paper.
- License: article is CC BY 4.0; attribution included in the instrument metadata.
- Implementation: `apps/api/src/data/nmpqRu.ts`, `apps/api/src/scoring/nmpqRu.ts`; score result also reports arithmetic means for convenience, while published scoring is sums.
- Sources:
  - https://doi.org/10.31992/0869-3617-2025-34-8-9-93-113
  - https://publications.hse.ru/pubs/share/direct/1079661176.pdf
