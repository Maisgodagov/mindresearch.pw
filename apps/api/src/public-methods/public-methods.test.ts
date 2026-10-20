import { afterEach, beforeEach, describe, expect, it } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { z } from "zod";
import { createPublicMethodsRouter } from "./router.js";
import { memoryRepository } from "./testing.js";
import { calculate, definition, initialCatalog } from "./model.js";
import type { Assessment } from "./repository.js";
import { publicDocument, injectDocument } from "./render.js";

describe("public assessments isolated from research", () => {
  let server: Server, base: string;
  const repository = () => memoryRepository();
  let repo: ReturnType<typeof repository>;
  beforeEach(async () => {
    repo = repository();
    const app = express();
    app.use(express.json());
    app.use(
      createPublicMethodsRouter(repo, [
        (req, res, next) =>
          req.headers.authorization === "Bearer test-admin"
            ? next()
            : res.status(403).json({ message: "Недостаточно прав" }),
      ]),
    );
    app.use(
      (
        e: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) =>
        res
          .status(e instanceof z.ZodError ? 400 : (e.status ?? 500))
          .json({ message: e.message }),
    );
    server = app.listen(0, "127.0.0.1");
    await new Promise<void>((r) => server.once("listening", r));
    base = `http://127.0.0.1:${(server.address() as any).port}`;
  });
  afterEach(async () => {
    server.closeAllConnections();
    await new Promise<void>((r, reject) =>
      server.close((e) => (e ? reject(e) : r())),
    );
  });
  const request = (
    url: string,
    body?: unknown,
    cookie = "",
    method = body ? "POST" : "GET",
    admin = false,
  ) =>
    fetch(base + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        cookie,
        ...(admin ? { Authorization: "Bearer test-admin" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  async function start(slug = "rosenberg-self-esteem") {
    const response = await request(`/api/public/methods/${slug}/assessments`, {
      adult: true,
    });
    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=Strict");
    const cookie = response.headers.get("set-cookie")!.split(";")[0];
    const a = (await response.json()) as Assessment;
    return { a, cookie };
  }
  it("serves only curated methods with source pages and crawlable text", async () => {
    const list = await (await request("/api/public/methods")).json();
    expect(list).toHaveLength(3);
    const doc = await (
      await request("/api/public/methods/document?slug=general-self-efficacy")
    ).json();
    expect(doc.body).toContain("Как рассчитывается результат");
    expect(doc.head).toContain(
      "https://mindresearch.pro/methods/general-self-efficacy",
    );
    expect((await request("/api/public/methods/unknown")).status).toBe(404);
    expect((await request("/methods/unknown")).status).toBe(404);
  });
  it("requires adult confirmation and blocks cross-origin writes", async () => {
    expect(
      (
        await request("/api/public/methods/rosenberg-self-esteem/assessments", {
          adult: false,
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await fetch(
          base + "/api/public/methods/rosenberg-self-esteem/assessments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Origin: "https://untrusted.example",
            },
            body: '{"adult":true}',
          },
        )
      ).status,
    ).toBe(403);
  });
  it("never authorizes a result by UUID alone or a cookie for another assessment", async () => {
    const first = await start(),
      second = await start();
    expect(
      (await request(`/api/public/assessments/${first.a.id}`)).status,
    ).toBe(404);
    expect(
      (
        await request(
          `/api/public/assessments/${first.a.id}`,
          undefined,
          second.cookie,
        )
      ).status,
    ).toBe(404);
    const response = await request(
      `/api/public/assessments/${first.a.id}`,
      undefined,
      first.cookie,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(JSON.stringify(await response.json())).not.toContain(
      first.cookie.split("=")[1],
    );
  });
  it("reuses one browser cookie and deleting one assessment keeps others accessible", async () => {
    const first = await start();
    const response = await request(
      "/api/public/methods/general-self-efficacy/assessments",
      { adult: true },
      first.cookie,
    );
    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")!.split(";")[0]).toBe(
      first.cookie,
    );
    const second = await response.json();
    await request(
      `/api/public/assessments/${first.a.id}`,
      undefined,
      first.cookie,
      "DELETE",
    );
    expect(
      (
        await request(
          `/api/public/assessments/${second.id}`,
          undefined,
          first.cookie,
        )
      ).status,
    ).toBe(200);
  });
  it("preserves valid zero, rejects invalid answers and incomplete completion", async () => {
    const { a, cookie } = await start();
    const path = `/api/public/assessments/${a.id}`;
    const code = a.definition.questions[0].code;
    expect(
      (
        await request(
          path + "/save",
          { answers: { [code]: 0 }, position: 0, revision: 0 },
          cookie,
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await request(
          path + "/save",
          { answers: { [code]: 4 }, position: 0, revision: 1 },
          cookie,
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await request(
          path + "/save",
          { answers: { unexpected: 1 }, position: 0, revision: 1 },
          cookie,
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await request(
          path + "/complete",
          { answers: { [code]: 0 }, position: 0, revision: 1 },
          cookie,
        )
      ).status,
    ).toBe(400);
  });
  it("detects concurrent changes without silently overwriting answers", async () => {
    const { a, cookie } = await start();
    const path = `/api/public/assessments/${a.id}/save`;
    const q = a.definition.questions[0].code;
    const results = await Promise.all([
      request(path, { answers: { [q]: 1 }, position: 0, revision: 0 }, cookie),
      request(path, { answers: { [q]: 2 }, position: 0, revision: 0 }, cookie),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
  });
  it("keeps publication and result snapshots across edits, drafts, withdrawal and deletion", async () => {
    const { a, cookie } = await start();
    const content = {
      ...a.definition.method,
      intro: "Новая публичная редакция",
    };
    expect(
      (
        await request(
          "/api/admin/public-methods/" + content.slug,
          { content, action: "draft", revision: 1 },
          "",
          "PUT",
          true,
        )
      ).status,
    ).toBe(200);
    expect(
      (await (await request("/api/public/methods/" + content.slug)).json())
        .method.intro,
    ).not.toBe(content.intro);
    expect(
      (
        await request(
          "/api/admin/public-methods/" + content.slug,
          { content, action: "publish", revision: 2 },
          "",
          "PUT",
          true,
        )
      ).status,
    ).toBe(200);
    expect(
      (await (await request("/api/public/methods/" + content.slug)).json())
        .method.intro,
    ).toBe(content.intro);
    const answers = Object.fromEntries(
      a.definition.questions.map((q) => [q.code, 3]),
    );
    const input = { answers, position: 9, revision: 0 };
    const completed = await request(
      `/api/public/assessments/${a.id}/complete`,
      input,
      cookie,
    );
    expect(completed.status).toBe(200);
    const result = await completed.json();
    expect(result.result.scales[0].value).toBe(15);
    expect(result.result.method.intro).toBe(a.definition.method.intro);
    expect(
      (await request(`/api/public/assessments/${a.id}/complete`, input, cookie))
        .status,
    ).toBe(200);
    expect(
      (await request(`/api/public/assessments/${a.id}/save`, input, cookie))
        .status,
    ).toBe(409);
    await request(
      "/api/admin/public-methods/" + content.slug,
      { content, action: "unpublish", revision: 3 },
      "",
      "PUT",
      true,
    );
    expect((await request("/api/public/methods/" + content.slug)).status).toBe(
      404,
    );
    expect(
      (await request(`/api/public/assessments/${a.id}`, undefined, cookie))
        .status,
    ).toBe(200);
    expect(
      (
        await request(
          `/api/public/assessments/${a.id}`,
          undefined,
          cookie,
          "DELETE",
        )
      ).status,
    ).toBe(204);
    expect(
      (await request(`/api/public/assessments/${a.id}`, undefined, cookie))
        .status,
    ).toBe(404);
  });
  it("rejects expired sessions and unauthorized or conflicting publication edits", async () => {
    const def = definition(initialCatalog[0]);
    const a: Assessment = {
      id: "00000000-0000-4000-8000-000000000000",
      definition: def,
      answers: {},
      result: null,
      position: 0,
      revision: 0,
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    };
    await repo.create(a, "anything");
    expect((await request(`/api/public/assessments/${a.id}`)).status).toBe(404);
    const content = initialCatalog[0],
      url = "/api/admin/public-methods/" + content.slug;
    expect((await request("/api/admin/public-methods")).status).toBe(403);
    expect(
      (
        await request(
          url,
          { content, action: "publish", revision: 1 },
          "",
          "PUT",
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await request(
          url,
          {
            content: { ...content, version: "invented" },
            action: "publish",
            revision: 1,
          },
          "",
          "PUT",
          true,
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await request(
          url,
          { content, action: "publish", revision: 99 },
          "",
          "PUT",
          true,
        )
      ).status,
    ).toBe(409);
  });
});

describe("shared scoring and safe document rendering", () => {
  it("uses the established keys, including reverse items and bounds", () => {
    for (const m of initialCatalog) {
      const d = definition(m),
        answers = Object.fromEntries(
          d.questions.map((q) => [q.code, m.code === "test_17" ? 0 : 1]),
        );
      const r = calculate(d, answers);
      expect(r.scales[0].value).toBe(
        m.code === "test_17" ? 15 : m.code === "test_19" ? 10 : 1,
      );
    }
    const d = definition(initialCatalog[0]),
      answers = Object.fromEntries(
        d.questions.map((q, i) => [
          q.code,
          [2, 5, 6, 8, 9].includes(i + 1) ? 0 : 3,
        ]),
      );
    expect(calculate(d, answers).scales[0].value).toBe(30);
    const g = definition(initialCatalog[1]);
    expect(
      calculate(g, Object.fromEntries(g.questions.map((q) => [q.code, 4])))
        .scales[0].value,
    ).toBe(40);
    const s = definition(initialCatalog[2]);
    const r = calculate(
      s,
      Object.fromEntries(s.questions.map((q) => [q.code, 7])),
    );
    expect(r.scales).toHaveLength(4);
    expect(r.scales.every((v) => v.value === 7)).toBe(true);
  });
  it("escapes article content, metadata and structured data", () => {
    const m = {
      ...initialCatalog[0],
      name: "</script><script>alert(1)</script>",
      intro: '"><img src=x onerror=alert(1)>',
    };
    const doc = publicDocument([m], m);
    expect(doc.body).not.toContain("<img");
    expect(doc.head).not.toContain("</script><script>alert");
    const html = injectDocument(
      '<html><head><title>old</title><meta name="description" content="old"></head><body><div id="root"></div></body></html>',
      doc,
    );
    expect(html).not.toContain("<title>old");
    expect(html).toContain("Как рассчитывается результат");
    expect(html).toContain("canonical");
  });
});
