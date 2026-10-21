import type { PublicMethod } from "./types";
export type CatalogMethod = PublicMethod & { questionCount?: number };
export function collections(methods: CatalogMethod[]) {
  const topics = new Map<string, CatalogMethod[]>();
  for (const method of methods)
    topics.set(method.topic, [...(topics.get(method.topic) ?? []), method]);
  return [...topics].map(([topic, items]) => ({ topic, items }));
}
export function findMethods(
  methods: CatalogMethod[],
  topic: string,
  query: string,
) {
  const search = query.trim().toLocaleLowerCase("ru");
  return methods.filter(
    (m) =>
      (!topic || m.topic === topic) &&
      `${m.name} ${m.title} ${m.abbreviation} ${m.topic} ${m.intro}`
        .toLocaleLowerCase("ru")
        .includes(search),
  );
}
export function methodCount(count: number) {
  const form = new Intl.PluralRules("ru").select(count);
  return `${count} ${form === "one" ? "методика" : form === "few" ? "методики" : "методик"}`;
}
