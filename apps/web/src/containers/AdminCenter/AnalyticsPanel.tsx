import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { api } from "../../api";
import { Button, SkeletonScreen } from "../../ui";
import { AdminWorkspace } from "./workspaceStyles";
import "rrweb-player/dist/style.css";

type Session = {
  id: string;
  userId: string | null;
  visitorId?: string;
  startedAt: string;
  lastAt: string;
  activeMs: number;
  events: number;
  clicks: number;
  errors: number;
  hasReplay: boolean;
  userAgent: string | null;
  userName?: string;
};
type Event = {
  id?: string;
  type: string;
  page: string;
  name: string;
  at: string;
  durationMs: number;
  surveyId?: string | null;
  userId?: string;
  userName?: string;
  instrumentTitle?: string | null;
  surveyTitle?: string | null;
};
type Report = {
  period: string;
  from: string;
  to: string;
  hourly: {hour:string;users:number;events:number;views:number;activeMs:number}[];
  summary: {
    events: number;
    users: number;
    registeredUsers: number;
    guests: number;
    sessions: number;
    pageViews: number;
    clicks: number;
    errors: number;
    activeMs: number;
    trackingSince: string | null;
  };
  daily: {
    day: string;
    users: number;
    events: number;
    views: number;
    activeMs: number;
  }[];
  pages: { page: string; views: number; users: number }[];
  actions: { name: string; count: number; users: number }[];
  sessions: Session[];
  events: Event[];
  funnel: { page: string; users: number }[];
};
const names: Record<string, string> = {
  "survey.create": "Создать опрос",
  "survey.publish": "Опубликовать",
  "survey.published": "Опрос опубликован",
  "survey.created": "Опрос создан",
  "survey.edit": "Открыть конструктор",
  "survey.statistics": "Посмотреть статистику",
  "survey.preview": "Предпросмотр",
  "survey.copy_link": "Копировать ссылку",
  "survey.draft_saved": "Сохранён черновик",
  "builder.add_question": "Добавить вопрос",
  "builder.add_method": "Добавить методику",
  "results.export": "Экспорт результатов",
  "navigation.profile": "Профиль",
  "navigation.surveys": "Мои опросы",
  "navigation.create": "Создать",
  "navigation.request_method": "Запросить методику",
  "screen.open": "Открытие экрана",
  "control.click": "Нажатие элемента",
  "runtime.error": "Ошибка интерфейса",
  "support.sent": "Отправлено сообщение",
  "method.requested": "Запрошена методика",
  "test.start": "Начать публичный тест",
  "test.share": "Поделиться результатом",
};
const coreActions: Record<string, string> = {
  "survey.create": "Начать создание опроса",
  "survey.save": "Сохранить опрос",
  "survey.published": "Опубликовать опрос",
  "survey.preview": "Предпросмотр",
  "survey.statistics": "Посмотреть статистику",
  "survey.copy_link": "Копировать ссылку",
  "catalog.open": "Открыть каталог методик",
  "builder.add_method": "Добавить методику",
  "builder.add_custom_block": "Создать свои вопросы",
  "results.export": "Экспортировать результаты",
  "navigation.profile": "Открыть профиль",
  "method.requested": "Запросить методику",
  "support.sent": "Отправить сообщение",
};
const publicActions: Record<string,string> = {
  "test.start": "Начать публичный тест",
  "test.share": "Поделиться результатом",
};
const actionName = (key: string) =>
  names[key] ??
  coreActions[key] ??
  (key.startsWith("builder.add_method.")
    ? "Добавить методику · " + key.split(".").at(-1)
    : key.startsWith("catalog.method_details.")
      ? "Описание методики · " + key.split(".").at(-1)
      : key);
const pages: Record<string, string> = {
  "/for-researchers": "Для исследователей",
  "/methods": "Каталог тестов",
  "/assessment/result": "Результат публичного теста",
  "/login": "Вход",
  "/register": "Регистрация",
  "/app": "Мои опросы",
  "/app/profile": "Профиль",
  "/app/surveys/new": "Создание опроса",
  "/app/surveys/:id/edit": "Конструктор опроса",
  "/app/surveys/:id/results": "Статистика опроса",
};
export const dateTime = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Moscow",
      })
    : "Нет данных";
const device = (ua: string | null) =>
  !ua
    ? "Неизвестно"
    : `${/Mobile|Android|iPhone/.test(ua) ? "Телефон" : "Компьютер"} · ${/Edg/.test(ua) ? "Edge" : /Firefox/.test(ua) ? "Firefox" : /Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Браузер"}`;
