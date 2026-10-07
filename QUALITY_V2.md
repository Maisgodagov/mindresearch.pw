# Quality System V2

Дата реализации: 2026-10-07. Algorithm version: **2.0.0**.
Это руководство одновременно содержит отчёт о замене V1 и план включения V2.

## НЕ ЯВЛЯЕТСЯ ДЕТЕКТОРОМ ЛЖИ

Quality V2 помогает находить паттерны, совместимые с невнимательным или механическим прохождением.
Она не доказывает, что человек солгал о поле, возрасте, личности или содержании ответов.
Score 0–100 и confidence 0–1 — эвристические показатели, а не вероятности честности.
Редкий или крайний психологический профиль не является основанием для автоматического исключения.
Официальные результаты методик, исходные ответы и телеметрия не изменяются.

## 1. Что было в V1 и что удалено

V1 рассчитывалась в браузере при открытии статистики.
Из 100 вычитались фиксированные штрафы за долю ответов быстрее секунды, быстрые серии,
относительную скорость, активную длительность, ускорение и одинаковые ответы.
Reference пересчитывалась из текущего массива; достаточно было пяти других прохождений.
Одинаковая серия от пяти ответов считалась предупреждением.
Подробная телеметрия была обязательна даже для единого индекса.

Код calculateQuality, штрафы V1 и фильтры V1 удалены из quality.ts.
Таблица, раскрытые результаты, сортировка и экспорт используют только сохранённую V2.
V1 не применяется для отбора reference, порогов, рекомендаций или membership.
В базе V1 не сохранялась, поэтому отдельной миграции её числового поля нет.
Внутренний необязательный legacy_quality_v1 игнорируется, в том числе при хешировании.
При выключении V2 возврата к V1 нет.

## 2. Архитектура и файлы

Новые серверные модули, все в apps/api/src/quality/:

- config.ts — централизованные параметры.
- types.ts — контракты индексов, компонентов, reference и исходных наблюдений.
- math.ts — robust statistics, ранги, Spearman, deterministic RNG, smoothstep, geometric mean.
- keys.ts — адаптер существующих проверенных ключей.
- psychometrics.ts — RPR, словарь пар, серии, entropy, время reference.
- baseline.ts — immutable snapshot, membership, folds и calibration.
- engine.ts — три независимых индекса, confidence, flags и hard checks.
- diagnostics.ts — только групповые alpha, item–total, официальные шкалы, корреляции, сравнение когорт.
- worker.ts, worker-runtime.ts — расчёт в worker_threads; загрузка TypeScript при разработке.
- service.ts — SQL, сохранение raw snapshots, cache heads, очередь и восстановление.
- router.ts — API владельца опроса, baseline/recompute/metadata/retry/activate/diagnostics/snapshot.
- cli.ts — freeze, recompute, cohort migration, backtest, replay.
- fixtures.ts, quality.test.ts — синтетические данные и тесты.

Изменения существующих файлов:

- apps/api/src/db.ts: дополнительные таблицы и колонки телеметрии.
- apps/api/src/index.ts: подключение router/очереди, расчёт после completion, сохранённая V2 в results,
  questionId в ответах, порядок посещений, удаление ожидаемого ответа attention check из публичного API.
- apps/api/src/scoring/mspss.ts: только экспорт существующих definitions, формула не менялась.
- apps/api/src/platform.ts: проверка валидности ручной attention configuration.
- apps/api/package.json: команды обслуживания.
- apps/web/src/containers/SurveyDashboard/quality.ts: только V2 selectors/filters/sort; расчёта психометрики в браузере нет.
- SurveyDashboard/index.tsx, types.ts: V2 из API, ручное управление, CSV.
- SurveyDashboard/components/ResponseQuality/index.tsx: три индекса, confidence/status, компоненты, когорты, jobs, отчёт.
- SurveyDashboard/components/RespondentResults/index.tsx: колонки Overall/Behavior/Response/Confidence/Strong flags/Cohort/Eligibility.
- SurveyDashboard/components/RespondentDetails/index.tsx: сравнение времени с frozen reference по questionId.
- SurveyDashboard/quality.test.ts: сохранение порядка, фильтры, сортировка и контракт экспорта.
- apps/web/src/admin/exportResults.ts: XLSX/CSV V2, существующие листы ответов и официальных результатов сохранены.
- SurveyTaking/useQuestionTiming.ts, index.tsx: visitSequence, прежний visible-time timer сохранён.
- SurveyBuilder/types.ts, index.tsx: сохранение validation и ручные настройки attention/service item для будущих опросов.
- .env.example: QUALITY_V2_ENABLED.
- QUALITY_V2.md, docs/quality-v2-backtest-synthetic.json: документация и синтетический аналитический отчёт.

