import type { Answer, Respondent } from "./types";

export const QUALITY_VERSION = "1.0";
export const FAST_MS = 1000;
export const MIN_PEERS = 5;
export const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const mean = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const difference = (own: number | null, baseline: number | null) => own !== null && baseline !== null && baseline > 0 ? (1 - own / baseline) * 100 : null;
const measured = (answer: Answer) => answer.activeMs != null && Number.isFinite(answer.activeMs) && answer.activeMs >= 0;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const questionKey = (groupId: string, code: string) => JSON.stringify([groupId, code]);

export type QuestionComparison = { medianMs: number | null; peers: number; faster: number | null };
export type Quality = {
  quality: number | null; averageMs: number | null; medianMs: number | null; activeMs: number | null;
  fastShare: number | null; fastRun: number | null; fastCount: number; timed: number; total: number; coverage: number;
  questionFaster: number | null; surveyFaster: number | null; surveyMedianFaster: number | null;
  durationFaster: number | null; acceleration: number | null;
  sameRun: number | null; sameRuns: { title: string; length: number; label: string }[];
  flags: string[]; unavailable: string; comparisons: Record<string, QuestionComparison>;
  penalties: { label: string; points: number }[];
};
export type MetricKey = "quality" | "averageMs" | "medianMs" | "activeMs" | "fastShare" | "fastRun" | "questionFaster" | "surveyFaster" | "surveyMedianFaster" | "durationFaster" | "acceleration" | "sameRun" | "coverage";
export const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "quality", label: "Индекс качества", unit: "%" },
  { key: "fastShare", label: "Доля ответов < 1 сек", unit: "%" },
  { key: "fastRun", label: "Серия ответов < 1 сек", unit: "вопросов" },
  { key: "questionFaster", label: "Быстрее медиан вопросов", unit: "%" },
  { key: "surveyFaster", label: "Быстрее среднего активного времени", unit: "%" },
  { key: "surveyMedianFaster", label: "Быстрее медианы активного времени", unit: "%" },
  { key: "durationFaster", label: "Быстрее среднего времени прохождения", unit: "%" },
  { key: "acceleration", label: "Ускорение к концу", unit: "%" },
  { key: "sameRun", label: "Серия одинаковых ответов", unit: "вопросов" },
  { key: "averageMs", label: "Среднее время на вопрос", unit: "сек" },
  { key: "medianMs", label: "Медиана времени на вопрос", unit: "сек" },
  { key: "activeMs", label: "Активное время ответов", unit: "сек" },
  { key: "coverage", label: "Покрытие измерениями", unit: "%" },
];

