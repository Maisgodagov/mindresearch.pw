# 1851. Тест спектра детского аутизма (CAST)

- Статус: `blocked` — русская версия и ключ существуют, однако доступные здесь представления не позволяют проверить полный текст формы и сопоставить все формулировки с русским бланком. Поэтому не создаю модуль и не реконструирую пункты по памяти или переводу.
- Русский текст: Psytests описывает авторизованный русский перевод и предоставляет отдельную страницу прохождения и бланк; загрузка бланка из этого окружения завершается ошибкой декодирования. Autism Research Centre перечисляет официальный русский файл перевода (Екатерина Саприна; Ivan Iourov, National Research Center of Mental Health, RAMS).
- Ключ: Autism Research Centre отдельно размещает CAST Scoring Key; первичная статья описывает CAST как родительский скрининг детей 4–11 лет. Однако файл ключа доступен только в формате DOC, который здесь не удалось прочитать. Без сверки всех 37 пунктов точный ключ для реализации не подтверждён.
- Форма по доступным описаниям: 37 бинарных пунктов (ответы «Да» / «Нет»), из них 31 учитываемый; шесть контрольных не входят в итог.
- Подсчёт: по доступной публикации CAST — сумма 31 ключевого ответа, диапазон 0–31; порог 15 упоминается в источниках как скрининговый. Полярность каждого ответа должна браться из ключа, поэтому здесь она намеренно не реконструирована.

## Источники

- [Psytests: «Тест спектра детского аутизма, CAST» — описание русской версии, возраст, авторы, указание на авторизованный перевод и ссылки на прохождение/бланк](https://psytests.org/arc/cast.html).
- [Psytests: бланк CAST](https://psytests.org/arc/cast-bl.html) и [страница прохождения CAST с русскими вопросами](https://psytests.org/arc/cast-run.html) — русская версия формы; содержимое в текущем извлечении недоступно для полной сверки.
- [Autism Research Centre, University of Cambridge: Childhood Autism Spectrum Test (CAST) — страница версии и официальные загрузки](https://www.autismresearchcentre.com/tests/childhood-autism-spectrum-test-cast/), включая [русский перевод CAST](https://docs.autismresearchcentre.com/tests/CAST_Russian.doc) и [ключ подсчёта CAST](https://docs.autismresearchcentre.com/tests/CAST_key.doc).
- [F. Scott, S. Baron-Cohen, P. Bolton, C. Brayne. “The CAST (Childhood Asperger Syndrome Test): Preliminary development of UK screen for mainstream primary-school children” (2002)](https://doi.org/10.1177/1362361302006001003), *Autism*, 6(1), 9–31 — первичная публикация методики.
- [J. Williams et al. “The CAST (Childhood Asperger Syndrome Test): test accuracy” (2005)](https://doi.org/10.1177/1362361305057877), *Autism*, 9(1), 45–68 — исследование точности скрининга.
