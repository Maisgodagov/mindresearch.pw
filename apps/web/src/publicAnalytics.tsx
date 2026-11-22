import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { publicAnalyticsPath } from "../../api/src/analytics-policy";
import { api, getCachedCurrentUser, getCurrentUser, initializeAuth, sendAnalyticsOnUnload } from "./api";
import { hasAnalyticsConsent, useAnalyticsConsent } from "./analyticsConsent";

type Attribution = {source:string; medium?:string; campaign?:string; entryPage:string};
const tags = new URLSearchParams(window.location.search);
const safeTag = (name:string, max:number) => {
  const value = tags.get(name)?.trim().slice(0,max);
  return value && /^[a-z0-9._-]+$/i.test(value) ? value : undefined;
};
function entryAttribution(entryPage:string): Attribution {
  const taggedSource = safeTag("utm_source",160);
  if (taggedSource) return {entryPage,source:taggedSource.toLowerCase(),medium:safeTag("utm_medium",80),campaign:safeTag("utm_campaign",120)};
  try {
    const host = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./,"");
    if (host === window.location.hostname.replace(/^www\./,"")) return {entryPage,source:"unknown"};
    if (/^google\.(?:com|ru|[a-z]{2}|co\.[a-z]{2})$/.test(host)) return {entryPage,source:"google",medium:"organic"};
    if (/^yandex\.(?:ru|com|kz|by|uz)$/.test(host) || host === "ya.ru") return {entryPage,source:"yandex",medium:"organic"};
    if (/^[a-z0-9.-]{1,160}$/.test(host)) return {entryPage,source:host,medium:"referral"};
  } catch { /* Referrer is absent. */ }
  return {entryPage,source:"unknown"};
}
let attribution: Attribution | undefined;
type Lifecycle = "test.started" | "test.completed" | "respondent.started" | "respondent.completed";
export function trackPublicLifecycle(name:Lifecycle) {
  window.dispatchEvent(new CustomEvent("mr-public-lifecycle",{detail:name}));
}

type PublicEvent = Attribution & {id:string;sessionId:string;type:string;page:string;name:string;durationMs:number;at:number};
let sessionId = "", owner = "", lastEvent = 0;
let pendingUpload: Promise<unknown> = Promise.resolve();
export function PublicAnalytics() {
  const { pathname } = useLocation();
  const consent = useAnalyticsConsent();
  useEffect(() => {
    if (consent === "deny") {
      sessionId = ""; owner = ""; attribution = undefined;
      void api.post("/analytics/forget").catch(() => {});
    }
  }, [consent]);
  useEffect(() => {
    const page = publicAnalyticsPath(pathname);
    if (consent !== "allow" || !page) return;
    const respondent = page === "/s/:slug";
    let live = true, ready = false, sending = false, lastInput = performance.now(), lastTick = performance.now();
    let queue: PublicEvent[] = [];
    const event = (type: string, name: string, durationMs = 0) => {
      if (!ready || !attribution || !hasAnalyticsConsent()) return;
      lastEvent = Date.now();
      queue.push({ ...attribution, id:crypto.randomUUID(), sessionId, type, page, name, durationMs, at:Date.now() });
      queue = queue.slice(-100);
    };
    const flush = async () => {
      if (!hasAnalyticsConsent()) { queue = []; return; }
      if (sending || !queue.length) return;
      sending = true;
      const batch = queue.splice(0,50);
      let uploaded = false;
      try {
        // Serialize route changes so the first guest cookie is set before the next batch.
        pendingUpload = pendingUpload.catch(() => {}).then(() => hasAnalyticsConsent() ? api.post("/analytics/events", {events:batch}) : undefined);
        await pendingUpload;
        uploaded = true;
      }
      catch { if (live && hasAnalyticsConsent()) queue = [...batch,...queue].slice(-100); }
      finally {
        sending = false;
        if (!hasAnalyticsConsent()) void api.post("/analytics/forget").catch(() => {});
        else if (uploaded && queue.length) void flush();
      }
    };
    void (async () => {
      if (!respondent) await initializeAuth().catch(() => {});
      const user = respondent ? null : getCachedCurrentUser() ?? await getCurrentUser().catch(() => null);
      if (!live || !hasAnalyticsConsent()) return;
      const currentOwner = respondent ? "respondent" : user?.id ?? "guest";
      if (!sessionId || owner !== currentOwner || Date.now() - lastEvent > 30 * 60_000) {
        sessionId = crypto.randomUUID();
        attribution = !attribution || !owner ? entryAttribution(page) : {entryPage:page,source:"unknown"};
      }
      owner = currentOwner; ready = true;
      event("page_view", "screen.open"); void flush();
    })();
    const input = () => { lastInput = performance.now(); };
    const tick = () => {
      const now = performance.now();
      if (!document.hidden && now - lastInput < 60_000) event("active_time", "screen.active", Math.round(Math.min(10_000,now - lastTick)));
      lastTick = now;
    };
    const lifecycle = (e: Event) => {
      event("click",(e as CustomEvent<Lifecycle>).detail);
      void flush();
    };
    const click = (e: MouseEvent) => {
      if (respondent) return;
      input();
      const target = (e.target as Element)?.closest('button,a,[role="button"]');
      if (!target || target.closest("[data-analytics-private]")) return;
      const explicit = (target as HTMLElement).dataset.analytics;
      event("click", explicit === "test.start" || explicit === "test.share" ? explicit : "control.click");
    };
    const visibility = () => { if (document.hidden) { lastTick = performance.now(); void flush(); } else { lastTick = performance.now(); } };
    const unload = () => { const batch = queue.splice(0,50); sendAnalyticsOnUnload(batch,true); };
    const timer = setInterval(() => { tick(); void flush(); },10_000);
    document.addEventListener("click",click,true);
    document.addEventListener("keydown",input,true);
    document.addEventListener("pointerdown",input,{passive:true});
    document.addEventListener("visibilitychange",visibility);
    window.addEventListener("pagehide",unload);
    window.addEventListener("mr-public-lifecycle", lifecycle);
    return () => {
      live = false; void flush(); clearInterval(timer);
      document.removeEventListener("click",click,true); document.removeEventListener("keydown",input,true);
      document.removeEventListener("pointerdown",input); document.removeEventListener("visibilitychange",visibility);
      window.removeEventListener("pagehide",unload);
      window.removeEventListener("mr-public-lifecycle", lifecycle);
    };
  }, [pathname,consent]);
  return null;
}