// Baselines always use the full non-deleted sample, exclude the current person,
// and require at least five completed peers. UI filters never alter them.
export function calculateQuality(respondents: Respondent[]): Record<string, Quality> {
  const people = respondents.map(person => {
    const groups = person.groups.filter(group => group.code !== "respondent");
    const entries = groups.flatMap(group => group.answers.map(answer => ({ key: questionKey(group.id, answer.code), answer })));
    const timed = entries.filter(entry => measured(entry.answer));
    const allMeasured = entries.length > 0 && timed.length === entries.length;
    const fingerprint = entries.map(entry => entry.key).sort().join("|");
    const duration = person.completedAt ? Date.parse(person.completedAt) - Date.parse(person.startedAt) : NaN;
    return { person, groups, entries, timed, fingerprint, allMeasured,
      active: timed.length ? timed.reduce((sum, entry) => sum + entry.answer.activeMs!, 0) : null,
      duration: Number.isFinite(duration) && duration > 0 ? duration : null };
  });
  const samples = new Map<string, { id: string; time: number }[]>();
  for (const item of people) if (item.person.status === "completed") for (const entry of item.timed) {
    const values = samples.get(entry.key) ?? [];
    values.push({ id: item.person.id, time: entry.answer.activeMs! }); samples.set(entry.key, values);
  }
  const baselines = new Map([...samples].map(([key, values]) => {
    values.sort((a, b) => a.time - b.time);
    return [key, { values, positions: new Map(values.map((value, index) => [value.id, index])) }] as const;
  }));
  const result: Record<string, Quality> = {};
  for (const item of people) {
    const { person, groups, entries, timed } = item;
    const comparisons: Quality["comparisons"] = {};
    const ratios = new Map<string, number>();
    for (const entry of timed) {
      const sample = baselines.get(entry.key) ?? { values: [], positions: new Map<string, number>() };
      const ownPosition = sample.positions.get(person.id);
      const count = sample.values.length - (ownPosition === undefined ? 0 : 1);
      const at = (index: number) => sample.values[index + (ownPosition !== undefined && index >= ownPosition ? 1 : 0)].time;
      const middle = Math.floor(count / 2);
      const baseline = count >= MIN_PEERS ? count % 2 ? at(middle) : (at(middle - 1) + at(middle)) / 2 : null;
      comparisons[entry.key] = { medianMs: baseline, peers: count, faster: difference(entry.answer.activeMs!, baseline) };
      if (baseline !== null && baseline > 0) ratios.set(entry.key, entry.answer.activeMs! / baseline);
    }
    let fastRun = 0, sameRun = 0, comparable = 0;
    const sameRuns: Quality["sameRuns"] = [];
    for (const group of groups) {
      let fast = 0, same = 0, previousPosition: number | undefined, previousScale = "", previousValue = "";
      let best = 0, bestLabel = "";
      for (const answer of group.answers) {
        const consecutive = previousPosition !== undefined && answer.position === previousPosition + 1;
        fast = measured(answer) && answer.activeMs! < FAST_MS ? (consecutive ? fast + 1 : 1) : 0;
        fastRun = Math.max(fastRun, fast);
        const eligible = answer.type === "single" && (answer.options?.length ?? 0) >= 2 && answer.options?.some(option => String(option.value) === String(answer.value));
        const scale = eligible ? JSON.stringify(answer.options) : "", value = String(answer.value);
        if (eligible) comparable++;
        same = eligible ? (consecutive && scale === previousScale && value === previousValue ? same + 1 : 1) : 0;
        if (same > best) { best = same; bestLabel = answer.displayValue; }
        previousScale = scale; previousValue = value; previousPosition = answer.position;
      }
      sameRun = Math.max(sameRun, best);
      if (best >= 5) sameRuns.push({ title: group.title, length: best, label: bestLabel });
    }
    const fastCount = timed.filter(entry => entry.answer.activeMs! < FAST_MS).length;
    const fastShare = timed.length ? fastCount / timed.length * 100 : null;
    const third = Math.floor(entries.length / 3);
    const part = (subset: typeof entries) => subset.flatMap(entry => ratios.has(entry.key) ? [ratios.get(entry.key)!] : []);
    const first = part(entries.slice(0, third)), last = part(entries.slice(-third));
    const enoughParts = third >= 3 && first.length >= Math.max(3, Math.ceil(third * .8)) && last.length >= Math.max(3, Math.ceil(third * .8));
    const acceleration = enoughParts ? difference(median(last), median(first)) : null;
    const activePeers = people.filter(peer => peer.person.id !== person.id && peer.person.status === "completed" && peer.allMeasured && peer.fingerprint === item.fingerprint && peer.active !== null);
    const surveyFaster = item.allMeasured && activePeers.length >= MIN_PEERS ? difference(item.active, mean(activePeers.map(peer => peer.active!))) : null;
    const surveyMedianFaster = item.allMeasured && activePeers.length >= MIN_PEERS ? difference(item.active, median(activePeers.map(peer => peer.active!))) : null;
    const durationPeers = people.filter(peer => peer.person.id !== person.id && peer.person.status === "completed" && peer.fingerprint === item.fingerprint && peer.duration !== null);
    const durationFaster = durationPeers.length >= MIN_PEERS ? difference(item.duration, mean(durationPeers.map(peer => peer.duration!))) : null;
    const ratio = ratios.size >= Math.max(5, Math.ceil(timed.length * .8)) ? median([...ratios.values()]) : null;
    const questionFaster = ratio !== null ? (1 - ratio) * 100 : null;
    const coverage = entries.length ? timed.length / entries.length * 100 : 0;
    const penalties = [
      { label: "Доля быстрых ответов", points: 30 * clamp(((fastShare ?? 0) - 5) / 45) },
      { label: "Серия быстрых ответов", points: 10 * clamp((fastRun - 2) / 8) },
      { label: "Скорость относительно вопросов", points: 10 * clamp(((questionFaster ?? 0) - 50) / 40) },
      { label: "Активное время всего опроса", points: 10 * clamp(((surveyMedianFaster ?? 0) - 50) / 40) },
      { label: "Ускорение к концу", points: 15 * clamp(((acceleration ?? 0) - 40) / 40) },
      { label: "Одинаковые ответы", points: 25 * clamp((sameRun - 4) / 11) },
    ];
    const unavailable = person.status !== "completed" ? "Опрос ещё не завершён" : timed.length < 10 || coverage < 80 ? "Нужно минимум 10 измеренных ответов и покрытие от 80%" : questionFaster === null || surveyMedianFaster === null || acceleration === null ? "Недостаточно сопоставимых измерений: нужно минимум 5 других завершённых прохождений" : comparable < 10 ? "Для индекса нужно минимум 10 ответов с сопоставимыми шкалами выбора" : "";
    const flags: string[] = [];
    if ((fastShare ?? 0) >= 20) flags.push("Много ответов быстрее секунды");
    if (fastRun >= 5) flags.push("Серия быстрых ответов");
    if ((questionFaster ?? 0) >= 50) flags.push("Быстрее медиан вопросов на 50% и более");
    if ((surveyMedianFaster ?? 0) >= 50) flags.push("Малое активное время опроса");
    if ((acceleration ?? 0) >= 40) flags.push("Заметное ускорение к концу");
    if (sameRun >= 5) flags.push("Серия одинаковых ответов");
    result[person.id] = { quality: unavailable ? null : Math.round(100 - penalties.reduce((sum, penalty) => sum + penalty.points, 0)),
      averageMs: mean(timed.map(entry => entry.answer.activeMs!)), medianMs: median(timed.map(entry => entry.answer.activeMs!)), activeMs: item.active,
      fastShare, fastRun: timed.length ? fastRun : null, fastCount, timed: timed.length, total: entries.length, coverage,
      questionFaster, surveyFaster, surveyMedianFaster, durationFaster, acceleration,
      sameRun: comparable ? sameRun : null, sameRuns, flags, unavailable, comparisons, penalties };
  }
  return result;
}

