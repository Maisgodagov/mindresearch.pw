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
    '<header><a href="/">mindresearch</a><nav><a href="/methods">Методики</a><a href="/login">Войти</a></nav></header>';
  const body = method
    ? `<a href="/methods">Все методики</a><h1>${e(method.name)}</h1><p>${e(method.intro)}</p><p>${e(method.minutes)} · Без регистрации · 18+</p><a class="pm-button" href="${path}/start">Пройти методику</a><p>${e(method.audience)}</p>${method.sections.map((s) => `<section><h2>${e(s.title)}</h2><p>${e(s.text)}</p></section>`).join("")}<section><h2>Ограничения</h2><p>${e(method.limitations)}</p></section><section><h2>Источники и версия</h2><p>${e(method.version)}</p><ol>${method.sources.map((s) => `<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a></li>`).join("")}</ol><p>${e(method.rights)}</p></section><a class="pm-button" href="${path}/start">Пройти методику</a><a href="/register">Создать исследование</a>`
    : `<h1>Психологические методики.<br>Больше понимания себя.</h1><p>${e(description)}</p><div class="pm-list">${methods.map((m) => `<article><p>${e(m.topic)} · ${e(m.minutes)}</p><h2><a href="/methods/${m.slug}">${e(m.name)}</a></h2><p>${e(m.intro)}</p><a href="/methods/${m.slug}">О методике и прохождение</a></article>`).join("")}</div>`;
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
    body: `<div class="pm-ssr">${header}<main>${body}</main><footer>mindresearch · Методики для самопознания и исследований</footer></div>`,
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
      `${doc.head}<style>.pm-ssr{max-width:1120px;margin:auto;padding:28px 24px;color:#243b2d;font:17px/1.7 Manrope,sans-serif}.pm-ssr header,.pm-ssr nav{display:flex;justify-content:space-between;gap:24px}.pm-ssr h1{font:48px/1.15 Georgia,serif;margin:64px 0 24px}.pm-ssr main>p,.pm-ssr section{max-width:760px}.pm-ssr section{margin:48px 0}.pm-ssr a{color:#365b3b}.pm-ssr .pm-button{display:inline-block;padding:12px 22px;background:#52764b;color:white;border-radius:10px}.pm-ssr article{padding:28px 0;border-bottom:1px solid #d9e2d8}.pm-ssr footer{margin-top:64px}@media(max-width:600px){.pm-ssr h1{font-size:34px}}</style></head>`,
    )
    .replace('<div id="root"></div>', `<div id="root">${doc.body}</div>`);
}