Эти перечисления относятся к V2; другие ранее существовавшие изменения рабочего дерева не включаются в V2 автоматически.

## 3. Индексы и статусы

Каждый индекс сохраняет score/null, confidence, status, partial, flags, components,
metrics, version, calculated_at и baseline_version.
Overall дополнительно сохраняет config_hash, input_hash, cohort, telemetry_version и hard_checks.

Статусы по score:

| Диапазон | Статус |
|---|---|
| >=85 | high |
| >=70 | acceptable |
| >=55 | review |
| <55 | high_concern |
| null | insufficient_data |

Статус характеризует индекс; низкий confidence отображается отдельно.
Незавершённые прохождения не получают финальных индексов.

Все агрегаты используют weighted geometric mean:
exp(sum(w_j / sum(available weights) * log(max(1, score_j)))).
Если доступен единственный компонент, возвращается его score, включая настоящий ноль.
Missing никогда не становится нулём.

- Behavioral weights: pace .45, bursts .20, acceleration .15, active duration .20.
- Response weights: RPR .45, pairs .30, patterning .15, attention .10.
- Overall weights: Behavior .50, Response .50.
- Overall без одного домена: доступный score, partial=true, confidence <= .60.
- Оба домена отсутствуют: null.

Примеры: 90/90 =>90; 100/25 =>50; null/90 =>90 с ограниченным confidence.

## 4. Поведенческие показатели

Измеряются только психологические вопросы, исключаются служебные и attention checks.
Время — сумма active_ms по уникальным visit_id видимой вкладки.
Повторная отправка посещения использует GREATEST, а не добавляет время дважды.
Elapsed started_at/completed_at остаётся информационным и не влияет на score.

Reference выбирается по вопросу, затем по блоку, затем по типу, при N>=20.
Для блоков и типов единица наблюдения — медиана конкретного человека, не число ответов.
Сохраняются median, P10/P25/P75/P90 и дополнительные хвосты; MAD считается на log(t+.5).

ratio_i=(active_seconds_i+.5)/(reference_median_i+.5).

Быстрый ответ: ratio<.40 И t<4 секунды.
Крайне быстрый: ratio<.25 И t<2 секунды.

Smoothstep severity: u=clip((value-warning)/(critical-warning),0,1), s=u²(3-2u).
Компонент=100*(1-severity).

| Компонент | Начало / полный индикатор |
|---|---|
| Медиана ratio | .60 / .30 |
| Доля быстрых | .10 / .40 |
| Доля крайне быстрых | .02 / .20 |
| Длиннейшая быстрая серия внутри блока | 5 / 16 |
| Последняя треть / первая после нормализации | .70 / .40 |
| Активная длительность / expected | .65 / .35 |

Pace использует максимальную severity из трёх показателей, а не трижды штрафует одну скорость.
Bursts прерываются пропусками, границами блоков и небыстрым ответом.
Ускорение требует фактической visitSequence, минимум 20 измеренных вопросов в каждой крайней трети,
покрытие каждой трети и последовательности >=80%.
Для старой телеметрии без sequence ускорение=null.

expected_total=sum(reference medians).
observed_total=sum(min(active_time_i, max(60 секунд, median_i*5))).
Большое время не штрафуется; cap не позволяет одному забытому вопросу скрыть остальные быстрые ответы.