export type QualityFilter = { metric: MetricKey; operator: "gte" | "lte" | "missing"; value: string };
export type QualityView = { sort: "newest" | "oldest" | MetricKey; direction: "asc" | "desc"; status: "all" | "completed" | "in_progress"; filters: QualityFilter[] };
export const DEFAULT_QUALITY_VIEW: QualityView = { sort: "newest", direction: "desc", status: "all", filters: [] };
export function applyQualityView(people: Respondent[], qualities: Record<string, Quality>, view: QualityView) {
  const visible = people.filter(person => (view.status === "all" || person.status === view.status) && view.filters.every(filter => {
    const value = qualities[person.id]?.[filter.metric] ?? null;
    if (filter.operator === "missing") return value === null;
    if (!filter.value.trim()) return true;
    const threshold = Number(filter.value);
    if (!Number.isFinite(threshold)) return true;
    const adjusted = ["averageMs", "medianMs", "activeMs"].includes(filter.metric) && value !== null ? value / 1000 : value;
    return adjusted !== null && (filter.operator === "gte" ? adjusted >= threshold : adjusted <= threshold);
  }));
  if (view.sort === "newest") return visible; // Preserve the API's existing chronological order exactly.
  if (view.sort === "oldest") return visible.reverse();
  const key = view.sort;
  return visible.sort((a, b) => {
    const av = qualities[a.id]?.[key] ?? null, bv = qualities[b.id]?.[key] ?? null;
    if (av === null) return bv === null ? 0 : 1;
    if (bv === null) return -1;
    return (av - bv) * (view.direction === "asc" ? 1 : -1);
  });
}
