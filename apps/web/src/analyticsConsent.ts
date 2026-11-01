import { useSyncExternalStore } from "react";
import { CONSENT_COOKIE, CONSENT_ALLOWED } from "../../api/src/analytics-policy";
export type AnalyticsConsent = "allow" | "deny" | null;
const changeEvent = "mindresearch:analytics-consent";
export function readAnalyticsConsent(): AnalyticsConsent {
  const value = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(CONSENT_COOKIE + "="))?.slice(CONSENT_COOKIE.length + 1);
  return value === CONSENT_ALLOWED ? "allow" : value === "v1.deny" ? "deny" : null;
}
export const hasAnalyticsConsent = () => readAnalyticsConsent() === "allow";
export function setAnalyticsConsent(choice: Exclude<AnalyticsConsent, null>) {
  document.cookie = `${CONSENT_COOKIE}=v1.${choice}; Path=/; Max-Age=${180 * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  try { localStorage.setItem(changeEvent, `${choice}:${Date.now()}`); } catch { /* Cookie preference still works without Web Storage. */ }
  window.dispatchEvent(new Event(changeEvent));
}
function subscribe(callback: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === changeEvent) callback(); };
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", storage); };
}
export const useAnalyticsConsent = () => useSyncExternalStore(subscribe, readAnalyticsConsent, () => null);
