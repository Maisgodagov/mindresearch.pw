# 35. Core Self-Evaluations Scale, CSES

Статус: `implemented`

## Версия

- Оригинальная английская 12-пунктовая шкала Judge, Erez, Bono & Thoresen.
- Ответы: 1–5 от `Strongly disagree` до `Strongly agree`.
- Обратные пункты: 2, 4, 6, 8, 10, 12.
- Итог: сумма 12–60 и среднее 1–5.

## Проверка прав и источников

- В оригинальной статье рядом с Table 1 прямо указано, что шкала non-proprietary/free и может использоваться без разрешения.
- Decision Making Individual Differences Inventory также указывает, что CSES доступна в исходной статье и может использоваться без разрешения.

## Реализация

- Добавлен инструмент `test_18`.
- Добавлен автоподсчёт только для полного протокола из 12 ответов.
- Платформа показывает сумму и среднее. Диагностические уровни и нормы не добавлены, потому что в исходной статье не задан универсальный клинический cutoff.

## Источники

- Judge, Erez, Bono & Thoresen, “The Core Self-Evaluations Scale: Development of a Measure”: https://www.ionilies.com/SIOP03/Files/CSES.pdf
- DOI публикации в Personnel Psychology: https://doi.org/10.1111/j.1744-6570.2003.tb00152.x
- Decision Making Individual Differences Inventory, CSES: https://sjdm.org/dmidi/Core_Self-Evaluations_Scale.html