Behavioral=null при telemetry coverage<50%, менее 10 вопросов с подходящей reference или незавершённом опросе.
Confidence учитывает coverage, reference coverage, число вопросов (до 50), доступные компоненты,
источник reference и точность fallback. Completed reference=.8; block=.85; type=.7.
Пороговые параметры находятся в config.ts.

## 5. Проверенные ключи и RPR

Используются существующие ключи шести основных методик:
MSPSS, ССПМ-2011, SCCS, NSPS, ШОПП, DEBQ.
Подключение идёт по scoring_code/code, не названию методики или псевдониму участника.

Для RPR все keyed ответы приводятся к 0..1 с учётом direction.
У ССПМ «да» (1/2) ключуется выше после reversal, «нет» (3/4) — непосредственно.
Это направление для анализа согласованности; официальный дихотомический подсчёт ССПМ не менялся.
Если у пункта разные направления в разных шкалах, для RPR используется направление каждой шкалы;
из общего pair dictionary неоднозначный пункт исключается.

Незнакомые методики без проверенного item-level key не включаются в RPR или пары.
Одного признака «методика подтверждена» для придумывания ключей недостаточно.

RPR:

1. Берутся >=8 пригодных субшкал, каждая >=4 пунктов.
2. 25 deterministic разбиений каждой субшкалы на две половины.
3. Для каждой половины требуется >=80% ответов.
4. Средние половин стандартизируются reference median и MAD*1.4826; при нулевой MAD — reference SD.
5. Spearman сравнивает два профиля по субшкалам.
6. RPR=tanh(mean(atanh(clip(r,-.999999,.999999)))).
7. Требуется >=15 валидных повторов; сохраняются SD/min/max/count/subscales.

При отсутствии вариативности личного профиля, reference spread или числа шкал — RPR=null.
RPR не является alpha одного человека. Alpha в индивидуальные scores не входит.

Калибровка RPR и пары: >=P10 =>100; P05..P10 =>70..100; P01..P05 =>30..70;
ниже P01 =>0..30, с smoothstep.
При N<50 percentile score отсутствует.
При N<100 вместо стабильного P01 используется консервативная граница median-3*MAD ниже P05.
Raw r не умножается на 100.

## 6. Synonym/antonym pairs

Для keyed пунктов reference Spearman строится с N>=30, |rho|>=.45.
Кандидаты сортируются по |rho|, допускается максимум три пары на пункт.
Положительные и отрицательные пары фиксируются в snapshot.
После нормализации отрицательная пара инвертирует один ответ.
Consistency=weighted mean(1-abs(x-y)), веса=|rho|.
Нужно >=10 заполненных пар. Калибровка выполняется по reference distribution, как для RPR.

Это эмпирические связи, а не доказательство, что два текста семантически синонимичны.
Dictionary нужно проверить на целевой батарее после разметки reference.

## 7. Patterning и attention

Longstrings и normalized entropy рассчитываются внутри блоков с одинаковыми наборами вариантов.
Пропуски и несовместимые шкалы прерывают серию.
Longstring=5 не означает автоматического штрафа.
Нужен reference N>=50; используются P95/P99 и P05/P01.
При N<100 хвосты консервативнее.
Максимальный штраф patterning component —35 баллов; entropy сама по себе — не более15.
Таким образом крайний профиль не превращается в сильное обвинение из одного patterning.

Attention checks отсутствующие =>null, веса перераспределены.
0 ошибок=>100, 1=>70 и warning, 2+=>25 и strong.
Ожидаемый ответ задаётся вручную в собственном одиночном вопросе через validation:
qualityType='attention_check', expectedValue=существующий вариант, excludeFromQuality=true.
Такие вопросы не входят в RPR, пары, time reference и reliability scales.
Публичный API не возвращает expectedValue.
В уже собирающий ответы опрос ничего автоматически не вставляется; существующая блокировка структуры сохранена.

## 8. Frozen baseline, confidence и независимость

