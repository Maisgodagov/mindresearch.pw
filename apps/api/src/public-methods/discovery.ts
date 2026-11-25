import { z } from "zod";
import type { PublicMethod } from "./model.js";

const sections: Record<string, string> = {
  "Самооценка": "Личность и отношение к себе",
  "Самоэффективность": "Личность и отношение к себе",
  "Благополучие": "Эмоции и состояние",
  "Отношения": "Отношения",
  "Социальная поддержка": "Отношения",
  "Цифровые привычки": "Цифровая жизнь",
  "Черты личности": "Личность и отношение к себе",
  "Автономность": "Личность и отношение к себе",
  "Отношение к себе": "Личность и отношение к себе",
  "Психологическая гибкость": "Личность и отношение к себе",
  "Принадлежность": "Отношения",
  "Кибербуллинг": "Цифровая жизнь",
  "Стресс": "Эмоции и состояние",
  "Тревога": "Эмоции и состояние",
  "Эмоциональное состояние": "Эмоции и состояние",
  "Карьера": "Личность и отношение к себе",
  "Мотивация": "Личность и отношение к себе",
  "Саморазвитие": "Личность и отношение к себе",
  "Саморегуляция": "Эмоции и состояние",
  "Понимание эмоций": "Эмоции и состояние",
};
export const sectionForTopic = (topic: string) => sections[topic] ?? "Другие темы";
const text = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ru").replaceAll("ё", "е").replace(/\s+/g, " ").trim();
export const discoveryQuery = z.object({
  q: z.string().trim().max(200).default(""),
  section: z.string().max(100).default(""),
  topic: z.union([z.string().max(100), z.array(z.string().max(100)).max(50)]).optional(),
  page: z.coerce.number().int().min(1).max(100000).default(1),
});
export const catalogPageSize = 20;
export function catalogQueryKey(params: URLSearchParams) {
  const normalized = new URLSearchParams();
  for (const key of ["q", "section"]) if (params.get(key)) normalized.set(key, params.get(key)!);
  [...new Set(params.getAll("topic").filter(Boolean))].forEach(topic => normalized.append("topic", topic));
  const page = Number(params.get("page"));
  if (Number.isInteger(page) && page > 1) normalized.set("page", String(page));
  return normalized.toString();
}
export function discoverMethods(methods: PublicMethod[], input: z.input<typeof discoveryQuery>) {
  const query = discoveryQuery.parse(input);
  const topics = typeof query.topic === "string" ? [query.topic] : query.topic ?? [];
  const words = text(query.q).split(" ").filter(Boolean);
  const facets = new Map<string, number>();
  methods.forEach(method => facets.set(method.topic, (facets.get(method.topic) ?? 0) + 1));
  const score = (method: PublicMethod) => !query.q ? 0 : text(method.abbreviation) === text(query.q) ? 3 : text(method.title).startsWith(text(query.q)) ? 2 : text(method.name).includes(text(query.q)) ? 1 : 0;
  const matches = methods.filter(method => {
    const haystack = text([method.name, method.title, method.abbreviation, method.topic, method.intro, ...method.sources.map(source => source.title)].join(" "));
    return (!topics.length || topics.includes(method.topic)) &&
      (!query.section || sectionForTopic(method.topic) === query.section) && words.every(word => haystack.includes(word));
  }).sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title, "ru") || a.slug.localeCompare(b.slug));
  const pageCount = Math.max(1, Math.ceil(matches.length / catalogPageSize));
  const page = Math.min(query.page, pageCount);
  return {
    items: matches.slice((page - 1) * catalogPageSize, page * catalogPageSize),
    total: matches.length, catalogTotal: methods.length, page, pageCount, pageSize: catalogPageSize,
    topics: [...facets].map(([topic, count]) => ({ topic, count, section: sectionForTopic(topic) })),
  };
}
