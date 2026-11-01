import content from "../data/researcherLanding.json" with { type: "json" };
import { PUBLIC_ORIGIN } from "./seo.js";

export function researcherSeo() {
  return { title: content.title, description: content.description,
    url: `${PUBLIC_ORIGIN}/for-researchers/`,
    image: `${PUBLIC_ORIGIN}/images/tests/researchers.png` };
}
export function researcherStructuredData() {
  const seo = researcherSeo();
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${PUBLIC_ORIGIN}/#organization`, name: "mindresearch", url: PUBLIC_ORIGIN },
    { "@type": "WebSite", "@id": `${PUBLIC_ORIGIN}/#website`, name: "mindresearch", url: PUBLIC_ORIGIN, inLanguage: "ru" },
    { "@type": "WebPage", "@id": `${seo.url}#page`, name: seo.title, description: seo.description,
      url: seo.url, inLanguage: "ru", isPartOf: { "@id": `${PUBLIC_ORIGIN}/#website` },
      publisher: { "@id": `${PUBLIC_ORIGIN}/#organization` }, mainEntity: { "@id": `${seo.url}#application` } },
    { "@type": "WebApplication", "@id": `${seo.url}#application`, name: "mindresearch",
      url: seo.url, applicationCategory: "EducationalApplication", operatingSystem: "Web browser",
      description: seo.description, inLanguage: "ru", publisher: { "@id": `${PUBLIC_ORIGIN}/#organization` },
      featureList: ["Конструктор опросов", "Психологические методики", "Сбор ответов по ссылке",
        "Статистический анализ", "Экспорт в Excel", "Совместный доступ"] },
  ] };
}
export function researcherMetaTags(): [string, string, string][] {
  const seo = researcherSeo();
  return [
    ["name", "description", seo.description], ["name", "robots", "index,follow,max-image-preview:large"],
    ["property", "og:site_name", "mindresearch"], ["property", "og:title", seo.title],
    ["property", "og:description", seo.description], ["property", "og:url", seo.url],
    ["property", "og:type", "website"], ["property", "og:locale", "ru_RU"],
    ["property", "og:image", seo.image], ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"], ["property", "og:image:alt", "mindresearch — опросы и статистический анализ"],
    ["name", "twitter:card", "summary_large_image"], ["name", "twitter:title", seo.title],
    ["name", "twitter:description", seo.description], ["name", "twitter:image", seo.image],
  ];
}