Автоматический порядок reference:

1. calibration_trusted=true, >=50 завершённых допустимых прохождений.
2. Существующая V2>=85 с confidence>=.7, >=50 прохождений.
3. Все завершённые допустимые прохождения.

Подтверждённые дубликаты, admin_test и eligibility=fail исключаются из обучения reference,
но не получают искусственный штраф индивидуального индекса.
Если trusted time reference недостаточна, допускается отдельный time fallback из completed;
source и сниженный confidence сохраняются.

Version зависит от SHA256 конфигурации, item metadata, raw training snapshot и source.
Config копируется по значению. Новые ответы/метаданные не меняют frozen statistics автоматически.

Пять folds: для участника, входившего в reference или time fallback, используется модель без его fold.
RPR standardization и пары строятся на остальных folds.
Calibration observations самих reference участников считаются out-of-fold.
При оценке calibration percentile собственное наблюдение также исключается.

Это cross-fit, не nested cross-validation: калибровочные наблюдения других folds могут разделять часть
обучающих участников. Для строгой внешней валидации нужна отдельная независимая holdout cohort.
Seed фиксирует и folds, и разбиения RPR.
Replay по raw snapshot + той же baseline + calculated_at воспроизводит сохранённый результат.

Response confidence учитывает число answered/keyed пунктов, пригодные субшкалы (полнота до20),
число пар (до30), calibration N, доступные веса и coverage.
Один patterning без проверенных ключей даёт лишь ограниченное основание.
Overall confidence=min двух confidence; при одном домене cap=.6.

## 9. Hard checks и flags

Сохраняются отдельно: eligibility pass/fail/unknown, причина, подтверждённый duplicate,
полнота обязательных ответов, cohort, calibration_trusted, telemetry_version.
Нет определения пола/возраста по психологическому профилю и автоматического удаления.

Flag содержит code, severity, domain, value, threshold, explanation.
Domains: speeding, fatigue, response_consistency, patterning, attention, data.
Несколько speeding flags считаются одним независимым доменом.
Сохраняются strong_flag_count, warning_flag_count, independent_concerning_domains.

## 10. Групповая диагностика

Отдельные группы: all, calibration_trusted, public, unassigned.
Для официальных шкал — N, mean, median, SD, missing rate; alpha по полным keyed матрицам;
corrected item–total, missing count и distributions по каждому пункту.
N официальных результатов и N complete cases для alpha показаны раздельно.
Шкалы переводятся в нормализованный keyed диапазон только для reliability; описательные значения
и межметодические связи используют существующие официальные scoring functions.

Omega=null с явным пояснением: проверенной факторной модели нет; alpha не выдается за omega.
Spearman + deterministic bootstrap 95% CI (200 повторов), N>=20:

- DEBQ restrained ↔ ШОПП driveForThinness, positive.
- DEBQ emotional/external ↔ ШОПП bulimia, positive.
- SCCS ↔ NSPS overall и ШОПП ineffectiveness, negative.

Эти групповые связи не входят в индивидуальный index.
По когортам экспортируются P01/P05/P10/P25/P50/P75/P90/P95/P99 и
Mann–Whitney U/rank-biserial effect для распределений качества и его показателей.
Наличие ожидаемого знака не трактуется как обязательное свойство каждого человека.
Отчёт содержит 20 низких scores для ручной проверки.

## 11. Сохранение, миграции и jobs

Добавлены без удаления существующих данных:

- quality_metadata.
- quality_baselines — snapshot/config hash/algorithm.
- quality_settings — active baseline.
- quality_results — immutable cached result + raw input snapshot + input hash.
- quality_result_heads — актуальный hash по session/algorithm/baseline; позволяет корректно вернуться к ранее рассчитанным inputs.
- quality_jobs — queued/running/completed/failed, progress/errors/output.
- question_timings.visit_sequence и recorded_at; исторические значения null не заполняются догадками.

