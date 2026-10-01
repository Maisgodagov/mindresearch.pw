# Фоновая обработка очереди методик

Runner берёт первую запись `queued` из [`links/_backlog.md`](links/_backlog.md) и запускает Codex CLI отдельно для одного инструмента. Очередь строго последовательная.

Для каждой пригодной новой методики обязательны собственные реализация, review, проверки, commit/push в `main`, успешный GitHub Actions workflow `Deploy production`, production health-check и подтверждение появления методики в каталоге с признаком `isVerified=true`. Следующий пункт не начинается до статуса `done`. Если любой шаг выпуска не удался, текущая запись остаётся `queued`, runner ставится на паузу с причиной. Решения `blocked`, `ru-ineligible` и `already-available` не требуют релиза.

## Управление

Из корня проекта:

```powershell
.\scripts\start-methodology-backlog.ps1
.\scripts\status-methodology-backlog.ps1
.\scripts\stop-methodology-backlog.ps1
```

Для ограниченного запуска: `-MaxItems 10`. Предварительный просмотр: `.scriptsun-methodology-backlog.ps1 -DryRun`.

Состояние, транскрипты, логи и ошибки хранятся в `%LOCALAPPDATA%\OporaMethodologyRunner`. Lock предотвращает запуск нескольких runner одновременно. Ошибка CLI, остановка или блокер оставляют текущую запись в очереди. Задача Планировщика возобновляет проход ежедневно в 04:00, пока пользователь вошёл в Windows. По завершении очереди расписание удаляется.

Одна запись считается закрытой `done` только после релиза и проверки production-каталога. Успешный локальный build сам по себе не позволяет переходить дальше.
