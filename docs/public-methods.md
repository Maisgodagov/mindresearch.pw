Публичные методики · первая версия, 21.10.2026

## Назначение
Каталог /methods, содержательные страницы, анонимное прохождение, результат и PNG 1080×1920. Сохраняется светлый зелёный стиль mindresearch, Manrope/Lora и существующий логотип. Каталог — редакционный список; статьи читаются в узкой колонке; прохождение сосредоточено на одном вопросе; результат отделяет числа от интерпретации.

## Данные
public_method_publications хранит черновик и опубликованный материал независимо. Первоначальная подборка: RSES, GSES, MSPSS. Редактор только для owner/admin: /app/admin/public-methods. Вопросы и ключи не редактируются через публикацию. RSES/GSES показывают непрерывный балл без универсальных нормативных ярлыков. MSPSS использует существующие ориентиры ответной шкалы с пояснением, что это не популяционные нормы.

public_assessments не связан с исследовательскими сессиями, качеством или выборками. При создании сохраняется полный снимок бланка и публикации. Общие чистые scoreRses/scoreGses/scoreMspss вызываются и здесь; исследовательские результаты не изменяются. После завершения сохраняется готовый результат.

## Приватность
18+, без имени, почты, возраста и пола. Один случайный секрет доступа браузера в HttpOnly SameSite=Strict cookie, в БД только SHA-256. В адресе результата только несекретный UUID. Ответы не попадают в продуктовую запись экрана (она ограничена /app). Прохождение можно удалить. 7 дней для незавершённого, 30 дней после завершения. Очистка при старте и периодически; истёкшие записи недоступны немедленно. Создание ограничено 30 прохождениями на IP в час. Снимки не используются для обучения, исследовательских выборок или общих нормативов.

## Публикация и SEO
API выдаёт готовый HTML для /methods и /methods/:slug из актуальных опубликованных материалов и шаблона apps/web/dist/index.html. Vite в development вставляет те же тексты через /api/public/methods/document. Индексируются только страницы описаний. Есть canonical, метаданные, WebPage/CollectionPage и /methods-sitemap.xml. Персональные результаты и /start — noindex, no-store. При выпуске требуется применить соответствующие location из deploy/nginx.conf к активному серверу mindresearch.pro; одного обновления SPA недостаточно. Sitemap указан в apps/web/public/robots.txt; при выпуске нужно проверить, что активный сервер выдаёт именно этот файл.

## Карточка
PNG создаётся локально в canvas с загрузкой шрифта. Результат и изображение используют один снимок; имя и ответы не включаются. Сначала предпросмотр, затем скачивание. Публичная ссылка на персональные данные не создаётся.

## Локальная проверка
npm run preview:public-api — отдельный локальный API на 127.0.0.1:4011 с синтетическим хранилищем в памяти (не production и не доступ к данным респондентов). Для фронтенда в PowerShell: $env:VITE_API_PROXY_TARGET="http://127.0.0.1:4011"; затем из apps/web: node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5181. В этом режиме данные сбрасываются при перезапуске; административные маршруты закрыты. Рабочая MySQL-версия подключается из основного API после migratePublicMethods.

## Проверки
22 проверки API/подсчёта и контрактов MySQL: npm run test -w @opora/api -- src/public-methods src/scoring/rses.test.ts src/scoring/gses.test.ts src/scoring/mspss.test.ts. Контракты MySQL проверяются с подставным соединением; миграция на настоящем MySQL локально пока не прогнана.

Браузерные проверки используют только loopback и синтетические данные. scripts/check-public-methods.cjs проверяет desktop/mobile, сохранение и продолжение, восстановление после сетевой ошибки, подсчёт, изоляцию, удаление, PNG и текст без JavaScript. scripts/check-public-methods-admin.cjs проверяет редактор на подставных ответах API. Для запуска нужен Playwright (или PLAYWRIGHT_MODULE с путём к существующей установке). Скриншоты сохраняются в .work/public-methods, не коммитятся.

## Выпуск
Эта версия подготовлена локально. Перед production: резервная копия, прогон миграции на тестовом MySQL 8 и проверка реального сохранения/очистки, применение маршрутов к действующему Nginx на mindresearch.pro, проверка HTML/robots/sitemap и прохождения на тестовых данных. Существующие таблицы исследований миграция не меняет. Откат приложения безопасен: новые таблицы можно оставить, не удаляя данные.

