import { afterEach, describe, expect, it } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";
let server: Server | undefined;
afterEach(async () => { if (server) { server.closeAllConnections(); await new Promise<void>(resolve => server!.close(() => resolve())); server = undefined; } });
describe("unreleased catalogue access", () => {
  it("protects catalogue, documents and assessment endpoints before loading data", async () => {
    const app = express(); app.use(express.json());
    const access: express.RequestHandler = (req, res, next) => req.headers.authorization === "Bearer administrator" ? next() : res.status(req.headers.authorization ? 403 : 401).json({message: "Access denied"});
    app.use(createPublicMethodsRouter(memoryRepository(), [access], [access]));
    server = app.listen(0, "127.0.0.1"); await new Promise<void>(resolve => server!.once("listening", resolve));
    const base = `http://127.0.0.1:${(server.address() as {port:number}).port}`;
    for (const path of ["/api/public/methods", "/api/public/methods/document", "/api/public/methods/rosenberg-self-esteem", "/api/public/assessments/00000000-0000-4000-8000-000000000000"]) {
      expect((await fetch(base + path)).status).toBe(401);
      expect((await fetch(base + path, {headers:{Authorization:"Bearer researcher"}})).status).toBe(403);
    }
    expect((await fetch(base + "/api/public/methods/rosenberg-self-esteem/assessments", {method:"POST",headers:{Authorization:"Bearer researcher","Content-Type":"application/json"},body:"{}"})).status).toBe(403);
    const allowed = await fetch(base + "/api/public/methods", {headers:{Authorization:"Bearer administrator"}});
    expect(allowed.status).toBe(200); expect((await allowed.json()).length).toBe(3);
    expect(allowed.headers.get("cache-control")).toBe("no-store");
    const sitemap = await (await fetch(base + "/methods-sitemap.xml")).text();
    expect(sitemap).not.toContain("/methods/");
    expect((await fetch(base + "/api/public/researcher-document")).status).toBe(200);
  });
});