Тяжёлые вычисления выполняются в worker_threads, SQL/API остаются доступными.
Completion ставит задачу одного участника.
Пересчёт выбранного участника/когорты не строит полный групповой отчёт.
Создание baseline через API ставит следующий полный recompute.
Сбой worker сохраняет failed и причину; в UI доступен повтор.
Running задачи после рестарта возвращаются в queued.
Повторные расчёты не перезаписывают исторический raw snapshot; head указывает на нужный cached input.
Progress updates последовательны и завершаются до completed.

Очередь рассчитана на существующий один API процесс. При горизонтальном масштабировании
восстановление running требует lease/heartbeat с владельцем задачи; не запускать resume из нескольких API экземпляров.
Нет бесконечного автоматического retry ошибочной задачи без изменения входных данных.

План включения:

1. Применить additive migrate обычным запуском API/seed.
2. QUALITY_V2_ENABLED=1. При 0 V2 jobs/UI results отключены без V1 fallback.
3. Разметить исторические cohort IDs/reference flag. Граница публичного набора не угадывается.
4. Заморозить reference.
5. Пересчитать всех completed.
6. Посмотреть diagnostics/backtest и только затем принимать исследовательские решения.
7. Новую калибровку создавать как новую version, старую сохранять.

Миграции не применены к production в этой локальной работе.

## 12. API и CLI

Все API ниже требуют авторизацию владельца данного опроса:
prefix /api/admin/surveys/:id/quality-v2.

GET / — active baseline, versions, jobs.
POST /baseline — {cohort?}; freeze + all recompute.
POST /activate — {baselineVersion}; переключение активной версии + recompute.
POST /recompute — {sessionId?,cohort?,baselineVersion?}.
POST /metadata — {sessionIds,cohort?,trusted?,eligibility?,eligibilityReason?,duplicate?,telemetryVersion?}.
POST /retry — {jobId} failed задачи.
GET /diagnostics, /results, /jobs/:jobId, /snapshot/:sessionId.
Snapshot содержит сохранённые raw inputs, baseline и original calculated_at для replay.

Команды из корня репозитория (на Windows не теряют аргументы через npm.ps1):

```text
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts freeze --survey UUID --cohort trusted
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts recompute --survey UUID
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts recompute --survey UUID --session SESSION_UUID
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts recompute --survey UUID --cohort public
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts metadata --survey UUID --input cohort-ids.json
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts metadata --survey UUID --input cohort-ids.json --apply
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts backtest --survey UUID --out report.json
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts backtest --input raw-snapshot.json --out report.json
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts replay --input respondent-snapshot.json --out replay.json
node node_modules/tsx/dist/cli.mjs apps/api/src/quality/cli.ts backtest --demo --out synthetic.json
```

Для DB команд нужны DATABASE_URL или DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.
Команды metadata по умолчанию dry run. JSON: массив {sessionId, cohort, trusted, eligibility, telemetryVersion}.
Только явный --apply меняет metadata; исходные ответы не изменяются.
Backtest read-only для БД, не создаёт persisted baseline/jobs и не удаляет ответы.
Raw file format: {surveyId, items, people, baseline?}.
В package.json также добавлены npm scripts recompute-quality-v2, quality-v2-freeze,
quality-v2-cohorts, quality-v2-backtest, quality-v2-replay.

## 13. Интерфейс, порядок и экспорт

В списке три score, confidence, strong flags, cohort, eligibility; данные раскрываются по участнику.
Есть фильтры качества/когорты/eligibility/телеметрии/наличия V2 и произвольные числовые условия.
Сортировка по индексам/метрикам, strong flags, insufficient data, новые/старые.
По умолчанию порядок API started_at DESC сохранён точно; «Сбросить всё» возвращает его и весь список.
Фильтры не меняют reference или рассчитанные scores.
Выбор для удаления/экспорта ограничен видимыми выбранными строками; автоматического удаления нет.

