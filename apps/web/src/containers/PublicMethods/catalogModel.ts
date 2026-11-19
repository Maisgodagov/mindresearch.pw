import type { PublicMethod } from "./types";
export type CatalogMethod = PublicMethod & { questionCount?: number };
export { sectionForTopic } from "../../../../api/src/public-methods/discovery";
export type CatalogPage = {
  items: CatalogMethod[];
  total: number;
  catalogTotal: number;
  page: number;
  pageCount: number;
  pageSize: number;
  topics: { topic: string; count: number; section: string }[];
};
export function collections(methods: CatalogMethod[]) {
  const topics = new Map<string, CatalogMethod[]>();
  for (const method of methods)
    topics.set(method.topic, [...(topics.get(method.topic) ?? []), method]);
  return [...topics].map(([topic, items]) => ({ topic, items }));
}
export function findMethods(
  methods: CatalogMethod[],
  topic: string | readonly string[],
  query: string,
) {
  const search = query.trim().toLocaleLowerCase("ru");
  const topics = typeof topic === "string" ? (topic ? [topic] : []) : topic;
  return methods.filter(
    (m) =>
      (!topics.length || topics.includes(m.topic)) &&
      `${m.name} ${m.title} ${m.abbreviation} ${m.topic} ${m.intro}`
        .toLocaleLowerCase("ru")
        .includes(search),
  );
}
export function methodCount(count: number) {
  const form = new Intl.PluralRules("ru").select(count);
  return `${count} ${form === "one" ? "методика" : form === "few" ? "методики" : "методик"}`;
}
