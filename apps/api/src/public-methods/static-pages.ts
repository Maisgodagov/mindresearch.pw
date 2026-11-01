import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { initialCatalog } from "./model.js";
import type { Publication, Repository } from "./repository.js";
import { injectDocument, publicDocument, escapeHtml } from "./render.js";
import { methodPath, PUBLIC_ORIGIN } from "./seo.js";

export function methodsSitemap(publications: Publication[]) {
  const entries = [
    `<url><loc>${PUBLIC_ORIGIN}/for-researchers</loc></url>`,
    `<url><loc>${PUBLIC_ORIGIN + methodPath()}</loc></url>`,
    ...publications.filter(item => item.published).map(item => {
      const lastmod = item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt))
        ? `<lastmod>${new Date(item.publishedAt).toISOString()}</lastmod>` : "";
      return `<url><loc>${PUBLIC_ORIGIN + methodPath(item.slug)}</loc>${lastmod}</url>`;
    }),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`;
}
export function privateDocument(template: string, title: string) {
  return template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)} | mindresearch</title>`)
    .replace("</head>", '<meta name="robots" content="noindex,nofollow"></head>');
}

// Nginx already serves directories from dist. Export the published DB snapshot,
// not source drafts, so crawlers and visitors receive the same current content.
export function createPublicPagesSync(repository: Repository, webDirectory: string) {
  let queue: Promise<void> = Promise.resolve();
  const write = async (relativePath: string, content: string) => {
    const target = join(webDirectory, relativePath);
    await mkdir(dirname(target), {recursive: true});
    await writeFile(target + ".tmp", content, "utf8");
    await rename(target + ".tmp", target);
  };
  return () => {
    queue = queue.catch(() => {}).then(async () => {
      const publications = await repository.publications();
      const methods = publications.flatMap(item => item.published ? [item.published] : []);
      const template = await readFile(join(webDirectory, "index.html"), "utf8");
      await write("methods/index.html", injectDocument(template, publicDocument(methods)));
      for (const registered of initialCatalog) {
        const method = methods.find(item => item.slug === registered.slug);
        const document = method ? injectDocument(template, publicDocument(methods, method))
          : privateDocument(template, "Тест не опубликован");
        await write(`methods/${registered.slug}/index.html`, document);
        await write(`methods/${registered.slug}/start/index.html`, privateDocument(template, "Прохождение теста"));
      }
      await write("assessment/result/index.html", privateDocument(template, "Ваш результат"));
      const sitemap = methodsSitemap(publications);
      await write("sitemap.xml", sitemap);
      await write("methods-sitemap.xml", sitemap);
    });
    return queue;
  };
}