## Общая навигация · 22.10.2026
Публичные страницы используют PlatformLayout и PlatformSidebar приложения. Гость видит «Для исследователей», «Методики» и вход; приватные действия, отправка сообщений и создание опроса скрыты до подтверждения сессии. После входа доступно обычное меню по роли с публичными пунктами «Для исследователей» и «Методики». На телефоне применяется существующая нижняя навигация приложения. Шрифт, цвета, заголовки и рабочие поверхности используют общие токены. Серверная HTML-версия также показывает только гостевую навигацию.

## Лендинг для исследователей
Лендинг вынесен на /for-researchers внутри общего публичного сайдбара. Пункт «Для исследователей» находится над «Методиками» и доступен гостям. Корень / временно перенаправляет туда с сохранением query-параметров: HTTP 302 в Nginx и Vite, Navigate replace при клиентской навигации. Canonical лендинга: https://mindresearch.pro/for-researchers. Когда появится новая главная, нужно заменить корневой маршрут и убрать точный location = / в Nginx и временный Vite middleware. Сам лендинг и его адрес остаются прежними.


## Public discovery and researcher demo

The public catalogue uses large thematic collections, not category tabs. Six themes are shown initially; larger catalogues expose searchable, paginated theme collections (12 per page). Search and the selected topic are kept in URL parameters. Method pages separate the launch panel, plain-language overview, instructions, expandable reference sections and visible sources. Anonymous taking, stored assessment snapshots and downloadable result cards remain unchanged.

The `/for-researchers` landing preserves its original section order and composition in the shared app shell. Each former screenshot slot renders its corresponding live interface: SortableSection with pointer/keyboard drag handles, gender-form switches and deletion for the opening composition demo, SectionCard/QuestionBox for a custom question, the actual InstrumentCatalog in optional embedded mode, SurveyTile for publishing, SurveyTaking components for desktop and phone, dashboard overview cards, RespondentResults, and SavedMethodResult for scale profiles. A separate analysis section follows the results. There is no combined workflow tab interface. All examples are marked as synthetic, make no survey or response mutations, and keep edits in React state. Respondent selection can be saved locally and selected in the analysis example through shared page context. Table preferences use an isolated demo storage key.

The statistics example calculates descriptive values (sample standard deviation) and the Pearson coefficient directly from the displayed synthetic observations. It does not claim statistical significance or invent confidence intervals. Changing inputs invalidates the previous calculation. Full application statistical analysis is independent of this example.

Validation: `scripts/check-researcher-demo.cjs` exercises editing, embedded catalogue, taking, respondent selection, local sample, Excel download and a control calculation, and rejects unexpected API mutations. `scripts/check-public-methods.cjs` covers desktop/mobile anonymous taking, resumption, recovery, result-card download, deletion and crawlable source content. Both scripts target local preview only.

The opening demo restores its four original blocks one second after the final deletion; the restored list animates in and respects reduced-motion preferences. All timers are cleaned up on unmount.


## Researcher landing copy and search presentation

`apps/api/src/data/researcherLanding.json` supplies the landing metadata, constructor benefits, section introductions and FAQ. The React page and crawler-readable document share those statements. Copy connects supported functions with concrete research tasks; no price, conversion, diagnostic accuracy or ranking claims are made. Constructor text covers mixed instruments/custom blocks, answer types, instructions/results visibility, order/gender forms, autosave and preview. Later sections cover distribution, respondent experience, scoring, cohorts/quality, statistical analysis, Excel and collaboration.

Vite emits `dist/for-researchers/index.html` containing the content and metadata before JavaScript runs. The API also serves the document at `/for-researchers` and `/api/public/researcher-document`; the development HTML transform uses the latter. The canonical remains `https://mindresearch.pro/for-researchers`; the public sitemap includes it. Client metadata is restored on navigation. Structured data describes a WebPage, with no invented ratings or offers. Search rankings are not guaranteed, and deployment/indexing are outside the local change.


The respondent demo uses all ten original GSES questions with four choices. It follows the real single-choice flow (320 ms selection feedback, 180 ms transition, automatic advance; previous-question navigation remains). Local demo progress is isolated by device variant, validated on load, and never sent to survey endpoints. Timers are cleared on unmount, repeated clicks are guarded, and storage failure does not prevent answering. The phone frame uses a 9:19.5 aspect ratio; all questions fit without an internal scroll area at the supported desktop/tablet widths. On small viewports the desktop example reflows as the respondent UI and the duplicate phone is hidden.
