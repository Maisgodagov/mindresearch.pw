export const CONSENT_COOKIE = "mindresearch_analytics_consent";
export const CONSENT_ALLOWED = "v1.allow";
export const publicAnalyticsPath = (path: string) => {
  const clean = path.replace(/\/+$/, "") || "/";
  return /^(?:\/for-researchers|\/methods(?:\/[a-z0-9-]+(?:\/start)?)?|\/assessment\/result|\/login|\/register)$/.test(clean)
    ? clean : null;
};

export function analyticsPeriod(value: string, now = Date.now()) {
  const day = 86_400_000, offset = 3 * 3_600_000;
  const midnight = Math.floor((now + offset) / day) * day - offset;
  if (value === "today") return { from: midnight, to: now, hourly: true };
  if (value === "yesterday") return { from: midnight - day, to: midnight, hourly: true };
  const days = value === "24h" ? 1 : Number(value);
  if (![1, 7, 30, 90].includes(days)) throw new Error("Unknown analytics period");
  return { from: now - days * day, to: now, hourly: days === 1 };
}
