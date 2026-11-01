import { describe, expect, it } from "vitest";
import { researcherDocument } from "./landing.js";
import { researcherSeo, researcherStructuredData } from "./landing-seo.js";
import { injectDocument, publicDocument } from "./render.js";
import { privateDocument, methodsSitemap } from "./static-pages.js";

const template = '<html><head><title>App</title><meta name="robots" content="noindex,nofollow"></head><body><div id="root"></div></body></html>';
describe("search indexing contract", () => {
  it("public documents replace the private shell directive", () => {
    for (const doc of [researcherDocument(), publicDocument([])]) {
      const html = injectDocument(template, doc);
      expect(html.match(/name="robots"/g)).toHaveLength(1);
      expect(html).toContain('content="index,follow,max-image-preview:large"');
      expect(html).not.toContain('content="noindex,nofollow"');
    }
  });
  it("private documents remove public canonical and duplicate robots", () => {
    const html = privateDocument(injectDocument(template, researcherDocument()), "Private");
    expect(html.match(/name="robots"/g)).toHaveLength(1);
    expect(html).toContain('content="noindex,nofollow"');
    expect(html).not.toContain('rel="canonical"');
  });
  it("landing HTML contains substantive benefits and consistent canonical", () => {
    const doc = researcherDocument();
    expect(doc.body).toContain("95 методов статистического анализа");
    expect(doc.body).toContain("Excel");
    expect(doc.head).toContain(researcherSeo().url);
    expect(methodsSitemap([])).toContain(`<loc>${researcherSeo().url}</loc>`);
    expect(researcherStructuredData()["@graph"].some(item => item["@type"] === "WebApplication")).toBe(true);
  });
});
