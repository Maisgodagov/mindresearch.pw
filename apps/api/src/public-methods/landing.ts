import content from "../data/researcherLanding.json" with { type: "json" };
import { escapeHtml as e } from "./render.js";
export function researcherDocument() {
  const url = "https://mindresearch.pro/for-researchers";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: content.description,
    url,
    inLanguage: "ru",
  };
  const head = `<title>${e(content.title)}</title><meta name="description" content="${e(content.description)}"><link rel="canonical" href="${url}"><meta property="og:title" content="${e(content.title)}"><meta property="og:description" content="${e(content.description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
  const body = `<main style="max-width:1100px;margin:40px auto;padding:0 24px;font:16px/1.8 system-ui;color:#304d3a"><nav><a href="/for-researchers">Для исследователей</a> · <a href="/methods">Публичные методики</a> · <a href="/login">Войти</a></nav><h1>${e(content.heading)}</h1><p>${e(content.intro)}</p><a href="/register">Создать своё исследование</a><section id="builder"><h2>Конструктор опросов под ваше исследование</h2>${content.features.map((f) => `<h3>${e(f.title)}</h3><p>${e(f.text)}</p>`).join("")}</section>${content.sections.map((s) => `<section id="${s.id}"><h2>${e(s.title)}</h2><p>${e(s.text)}</p>${s.id === "publish" ? `<h3>${e(content.qualityReview.title)}</h3><p>${e(content.qualityReview.text)}</p><p>${e(content.qualityReview.note)}</p>` : s.id === "export" ? content.collaborationBenefits.map((item) => `<h3>${e(item.title)}</h3><p>${e(item.text)}</p>`).join("") : ""}</section>`).join("")}<section><h2>Вопросы о создании опросов и анализе данных</h2>${content.faq.map(([q, a]) => `<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</section><a href="/register">Создать аккаунт исследователя</a></main>`;
  return { title: content.title, description: content.description, head, body };
}
