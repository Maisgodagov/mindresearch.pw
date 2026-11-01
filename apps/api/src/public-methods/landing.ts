import content from "../data/researcherLanding.json" with { type: "json" };
import { escapeHtml as e } from "./render.js";
import { researcherMetaTags, researcherSeo, researcherStructuredData } from "./landing-seo.js";

export function researcherDocument() {
  const seo = researcherSeo();
  const head = `<title>${e(seo.title)}</title><link rel="canonical" href="${seo.url}">${researcherMetaTags().map(([attribute,key,value]) => `<meta ${attribute}="${key}" content="${e(value)}">`).join("")}<script id="researcher-schema" type="application/ld+json">${JSON.stringify(researcherStructuredData()).replace(/</g,"\\u003c")}</script>`;
  const benefits: Record<string, {title:string;text:string}[]> = {
    catalog: content.catalogueBenefits, publish: content.publishBenefits,
    respondent: content.respondentBenefits, results: content.resultsBenefits,
    analysis: content.analysisBenefits, export: content.collaborationBenefits,
  };
  const items = (rows: {title:string;text:string}[]) => rows.map(row=>`<h3>${e(row.title)}</h3><p>${e(row.text)}</p>`).join("");
  const body = `<main style="max-width:1100px;margin:40px auto;padding:0 24px;font:16px/1.8 system-ui;color:#304d3a"><nav><a href="/for-researchers/">Для исследователей</a> · <a href="/methods/">Тесты и методики</a> · <a href="/login">Войти</a></nav><h1>${e(content.heading)}</h1><p>${e(content.intro)}</p><a href="/register">Создать своё исследование</a><section id="builder"><h2>Конструктор опросов под ваше исследование</h2>${items(content.features)}</section>${content.sections.map(section=>`<section id="${section.id}"><h2>${e(section.title)}</h2><p>${e(section.text)}</p>${items(benefits[section.id] ?? [])}${section.id === "publish" ? `<h3>${e(content.qualityReview.title)}</h3><p>${e(content.qualityReview.text)}</p><p>${e(content.qualityReview.note)}</p>` : ""}</section>`).join("")}<section><h2>Вопросы о создании опросов и анализе данных</h2>${content.faq.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</section><a href="/register">Создать аккаунт исследователя</a></main>`;
  return { title:seo.title, description:seo.description, head, body };
}
