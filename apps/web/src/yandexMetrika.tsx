import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalyticsConsent } from "./analyticsConsent";

const counter = 114684110;
type Metrika = (...args: unknown[]) => void;
type Queue = Metrika & { a?: IArguments[]; l?: number };
const metrikaWindow = window as Window & { ym?: Queue };
let loading: Promise<void> | undefined;
let lastPage = "";

function loadMetrika() {
  if (!loading) {
    const queue: Queue = function () {
      (queue.a ??= []).push(arguments);
    };
    queue.l = Date.now();
    metrikaWindow.ym ??= queue;
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://mc.yandex.ru/metrika/tag.js?id=${counter}`;
      script.async = true;
      script.referrerPolicy = "origin";
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); reject(new Error("Metrika unavailable")); };
      document.head.append(script);
    }).catch(error => { loading = undefined; throw error; });
  }
  return loading;
}

export function YandexMetrika() {
  const { pathname, search, hash } = useLocation();
  const consent = useAnalyticsConsent();

  useLayoutEffect(() => {
    const publicPage = /^\/(?:for-researchers|methods(?:\/[a-z0-9-]+)?)\/?$/.test(pathname);
    const campaignOnly = [...new URLSearchParams(search).keys()].every(key =>
      /^utm_(?:source|medium|campaign|content|term)$/.test(key),
    );
    const enabled = import.meta.env.PROD && publicPage && !hash && campaignOnly && consent === "allow";
    document.body.classList.toggle("ym-hide-content", !enabled);
    if (!enabled) {
      if (lastPage) metrikaWindow.ym?.(counter, "destruct");
      lastPage = "";
      return;
    }

    const url = location.origin + pathname.replace(/\/$/, "") + "/" + search;
    let cancelled = false;
    void loadMetrika().then(() => {
      if (cancelled || lastPage === url) return;
      let referrer = lastPage;
      if (!referrer && document.referrer) {
        const origin = new URL(document.referrer).origin;
        if (origin !== location.origin) referrer = origin;
      }
      if (!lastPage) {
        metrikaWindow.ym?.(counter, "init", {
          defer: true, webvisor: true, trackHash: false, clickmap: false, trackLinks: false, accurateTrackBounce: false,
          url, referrer,
        });
      }
      metrikaWindow.ym?.(counter, "hit", url, { referer: referrer });
      lastPage = url;
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [pathname, search, hash, consent]);

  return null;
}
