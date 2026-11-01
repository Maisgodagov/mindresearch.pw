// Structural contract shared with the browser, without importing scoring code.
type SeoMethod = {
  slug: string; name: string; abbreviation: string; intro: string;
  seoTitle?: string; seoDescription?: string;
  sources: { title: string; url: string }[];
};
export const PUBLIC_ORIGIN = "https://mindresearch.pro";
export const methodPath = (slug?: string) => slug ? `/methods/${slug}/` : "/methods/";
const searchTitles: Record<string, string> = {
  "rosenberg-self-esteem": "Тест на самооценку Розенберга (RSES) онлайн | mindresearch",
  "general-self-efficacy": "Тест на самоэффективность Шварцера и Ерусалема (GSES) | mindresearch",
  "perceived-social-support": "Тест социальной поддержки (MSPSS) онлайн | mindresearch",
};
export function publicSeo(method?: SeoMethod) {
  const title = method?.seoTitle || (method
    ? searchTitles[method.slug] || `${method.name} (${method.abbreviation}) — тест онлайн | mindresearch`
    : "Психологические тесты онлайн без регистрации | mindresearch");
  const description = method?.seoDescription || method?.intro ||
    "Психологические тесты онлайн: самооценка, самоэффективность, социальная поддержка, счастье и удовлетворённость жизнью. Без регистрации, с результатами и источниками.";
  const url = PUBLIC_ORIGIN + methodPath(method?.slug);
  const image = `${PUBLIC_ORIGIN}/images/tests/${method?.slug || "catalog"}.png`;
  return { title, description, url, image };
}
export function publicStructuredData(methods: SeoMethod[], method?: SeoMethod) {
  const seo = publicSeo(method);
  const organization = { "@type": "Organization", "@id": PUBLIC_ORIGIN + "/#organization", name: "mindresearch", url: PUBLIC_ORIGIN };
  const page = {
    "@type": method ? "WebPage" : "CollectionPage", "@id": seo.url + "#page",
    name: seo.title, description: seo.description, url: seo.url, inLanguage: "ru",
    publisher: { "@id": organization["@id"] },
    isPartOf: { "@id": PUBLIC_ORIGIN + "/#website" },
    ...(method ? {
      about: { "@type": "Thing", name: method.name },
      citation: method.sources.map(source => ({ "@type": "CreativeWork", name: source.title, url: source.url })),
      breadcrumb: { "@id": seo.url + "#breadcrumbs" },
    } : { mainEntity: { "@type": "ItemList", itemListElement: methods.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, url: PUBLIC_ORIGIN + methodPath(item.slug),
    })) } }),
  };
  return { "@context": "https://schema.org", "@graph": [
    organization,
    { "@type": "WebSite", "@id": PUBLIC_ORIGIN + "/#website", name: "mindresearch", url: PUBLIC_ORIGIN, inLanguage: "ru", publisher: { "@id": organization["@id"] } },
    page,
    ...(method ? [{ "@type": "BreadcrumbList", "@id": seo.url + "#breadcrumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Психологические тесты", item: PUBLIC_ORIGIN + methodPath() },
      { "@type": "ListItem", position: 2, name: method.name, item: seo.url },
    ] }] : []),
  ] };
}

export function relatedMethods<T extends {slug: string; topic: string}>(methods: T[], current: T) {
  return methods.filter(item => item.slug !== current.slug)
    .sort((a, b) => Number(b.topic === current.topic) - Number(a.topic === current.topic))
    .slice(0, 3);
}
