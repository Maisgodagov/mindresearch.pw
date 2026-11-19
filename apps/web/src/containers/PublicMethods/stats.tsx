import { useEffect, useState } from "react";
import { CircleCheck, Eye } from "lucide-react";
import { api, getCurrentUser } from "../../api";

export type MethodCounts = { views: number; completions: number };
type StatsRow = MethodCounts & { slug: string };
const zero: MethodCounts = { views: 0, completions: 0 };
const number = new Intl.NumberFormat("ru-RU");

async function recordView(slug: string) {
  const key = "mr_public_view_session";
  let session = sessionStorage.getItem(key);
  if (!session) {
    session = crypto.randomUUID();
    sessionStorage.setItem(key, session);
  }
  await fetch(`/api/public/methods/${encodeURIComponent(slug)}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });
}

export function useMethodStats(viewedSlug?: string) {
  const [stats, setStats] = useState<Map<string, MethodCounts> | null>(null);
  useEffect(() => {
    let active = true;
    const visit = viewedSlug ? recordView(viewedSlug).catch(() => {}) : Promise.resolve();
    void getCurrentUser().then(async user => {
      if (!["admin", "owner"].includes(user.role)) return;
      await visit;
      if (!active) return;
      const { data } = await api.get<StatsRow[]>("/admin/public-methods/stats");
      if (active) setStats(new Map(data.map(row => [row.slug, row])));
    }).catch(() => {
      if (active) setStats(null);
    });
    return () => { active = false; };
  }, [viewedSlug]);
  return (slug: string) => stats ? stats.get(slug) ?? zero : undefined;
}

export function MethodStatsBadge({ counts }: { counts: MethodCounts }) {
  return <p className="pm-method-stats" aria-label="Статистика для администратора">
    <span><Eye size={15} aria-hidden="true" />Просмотры: {number.format(counts.views)}</span>
    <span><CircleCheck size={15} aria-hidden="true" />Прохождения: {number.format(counts.completions)}</span>
  </p>;
}
