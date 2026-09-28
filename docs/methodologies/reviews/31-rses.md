# 31. Rosenberg Self-Esteem Scale, RSES

Статус: `implemented`

## Версия

- 10 пунктов RSES.
- Ответы кодируются от 0 до 3.
- Итоговый балл: 0–30, чем выше балл, тем выше глобальная самооценка.
- Обратные пункты: 2, 5, 6, 8, 9.

## Проверка прав и источников

- University of Maryland Sociology Department указывает, что Rosenberg Self-Esteem Scale находится в public domain и может использоваться без оплаты и уведомления кафедры.
- Русскоязычный ключ сверён с публикацией Золотарёвой: прямые пункты 1, 3, 4, 7, 10; обратные 2, 5, 6, 8, 9; шкала 0–3.

## Реализация

- Добавлен инструмент `test_17`.
- Автоподсчёт выполняется только при полном протоколе из 10 ответов.
- Платформа показывает сырой балл 0–30 и ориентировочный уровень. Это не медицинская диагностика и не клиническая норма.

## Источники

- University of Maryland, “Using the Rosenberg Self-Esteem Scale”: https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale
- APA Measures Package PDF: https://www.apa.org/obesity-guideline/rosenberg-self-esteem.pdf
- Золотарёва А. А., “Валидность и надежность русскоязычной версии шкалы самооценки М. Розенберга”: https://publications.hse.ru/pubs/share/direct/383400468.pdf
