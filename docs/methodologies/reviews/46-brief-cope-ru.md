# №46 — Brief COPE, пересмотренная русская версия (24 пункта)

**Решение:** `implemented-local` as `test_20`; local code/tests only, not deployed. Queue proceeds immediately per `WORKFLOW.md`.

## Version and Russian validation

Implemented only the revised Russian brief COPE described by Pavlova et al. (2022), not the original 28-item / 14-subscale Brief COPE. The authors analyzed Russian COPE responses from schoolteachers in Russia: 1,273 participated initially and 773 remained in the final analytic sample. They report a revised 24-item form with six second-order subscales. The Russian translation was taken from Rasskazova et al.'s Russian COPE adaptation.

## Text and key cross-check

The final item list and factor membership are from Table 7; exact Russian wording is from Appendix A. Item numbers retained in the digital form: 1, 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 16, 17, 19, 21, 23, 24, 25, 26, 27, 28, 29, 30, 32. Deleted: 5, 7, 10, 15, 18, 20, 22, 31. Appendix A independently identifies wording and original number for each Russian item; the 2022 study's Methods confirm four anchors (1–4), past-month frame, and arithmetic mean per subscale. Table 7 confirms the final six keys:

- Socio-emotional support: 6, 12, 14, 17, 24, 26.
- Religion: 4, 8, 25, 29.
- Acceptance: 19, 23, 27, 30.
- Problem-focused coping: 2, 9, 16, 28.
- Avoidance: 1, 3, 11, 13.
- Humor: 21, 32.

All 24 items are directly coded in the final key; each scale is the arithmetic mean in range 1–4. The article describes reverse scoring only for an earlier candidate structure; the final Table 7 form and its selected six-factor configuration do not specify reverse coding. No item is reverse-coded here.

Cross-check: source Table 7 agrees with the item membership reported in the article's Results/Discussion; Appendix A provides the Russian wording and item numbers; Methods independently state response anchors and mean scoring. An additional indexed scholarly article reproducing Appendix A was used only as a secondary text check, not as the source of the key.

## Psychometric caution

Avoidance is included because it is in the authors' six-scale Table 7 and they recommend retaining the initial six-factor model despite marginal differences against the model without it. However, its Cronbach alpha was 0.55, factor loadings were comparatively low, and overall fit improved when it was removed. Surface this limitation in the method description and respondent results. No norms or cutoffs are invented.

## Rights

The 2022 article states CC BY 4.0. The 2022 source attributes its Russian translation to Rasskazova et al. (2013); source attribution is retained. Review the article for any excluded third-party material before external release; current implementation is local only.

## Sources

1. Pavlova, A. et al. (2022). *Factor Structure and Psychometric Properties of Brief COPE in Russian Schoolteachers*. Education Sciences, 12(8), 539. [Article and Appendix A / Table 7](https://www.mdpi.com/2227-7102/12/8/539). [Full-text PDF mirror](https://publications.hse.ru/pubs/share/direct/782541192.pdf). DOI: [10.3390/educsci12080539](https://doi.org/10.3390/educsci12080539).
2. Rasskazova, E. I., Gordeeva, T. O., & Osin, E. N. (2013). Russian COPE adaptation cited by Pavlova et al. as the source translation. [Journal record](https://psy-journal.hse.ru/article/view/40117).
3. The paper's Methods and Appendix A were checked against its full text. Sample and final key are in Results / Table 7; instrument framing and scoring are in §2.2; item text and numbers are in Appendix A.

## Local verification

- Scorer validates the exact set of 24 item numbers, integer responses 1–4, and rejects incomplete/unexpected item maps.
- Tests verify the six published subscale memberships and mean aggregation, including min/max cases.
- API result is versioned `brief-cope-ru-pavlova-2022-v1`; deployment/smoke check remains outstanding.
