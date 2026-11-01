import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { publicAnalyticsPath } from "../../api/src/analytics-policy";
import { api, getCachedCurrentUser, getCurrentUser, initializeAuth, sendAnalyticsOnUnload } from "./api";
import { hasAnalyticsConsent, useAnalyticsConsent } from "./analyticsConsent";

type PublicEvent = {id:string;sessionId:string;type:string;page:string;name:string;durationMs:number;at:number};
let sessionId = "", owner = "", lastEvent = 0;
let pendingUpload: Promise<unknown> = Promise.resolve();
export function PublicAnalytics() {
  const { pathname } = useLocation();
  const consent = useAnalyticsConsent();
  useEffect(() => {
    if (consent === "deny") {
      sessionId = ""; owner = "";
      void api.post("/analytics/forget").catch(() => {});
    }
  }, [consent]);
  useEffect(() => {
    const page = publicAnalyticsPath(pathname);
    if (consent !== "allow" || !page) return;
    let live = true, ready = false, sending = false, lastInput = performance.now(), lastTick = performance.now();
    let queue: PublicEvent[] = [];
    const event = (type: string, name: string, durationMs = 0) => {
      if (!ready || !hasAnalyticsConsent()) return;
      lastEvent = Date.now();
      queue.push({ id:crypto.randomUUID(), sessionId, type, page, name, durationMs, at:Date.now() });
      queue = queue.slice(-100);
    };
    const flush = async () => {
      if (!hasAnalyticsConsent()) { queue = []; return; }
      if (sending || !queue.length) return;
      sending = true;
      const batch = queue.splice(0,50);
      try {
        // Serialize route changes so the first guest cookie is set before the next batch.
        pendingUpload = pendingUpload.catch(() => {}).then(() => hasAnalyticsConsent() ? api.post("/analytics/events", {events:batch}) : undefined);
        await pendingUpload;
      }
      catch { if (live && hasAnalyticsConsent()) queue = [...batch,...queue].slice(-100); }
      finally {
        sending = false;
        if (!hasAnalyticsConsent()) void api.post("/analytics/forget").catch(() => {});
      }
    };
    void (async () => {
      await initializeAuth().catch(() => {});
      const user = getCachedCurrentUser() ?? await getCurrentUser().catch(() => null);
      if (!live || !hasAnalyticsConsent()) return;
      const currentOwner = user?.id ?? "guest";
      if (!sessionId || owner !== currentOwner || Date.now() - lastEvent > 30 * 60_000) sessionId = crypto.randomUUID();
      owner = currentOwner; ready = true;
      event("page_view", "screen.open"); void flush();
    })();
    const input = () => { lastInput = performance.now(); };
    const tick = () => {
      const now = performance.now();
      if (!document.hidden && now - lastInput < 60_000) event("active_time", "screen.active", Math.round(Math.min(10_000,now - lastTick)));
      lastTick = now;
    };
    const click = (e: MouseEvent) => {
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
    return () => {
      live = false; void flush(); clearInterval(timer);
      document.removeEventListener("click",click,true); document.removeEventListener("keydown",input,true);
      document.removeEventListener("pointerdown",input); document.removeEventListener("visibilitychange",visibility);
      window.removeEventListener("pagehide",unload);
    };
  }, [pathname,consent]);
  return null;
}
