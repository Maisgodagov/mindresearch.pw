import type { PublicMethod } from "./model.js";
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const e = escapeHtml;
const canonicalBase = "https://mindresearch.pro";
export function publicDocument(methods: PublicMethod[], method?: PublicMethod) {
  const title = method
    ? `${method.name} (${method.abbreviation}) — пройти онлайн | mindresearch`
    : "Психологические методики и тесты онлайн | mindresearch";
  const description =
    method?.intro ??
    "Самооценка, самоэффективность и социальная поддержка. Пройдите психологическую методику без регистрации, изучите результат и источники.";
  const path = method ? `/methods/${method.slug}` : "/methods";
  const header =
    '<aside class="pm-ssr-sidebar"><a class="pm-ssr-brand" href="/">mindresearch</a><nav aria-label="Основное меню"><a class="pm-ssr-active" href="/methods">Методики</a></nav><a class="pm-ssr-login" href="/login">Войти</a></aside>';
  const body = method
    ? `<a href="/methods">Все методики</a><h1>${e(method.name)}</h1><p>${e(method.intro)}</p><p>${e(method.minutes)} · Без регистрации · 18+</p><a class="pm-button" href="${path}/start">Пройти методику</a><p>${e(method.audience)}</p>${method.sections.map((s) => `<section><h2>${e(s.title)}</h2><p>${e(s.text)}</p></section>`).join("")}<section><h2>Ограничения</h2><p>${e(method.limitations)}</p></section><section><h2>Источники и версия</h2><p>${e(method.version)}</p><ol>${method.sources.map((s) => `<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a></li>`).join("")}</ol><p>${e(method.rights)}</p></section><a class="pm-button" href="${path}/start">Пройти методику</a>`
    : `<h1>Методики</h1><p>${e(description)}</p><div class="pm-list">${methods.map((m) => `<article><p>${e(m.topic)} · ${e(m.minutes)}</p><h2><a href="/methods/${m.slug}">${e(m.name)}</a></h2><p>${e(m.intro)}</p><a href="/methods/${m.slug}">О методике и прохождение</a></article>`).join("")}</div>`;
  const structured = {
    "@context": "https://schema.org",
    "@type": method ? "WebPage" : "CollectionPage",
    name: title,
    description,
    url: canonicalBase + path,
    inLanguage: "ru",
    ...(method
      ? {
          citation: method.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
          })),
        }
      : {}),
  };
  const head = `<title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${canonicalBase + path}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${canonicalBase + path}"><meta property="og:type" content="website"><meta name="robots" content="index,follow"><script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>`;
  return {
    title,
    description,
    head,
    body: `<div class="pm-ssr">${header}<main>${body}</main></div>`,
  };
}
export function injectDocument(
  template: string,
  doc: ReturnType<typeof publicDocument>,
) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
    .replace(
      "</head>",
      `${doc.head}<style>.pm-ssr{min-height:100vh;display:grid;grid-template-columns:240px minmax(0,1fr);background:#f5f7f4;color:#1e2c23;font:16px/1.7 Manrope,sans-serif}.pm-ssr-sidebar{position:sticky;top:0;height:100vh;background:#fbfcfa;border-right:1px solid #e1e7df;padding:24px 18px;display:flex;flex-direction:column;gap:32px}.pm-ssr-brand{font-size:21px;font-weight:700;text-decoration:none}.pm-ssr nav a{display:block;padding:10px 12px;background:#e5efe0;border-radius:8px;text-decoration:none;font-weight:600}.pm-ssr-login{margin-top:auto;padding:12px}.pm-ssr main{padding:28px 24px;max-width:1320px;width:100%;margin:auto}.pm-ssr h1{font:500 32px/1.25 Manrope,sans-serif;margin:0 0 20px}.pm-ssr main>p,.pm-ssr section{max-width:75ch}.pm-ssr section{margin:32px 0}.pm-ssr a{color:#365532}.pm-ssr .pm-button{display:inline-block;padding:12px 22px;background:#52764b;color:white;border-radius:9px}.pm-ssr .pm-list{background:white;padding:0 24px;border:1px solid #d9e2d8;border-radius:16px}.pm-ssr article{padding:24px 0;border-bottom:1px solid #d9e2d8}.pm-ssr article:last-child{border-bottom:0}@media(max-width:760px){.pm-ssr{grid-template-columns:1fr;padding-bottom:62px}.pm-ssr-sidebar{position:fixed;top:auto;bottom:0;left:0;right:0;height:62px;flex-direction:row;align-items:center;justify-content:center;gap:40px;padding:8px;z-index:10;border-top:1px solid #e1e7df}.pm-ssr-brand{display:none}.pm-ssr-login{margin:0}.pm-ssr main{padding:22px 14px}.pm-ssr h1{font-size:28px}}</style></head>`,
    )
    .replace('<div id="root"></div>', `<div id="root">${doc.body}</div>`);
}
