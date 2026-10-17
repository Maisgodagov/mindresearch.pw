import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { api } from "../../api";
import { Button, SkeletonScreen } from "../../ui";
import { AdminWorkspace } from "./workspaceStyles";
import "rrweb-player/dist/style.css";

type Session = {
  id: string;
  userId: string;
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
  days: number;
  summary: {
    events: number;
    users: number;
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
const actionName = (key: string) =>
  names[key] ??
  coreActions[key] ??
  (key.startsWith("builder.add_method.")
    ? "Добавить методику · " + key.split(".").at(-1)
    : key.startsWith("catalog.method_details.")
      ? "Описание методики · " + key.split(".").at(-1)
      : key);
const pages: Record<string, string> = {
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
  const [days, setDays] = useState(30),
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
    setError("");
    api
      .get<Report>(
        userId ? `/admin/users/${userId}/analytics` : "/admin/analytics",
        { params: { days } },
      )
      .then((r) => {
        if (live) setReport(r.data);
      })
      .catch(() => {
        if (live)
          setError("Не удалось загрузить аналитику. Повторите попытку.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [days, userId, refresh]);
  useEffect(() => {
    if (!session) return;
    let live = true;
    setDetails(null);
    setDetailError("");
    setDetailLoading(true);
    api
      .get(`/admin/users/${session.userId}/analytics/sessions/${session.id}`)
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
  const coreUsage = Object.entries(coreActions).map(([key, label]) => ({
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
    <AdminWorkspace>
      <div className="top">
        <div>
          <h2>{userId ? "Активность пользователя" : "Аналитика платформы"}</h2>
          <span className="muted">
            Посещения, действия, активное время и ошибки в кабинете.
          </span>
        </div>
        <div className="tabs">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              aria-pressed={days === d}
              onClick={() => setDays(d)}
            >
              {d} дней
            </Button>
          ))}
          <Button onClick={() => setRefresh((v) => v + 1)}>Обновить</Button>
        </div>
      </div>
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
              [summary.users, "активных пользователей"],
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
          <section className="panel">
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
          </section>
          <section className="panel">
            <h2>Активность по дням</h2>
            <Bars
              items={report!.daily.map((d) => ({
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
                    <tr key={`${s.userId}:${s.id}`}>
                      <td>
                        {dateTime(s.startedAt)}
                        {!userId && (
                          <div>
                            <Link to={`/app/admin/users/${s.userId}`}>
                              {s.userName || "Пользователь"}
                            </Link>
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
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <div className="panel empty">
          <h2>История действий ещё не собрана</h2>
          <p>
            События появятся после использования кабинета с новой версией.
            Действия до включения аналитики восстановить невозможно. Выберите
            другой период или обновите данные позже.
          </p>
        </div>
      )}
      <p className="retention">
        События хранятся 90 дней, записи экранов — 14 дней. Активное время
        учитывается во вкладке на переднем плане после действий пользователя.
        Тексты, поля ввода и экраны ответов респондентов в записи скрыты.
      </p>
      <Modal
        open={!!session}
        onCancel={() => setSession(null)}
        footer={null}
        width={1000}
        title="Сессия пользователя"
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
