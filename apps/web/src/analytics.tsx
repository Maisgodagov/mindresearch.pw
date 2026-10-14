import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api, getCurrentUser, sendAnalyticsOnUnload } from "./api";

type Event = {
  id: string;
  sessionId: string;
  type: string;
  page: string;
  name: string;
  durationMs: number;
  surveyId: string | null;
  at: number;
};
export const analyticsPage = (path: string) =>
  path
    .replace(/\/surveys\/[^/]+\/(edit|results)/, "/surveys/:id/$1")
    .split("?")[0];
let owner = "",
  lastEvent = 0;
let queue: Event[] = [],
  sending = false,
  sessionId = "",
  page = "",
  lastInput = Date.now();
let stopReplay: (() => void) | undefined;
let replay: unknown[] = [],
  sequence = 0,
  replaySending = false;
const replayLimit = 140_000;
const labels: Record<string, string> = {
  "Новый опрос": "survey.create",
  Опубликовать: "survey.publish",
  "Скопировать ссылку": "survey.copy_link",
  Ссылка: "survey.copy_link",
  Статистика: "survey.statistics",
  Продолжить: "survey.edit",
  Сохранить: "save",
  "Мои опросы": "navigation.surveys",
  Профиль: "navigation.profile",
  Создать: "navigation.create",
  "Запросить методику": "navigation.request_method",
  "Сообщить об ошибке": "support.report",
  Завершить: "survey.archive",
  "Добавить вопрос": "builder.add_question",
  "Добавить методику": "builder.add_method",
  Предпросмотр: "survey.preview",
  Экспортировать: "results.export",
  Удалить: "delete",
  Войти: "login",
  Выйти: "logout",
  Корзина: "trash.open",
  "Показать показатели качества": "quality.expand",
  "Скрыть показатели качества": "quality.collapse",
};
function event(type: string, name: string, durationMs = 0) {
  if (!page || !sessionId) return;
  lastEvent = Date.now();
  queue.push({
    id: crypto.randomUUID(),
    sessionId,
    type,
    page,
    name,
    durationMs,
    surveyId:
      location.pathname.match(/\/surveys\/([0-9a-f-]{36})/i)?.[1] ?? null,
    at: Date.now(),
  });
  if (queue.length > 200) queue.shift();
}
async function flush() {
  if (sending || !queue.length) return;
  sending = true;
  const batch = queue.splice(0, 50);
  try {
    await api.post("/account/analytics/events", { events: batch });
  } catch {
    queue.unshift(...batch);
    queue = queue.slice(-200);
  } finally {
    sending = false;
  }
}
async function flushReplay() {
  if (replaySending || !replay.length) return;
  replaySending = true;
  const events = replay.splice(0, 500),
    batchSequence = sequence++,
    id = sessionId;
  try {
    await api.post("/account/analytics/replay", {
      sessionId: id,
      sequence: batchSequence,
      events,
    });
  } catch {
    /* Bounded best-effort recordings; don't block product interactions. */
  } finally {
    replaySending = false;
  }
}
export function trackApi(method: string, url: string, status: number) {
  if (url.includes("/analytics") || !page) return;
  const safe = url.split("?")[0].replace(/[0-9a-f-]{36}/gi, ":id");
  if (status >= 400 || status === 0)
    event(
      "api_error",
      `${method}.${status || "network"}.${safe}`.slice(0, 120),
    );
  else if (method !== "get") {
    const name = safe.endsWith("/publish")
      ? "survey.published"
      : safe.endsWith("/account/surveys")
        ? "survey.created"
        : safe.includes("/draft-state")
          ? "survey.draft_saved"
          : safe.includes("/instrument-submissions")
            ? "method.requested"
            : safe.includes("/bug-reports")
              ? "support.sent"
              : "";
    if (name) event("feature", name);
  }
}
export function ProductAnalytics() {
  const location = useLocation();
  useEffect(() => {
    let live = true;
    stopReplay?.();
    stopReplay = undefined;
    page = "";
    if (
      !location.pathname.startsWith("/app") ||
      location.pathname.startsWith("/app/admin")
    )
      return;
    const path = analyticsPage(location.pathname);
    void getCurrentUser()
      .then(async (user) => {
        if (!live) return;
        // New recording segment per screen; IDs never persist across accounts/logouts.
        if (owner !== user.id || Date.now() - lastEvent > 30 * 60_000) {
          queue = [];
          replay = [];
          sessionId = crypto.randomUUID();
          sequence = 0;
          owner = user.id;
        }
        page = path;
        lastInput = Date.now();
        event("page_view", "screen.open");
        void flush();
        // Respondent statistics are tracked by feature events only, never recorded.
        if (path.endsWith("/results")) return;
        try {
          const [{ record }, { pack }] = await Promise.all([
            import("@rrweb/record"),
            import("@rrweb/packer"),
          ]);
          if (!live) return;
          stopReplay = record({
            maskAllInputs: true,
            maskTextSelector: "*",
            blockSelector: "[data-analytics-private],img,svg,canvas,iframe",
            recordCanvas: false,
            collectFonts: false,
            inlineStylesheet: true,
            sampling: { mousemove: 200, scroll: 300 },
            emit: (e) => {
              if (!live) return;
              const clean = JSON.parse(JSON.stringify(e));
              if (clean.type === 4) clean.data.href = path;
              // Attributes may contain labels, URLs or stored values even with text masking.
              const scrub = (node: any) => {
                if (!node || typeof node !== "object") return;
                if (node.attributes) {
                  for (const key of Object.keys(node.attributes)) {
                    if (
                      ![
                        "class",
                        "style",
                        "type",
                        "disabled",
                        "checked",
                        "selected",
                        "width",
                        "height",
                        "_cssText",
                      ].includes(key)
                    )
                      delete node.attributes[key];
                  }
                }
                for (const value of Object.values(node))
                  if (value && typeof value === "object")
                    Array.isArray(value) ? value.forEach(scrub) : scrub(value);
              };
              scrub(clean);
              const packed = pack(clean);
              if (JSON.stringify(packed).length > replayLimit) return;
              if (JSON.stringify([...replay, packed]).length > replayLimit)
                void flushReplay();
              if (
                replay.length < 500 &&
                JSON.stringify([...replay, clean]).length <= replayLimit
              )
                replay.push(packed);
            },
          });
        } catch {
          /* Analytics must not interrupt the app if recorder cannot load. */
        }
      })
      .catch(() => {});
    const input = () => {
      lastInput = Date.now();
    };
    const click = (e: MouseEvent) => {
      input();
      const target = (e.target as Element)?.closest(
        'button,a,[role="button"],[role="tab"]',
      ) as HTMLElement | null;
      if (!target) return;
      const label = (target.textContent ?? "").trim().replace(/\s+/g, " ");
      const explicit = target.dataset.analytics;
      let name =
        explicit && /^[a-zA-Z0-9_.-]{1,120}$/.test(explicit)
          ? explicit
          : Object.entries(labels).find(
              ([text]) => label === text || label.startsWith(text + " "),
            )?.[1];
      if (!name) {
        const href = target.getAttribute("href");
        name = href?.includes("/results")
          ? "survey.statistics"
          : href?.includes("/edit")
            ? "survey.edit"
            : target.getAttribute("role") === "tab"
              ? "tab.switch"
              : "control.click";
      }
      event("click", name);
    };
    const visibility = () => {
      if (document.hidden) {
        void flush();
        void flushReplay();
      }
    };
    const error = () => event("client_error", "runtime.error");
    const unload = () => sendAnalyticsOnUnload(queue);
    const timer = setInterval(() => {
      if (!document.hidden && Date.now() - lastInput < 60_000)
        event("active_time", "screen.active", 10_000);
      void flush();
      void flushReplay();
    }, 10_000);
    document.addEventListener("click", click, true);
    document.addEventListener("keydown", input, true);
    document.addEventListener("pointermove", input, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("error", error);
    window.addEventListener("unhandledrejection", error);
    window.addEventListener("pagehide", unload);
    return () => {
      live = false;
      stopReplay?.();
      stopReplay = undefined;
      void flush();
      void flushReplay();
      page = "";
      clearInterval(timer);
      document.removeEventListener("click", click, true);
      document.removeEventListener("keydown", input, true);
      document.removeEventListener("pointermove", input);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("error", error);
      window.removeEventListener("unhandledrejection", error);
      window.removeEventListener("pagehide", unload);
    };
  }, [location.pathname]);
  return null;
}
