import { describe, it, expect } from "vitest";
import express from "express";
import { z } from "zod";
import { discoverMethods } from "./discovery.js";
import { initialCatalog, type PublicMethod } from "./model.js";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";

const many = Array.from({ length: 805 }, (_, index) => ({
  ...initialCatalog[0], slug: `fixture-${index}`, title: `Методика ${String(index).padStart(4, "0")}`,
})) as unknown as PublicMethod[]; // Synthetic slugs intentionally exceed the published instrument enum.
describe("server catalogue discovery", () => {
  it("pages a large collection without duplicates, with deterministic order", () => {
    const all = Array.from({ length: 41 }, (_, index) => discoverMethods(many, { page: index + 1 }));
    expect(all[0].items).toHaveLength(20);
    expect(all.at(-1)?.items).toHaveLength(5);
    expect(new Set(all.flatMap(page => page.items.map(item => item.slug))).size).toBe(805);
    expect(discoverMethods([...many].reverse(), { page: 2 }).items).toEqual(all[1].items);
    expect(discoverMethods(many, { page: 999 }).page).toBe(41);
    expect(discoverMethods([], {}).pageCount).toBe(1);
  });
  it("normalizes Russian text and combines words, themes and sections", () => {
    const method = { ...initialCatalog[0], title: "Уверённость в себе", name: "Тест автора Петрова" };
    expect(discoverMethods([method], { q: "  СЕБЕ   уверен  " }).total).toBe(1);
    expect(discoverMethods([method], { q: "Петрова" }).total).toBe(1);
    expect(discoverMethods(initialCatalog, { topic: ["Самооценка", "Цифровые привычки"] }).total).toBe(4);
    expect(discoverMethods(initialCatalog, { topic: ["Самооценка", "Цифровые привычки"], q: "FoMO" }).total).toBe(1);
    expect(discoverMethods(initialCatalog, { section: "Отношения", q: "FoMO" }).total).toBe(0);
    expect(discoverMethods(initialCatalog, { section: "Отношения" }).total).toBe(5);
  });
  it("rejects malformed and unbounded input", () => {
    for (const page of [0, -1, 1.5, "NaN", 100001]) expect(() => discoverMethods(many, { page })).toThrow();
    expect(() => discoverMethods(many, { q: "x".repeat(201) })).toThrow();
    expect(() => discoverMethods(many, { topic: Array(51).fill("x") })).toThrow();
  });
  it("exposes the route, returns page counts, and never exposes drafts", async () => {
    const repo = memoryRepository();
    await repo.savePublication(initialCatalog[0].slug, initialCatalog[0], "unpublish", 1);
    const app = express();
    app.use(createPublicMethodsRouter(repo, []));
    app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message }));
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    const origin = `http://127.0.0.1:${(server.address() as any).port}`;
    try {
      const response = await fetch(origin + "/api/public/catalog?page=1");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.total).toBe(initialCatalog.length - 1);
      expect(data.items.some((item: PublicMethod) => item.slug === initialCatalog[0].slug)).toBe(false);
      expect(data.items.every((item: any) => item.questionCount > 0)).toBe(true);
      expect(data.topics.reduce((sum: number, topic: any) => sum + topic.count, 0)).toBe(data.catalogTotal);
      expect((await fetch(origin + "/api/public/catalog?page=-1")).status).toBe(400);
      // HTTP fixtures retain a registered slug/code/version for definition validation.
      repo.publishedMethods = async () => many.map(method => ({ ...method, slug: initialCatalog[0].slug }));
      const secondPage = await (await fetch(origin + "/api/public/catalog?page=2")).json();
      expect(secondPage.message).toBeUndefined();
      expect(secondPage.total).toBe(805);
      expect(secondPage.items).toHaveLength(20);
      expect(secondPage.items[0].title).toBe("Методика 0020");
      const document = await (await fetch(origin + "/api/public/methods/document?page=2")).json();
      expect(document.body.match(/<article>/g)).toHaveLength(20);
      expect(document.body).toContain("Страница 2 из 41");
      expect(document.head).toContain("noindex,follow");
    } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
  });
});