XLSX сохраняет прежние листы респондентов, официальных результатов, raw answers и добавляет лист V2.
CSV выгружает V2 metadata/метрики. Отсутствующие значения пустые, не нули.
Поля: quality_version, overall/behavior/response_quality_score/status/confidence,
behavior_fast_fraction/extreme_fast_fraction/median_time_ratio/longest_fast_run/acceleration_ratio/active_duration_ratio,
response_rpr/rpr_percentile/pair_consistency/pair_consistency_percentile/patterning_score,
attention_checks_failed, counts, structured quality_flags, baseline_version,
cohort, eligibility, config_hash, calculated_at, overall_partial, telemetry_version.
Legacy V1 не экспортируется.

## 14. Проверки и backtest

Добавлены **40 серверных** V2 тестов и **17 фронтенд** тестов.
Покрыты все 18 обязательных сценариев, плюс независимость time/answers, отсутствие variability,
held-out folds, frozen config, ограничение пар на пункт, eligibility/reference, raw immutability,
determinism, отсутствие V1 влияния, загрузка background worker, сортировка/filter/reset и export schema.

Итог: **211 серверных и 20 фронтенд тестов прошли** (231 всего). Production builds API/web успешны.
Также выполнены проверки worker в development и compiled production,
браузерная проверка 1440 и 390 px: индексы, фильтр, сортировка, восстановление точного порядка,
групповой отчёт, CSV, отсутствие page overflow и JS exceptions.
Development worker и compiled production worker проверяются отдельно.

Синтетический backtest: docs/quality-v2-backtest-synthetic.json.
100 reference +20 специально сформированных сценариев, не реальная выборка.
Четыре случая без telemetry дают Behavioral=null; response может рассчитываться.
Есть случайные ответы, ускоренное прохождение и последовательные крайние профили.
Это проверка алгоритма, не эмпирическая валидация на участницах.

**Текущая production база недоступна в локальной среде:** DB credentials отсутствуют;
проверенное SSH подключение было отклонено. Поэтому реальный backtest, реальные trusted/public
percentiles и список имён/ID с низкими V2 пока не получены и не подменяются синтетическими данными.
Для примерно 72 лично приглашённых участниц требуется точная граница даты или список session IDs.
Их имена не hardcoded; текущие неизвестные когорты остаются unassigned.

## 15. Ограничения и последующая калибровка

- Thresholds стартовые; после разметки reference проверить false positives/negatives.
- Перекалибровать fast ratios/seconds, run tails, acceleration, duration cap, RPR/pair tails и веса.
- N около72 недостаточно для точного P01; используется conservative fallback.
- Spearman pair set на малом N нестабилен; нужна отдельная внешняя holdout выборка.
- 200 bootstrap repeats — начальный диагностический CI; для исследовательского отчёта увеличить.
- Omega не рассчитана без проверенной factor model.
- Нет автоматической достоверности пола/возраста, identity matching или догадок по именам.
- Старые сведения о времени не позволяют восстановить неизвестные посещения; acceleration остаётся null.
- Visible tab может быть оставлена открытой без взаимодействия; большие времена не повышают качество.
- Клиентская телеметрия не является криптографическим доказательством поведения.
- Неизвестные psychometric keys не придумываются. Если данных для RPR/пар нет, компонент null.
- Confidence сам по себе эвристический; не является доверительным интервалом или вероятностью.
- Текущая очередь рассчитана на один экземпляр API; DB integration на production ещё не выполнена.
- На этапе подготовки отчёта проверки выполнены локально. Деплой выполняется штатным workflow; пересчёт ранее собранных результатов запускается отдельным фоновым заданием в статистике опроса.

## Источники

Методологические основания и необходимость отдельной валидации:

- Resampled personal reliability: https://pmc.ncbi.nlm.nih.gov/articles/PMC11525424/
- Careless responding and method limitations: https://pmc.ncbi.nlm.nih.gov/articles/PMC11525390/
- Personal reliability research: https://pubmed.ncbi.nlm.nih.gov/35973734/

Выбранные 25 splits, thresholds и confidence — параметры этой реализации, а не универсальные
психометрические нормы или гарантии, выведенные из этих публикаций.