const minutes = (ms: number) => `${Math.round(Number(ms) / 60000)} мин`;
function Replay({ events }: { events: unknown[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    let player: any;
    void import("rrweb-player").then(({ default: Player }) => {
      if (live && ref.current)
        player = new Player({
          target: ref.current,
          props: {
            events: events as any,
            width: Math.min(900, window.innerWidth - 80),
            height: 480,
            autoPlay: false,
          },
        });
    });
    return () => {
      live = false;
      player?.$destroy();
      ref.current?.replaceChildren();
    };
  }, [events]);
  return <div ref={ref} className="replay-container" />;
}
function Bars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => Number(i.value)));
  return (
    <>
      {items.map((i) => (
        <div className="bar-row" key={i.label}>
          <div className="bar-label">
            <span>{i.label}</span>
            <b>{i.value}</b>
          </div>
          <div className="bar">
            <span style={{ width: `${(Number(i.value) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}
export function AnalyticsPanel({ userId }: { userId?: string }) {
  const [period, setPeriod] = useState("today"),
    [audience, setAudience] = useState("all"),
    [report, setReport] = useState<Report | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [session, setSession] = useState<Session | null>(null),
    [details, setDetails] = useState<{
      events: Event[];
      replay: unknown[];
    } | null>(null),
    [detailLoading, setDetailLoading] = useState(false),
    [detailError, setDetailError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true);
    setReport(null);
    setError("");
    api
      .get<Report>(
        userId ? `/admin/users/${userId}/analytics` : "/admin/analytics",
        { params: { period, audience } },
      )
      .then((r) => {
        if (!r.data.period || !Array.isArray(r.data.hourly)) throw new Error("analytics-version");
        if (live) setReport(r.data);
      })
      .catch((cause) => {
        if (live)
          setError(cause instanceof Error && cause.message === "analytics-version" ? "На сервере ещё прежняя версия аналитики. Для новых периодов и учёта гостей нужно обновить API вместе с интерфейсом." : "Не удалось загрузить аналитику. Повторите попытку.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [period, audience, userId, refresh]);
  useEffect(() => {
    if (!session) return;
    let live = true;
    setDetails(null);
    setDetailError("");
    setDetailLoading(true);
    api
      .get(session.userId ? `/admin/users/${session.userId}/analytics/sessions/${session.id}` : `/admin/analytics/guests/${session.visitorId}/sessions/${session.id}`)
      .then(async (r) => {
        const { unpack } = await import("@rrweb/packer");
        if (live)
          setDetails({
            ...r.data,
            replay: r.data.replay.map((e: unknown) =>
              typeof e === "string" ? unpack(e) : e,
            ),
          });
      })
      .catch(() => {
        if (live) setDetailError("Не удалось загрузить запись сессии.");
      })
      .finally(() => {
        if (live) setDetailLoading(false);
      });
    return () => {
      live = false;
    };
  }, [session]);
  const summary = report?.summary;
  const coreUsage = Object.entries(audience === "guests" ? publicActions : {...coreActions,...publicActions}).map(([key, label]) => ({
    label,
    value:
      report?.actions
        .filter(
          (a) =>
            a.name === key ||
            (key === "builder.add_method" && a.name.startsWith(key + ".")),
        )
        .reduce((n, a) => n + Number(a.count), 0) ?? 0,
  }));
  return (
    <AdminWorkspace className={userId ? "analytics-workspace" : "analytics-workspace analytics-overview"}>
      <div className="top">
        <div>
          <h2>{userId ? "Активность пользователя" : "Аналитика платформы"}</h2>
          <span className="muted">
            {userId ? "Посещения, действия и активное время пользователя." : "Посещения публичных страниц и активность в кабинете — с согласия на аналитику."}
          </span>
        </div>
        <div className="tabs">
          {[["today","Сегодня"],["yesterday","Вчера"],["24h","24 часа"],["7","7 дней"],["30","30 дней"],["90","90 дней"]].map(([value,label]) => (
            <Button
              key={value}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {label}
            </Button>
          ))}
          <Button onClick={() => setRefresh((v) => v + 1)}>Обновить</Button>
        </div>
      </div>
      {!userId && <div className="tabs" aria-label="Аудитория">
        {[["all","Все посетители"],["registered","Зарегистрированные"],["guests","Гости"]].map(([value,label]) => <Button key={value} aria-pressed={audience === value} onClick={() => setAudience(value)}>{label}</Button>)}
      </div>}
      <p className="muted">Дни и часы — по Москве (UTC+3). «24 часа» — скользящий период. Учитываются только посетители, разрешившие аналитику.</p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {loading ? (
        <SkeletonScreen variant="dashboard" heading={false} />
      ) : summary && Number(summary.events) > 0 ? (
        <>
          <div className="summary-metrics">
            {[
              [summary.users, "посетителей"],
              ...(!userId ? [[summary.registeredUsers,"зарегистрированных"],[summary.guests,"гостевых браузеров"]] : []),
              [summary.sessions, "сессий"],
              [summary.pageViews, "открытий экранов"],
              [summary.clicks, "нажатий"],
              [minutes(summary.activeMs), "активное время"],
              [summary.errors, "ошибок"],
            ].map(([v, label]) => (
              <div className="metric" key={label}>
                <b>{v}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="columns">
            <section className="panel">
              <h2>Использование экранов</h2>
              <Bars
                items={report!.pages.map((p) => ({
                  label: pages[p.page] ?? p.page,
                  value: p.views,
                }))}
              />
            </section>
            <section className="panel">
              <h2>Использование функций</h2>
              <p className="muted">
                Нулевые значения показывают функции, которыми за этот период не
                пользовались.
              </p>
              <Bars items={coreUsage} />
            </section>
          </div>
          {audience !== "guests" && <section className="panel">
            <h2>Путь к исследованию</h2>
            <p className="muted">
              Число пользователей, открывших каждый экран за период. Этапы
              независимы: это охват функций, а не последовательная конверсия.
            </p>
            <Bars
              items={[
                "/app",
                "/app/surveys/new",
                "/app/surveys/:id/edit",
                "/app/surveys/:id/results",
              ].map((p) => ({
                label: pages[p],
                value: report!.funnel.find((f) => f.page === p)?.users ?? 0,
              }))}
            />
          </section>}
          <section className="panel">
            <h2>{report!.hourly.length ? "Посещения по часам" : "Посещения по дням"}</h2>
            <Bars
              items={report!.hourly.length ? report!.hourly.map(h => ({label:new Date(h.hour).toLocaleString("ru-RU",{timeZone:"Europe/Moscow",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),value:h.views})) : report!.daily.map((d) => ({
                label: new Date(d.day).toLocaleDateString("ru-RU"),
                value: d.views,
              }))}
            />
          </section>
          <section className="panel">
            <h2>Последние сессии</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Начало</th>
                    <th>Устройство</th>
                    <th>Активное время</th>
                    <th>Нажатия</th>
                    <th>Ошибки</th>
                    <th>Действия и запись</th>
                  </tr>
                </thead>
                <tbody>
                  {report!.sessions.map((s) => (
                    <tr key={`${s.userId ?? s.visitorId}:${s.id}`}>
                      <td>
                        {dateTime(s.startedAt)}
                        {!userId && (
                          <div>
                            {s.userId ? <Link to={`/app/admin/users/${s.userId}`}>
                              {s.userName || "Пользователь"}
                            </Link> : <span className="muted">Гость</span>}
                          </div>
                        )}
                      </td>
                      <td>{device(s.userAgent)}</td>
                      <td>{minutes(s.activeMs)}</td>
                      <td>{s.clicks}</td>
                      <td>{s.errors}</td>
                      <td>
                        <Button onClick={() => setSession(s)}>
                          {s.hasReplay ? "Смотреть запись" : "Открыть действия"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="panel">
            <h2>Последние действия</h2>
            <ul className="timeline">
              {report!.events.map((e, i) => (
                <li key={e.id ?? i}>
                  <div>
                    <b>
                      {e.instrumentTitle
                        ? `${actionName(e.name).split(" · ")[0]} · ${e.instrumentTitle}`
                        : actionName(e.name)}
                    </b>
                    <small>
                      {pages[e.page] ?? e.page}
                      {e.surveyTitle ? ` · ${e.surveyTitle}` : ""}
                    </small>
                  </div>
                  <small>{dateTime(e.at)}</small>
                  {!userId && <small>{e.userId ? e.userName || "Пользователь" : "Гость"}</small>}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : !error ? (
        <div className="panel empty">
          <h2>За выбранный период нет истории действий</h2>
          <p>
            События появятся после посещения платформы с разрешённой аналитикой.
            Действия до включения аналитики восстановить невозможно. Выберите
            другой период или обновите данные позже.
          </p>
        </div>
      ) : null}
      <p className="retention">
        События хранятся 90 дней, записи экранов — 14 дней. Активное время
        учитывается во вкладке на переднем плане после действий пользователя.
        Тексты и поля ввода скрыты, экраны результатов не записываются. Для гостей записи экранов не собираются. Гости считаются по браузерам: другой браузер или удаление cookies создают нового посетителя. Отказавшие в аналитике не учитываются.
      </p>
      <Modal
        open={!!session}
        onCancel={() => setSession(null)}
        footer={null}
        width={1000}
        title={session?.userId ? "Сессия пользователя" : "Сессия гостя"}
        destroyOnHidden
      >
        <AdminWorkspace>
          {detailLoading ? (
            <SkeletonScreen variant="details" heading={false} label="Загрузка сессии" />
          ) : detailError ? (
            <p role="alert" className="error">
              {detailError}
            </p>
          ) : (
            details && (
              <>
                {details.replay.some((e: any) => e.type === 2) &&
                details.replay.length > 1 ? (
                  <Replay events={details.replay} />
                ) : (
                  <p className="muted">
                    Запись экрана недоступна. Ниже — сохранённые действия.
                  </p>
                )}
                <ul className="timeline">
                  {details.events
                    .filter((e) => e.type !== "active_time")
                    .map((e, i) => (
                      <li key={i}>
                        <div>
                          <b>{names[e.name] ?? e.name}</b>
                          <small>{pages[e.page] ?? e.page}</small>
                        </div>
                        <small>{dateTime(e.at)}</small>
                      </li>
                    ))}
                </ul>
              </>
            )
          )}
        </AdminWorkspace>
      </Modal>
    </AdminWorkspace>
  );
}
