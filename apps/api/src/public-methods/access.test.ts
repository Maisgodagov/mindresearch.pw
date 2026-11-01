import { afterEach, describe, expect, it } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";
let server: Server | undefined;
afterEach(async () => { if (server) { server.closeAllConnections(); await new Promise<void>(resolve => server!.close(() => resolve())); server = undefined; } });
describe("public catalogue access", () => {
  it("opens curated methods to guests while protecting administration", async () => {
    const app = express(); app.use(express.json());
    const access: express.RequestHandler = (req, res, next) => req.headers.authorization === "Bearer administrator" ? next() : res.status(req.headers.authorization ? 403 : 401).json({message: "Access denied"});
    const repository = memoryRepository();
    app.use(createPublicMethodsRouter(repository, [access]));
    server = app.listen(0, "127.0.0.1"); await new Promise<void>(resolve => server!.once("listening", resolve));
    const base = `http://127.0.0.1:${(server.address() as {port:number}).port}`;
    for (const path of ["/api/public/methods", "/api/public/methods/document", "/api/public/methods/rosenberg-self-esteem"]) {
      expect((await fetch(base + path)).status).toBe(200);
      expect((await fetch(base + path, {headers:{Authorization:"Bearer researcher"}})).status).toBe(200);
    }
    expect((await fetch(base + "/api/admin/public-methods")).status).toBe(401);
    expect((await fetch(base + "/api/admin/public-methods", {headers:{Authorization:"Bearer researcher"}})).status).toBe(403);
    expect((await fetch(base + "/api/admin/public-methods", {headers:{Authorization:"Bearer administrator"}})).status).toBe(200);
    const sitemap = await (await fetch(base + "/methods-sitemap.xml")).text();
    expect(sitemap).toContain("/methods/rosenberg-self-esteem");
    expect(sitemap).not.toContain("/start");
    expect(sitemap).not.toContain("/assessment");
    const publication = (await repository.publications())[0];
    await repository.savePublication(publication.slug, publication.draft, "unpublish", publication.revision);
    const updated = await (await fetch(base + "/methods-sitemap.xml")).text();
    expect(updated).not.toContain(`/methods/${publication.slug}`);
  });
});
