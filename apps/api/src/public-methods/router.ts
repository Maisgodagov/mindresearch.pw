import { researcherDocument } from "./landing.js";
import { Router, type RequestHandler } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  answersSchema,
  calculate,
  contentSchema,
  definition,
  validateAnswers,
  failure,
} from "./model.js";
import type { Repository } from "./repository.js";
import { injectDocument, publicDocument } from "./render.js";
const DAY = 86400000;
const hash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const identifier = z.string().uuid();
const saveSchema = z
  .object({
    answers: answersSchema,
    position: z.number().int().min(0).max(100),
    revision: z.number().int().min(0),
  })
  .strict();
const cookieName = "mr_public_access";
function cookieToken(req: Parameters<RequestHandler>[0]) {
  return (
    String(req.headers.cookie ?? "")
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(cookieName + "="))
      ?.split("=")[1] ?? ""
  );
}
export function createPublicMethodsRouter(
  repository: Repository,
  admin: RequestHandler[],
  previewAccess: RequestHandler[] = [],
) {
  const router = Router();
  // Unreleased catalogue and assessment data use the same server-side access gate.
  if (previewAccess.length) {
    router.use(["/api/public/methods", "/api/public/assessments", "/methods", "/assessment"],
      (_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Robots-Tag", "noindex, nofollow"); next(); },
      ...previewAccess);
  }
  const limits = new Map<string, { count: number; until: number }>();
  const limit: RequestHandler = (req, res, next) => {
    const now = Date.now();
    if (limits.size > 2000)
      for (const [key, value] of limits)
        if (value.until < now) limits.delete(key);
    const key = req.ip ?? "unknown";
    const entry = limits.get(key);
    if (!entry || entry.until < now) {
      if (limits.size >= 10000)
        return res
          .status(429)
          .json({ message: "Слишком много запросов. Попробуйте позже" });
      limits.set(key, { count: 1, until: now + 3600000 });
    } else if (++entry.count > 30)
      return res.status(429).json({
        message: "Слишком много новых прохождений. Попробуйте через час",
      });
    next();
  };
  const sameOrigin: RequestHandler = (req, _res, next) => {
    const origin = req.get("origin");
    const trusted = (process.env.CLIENT_URL ?? "").split(",").filter(Boolean);
    const local =
      process.env.NODE_ENV !== "production" &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin ?? "");
    const own = `${req.protocol}://${req.get("host")}`;
    if (
      (origin && origin !== own && !trusted.includes(origin) && !local) ||
      req.get("sec-fetch-site") === "cross-site"
    )
      return next(failure(403, "Запрос с другого сайта запрещён"));
    next();
  };
  router.use("/api/public/assessments", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });
  const published = async () =>
    (await repository.publications()).flatMap((p) =>
      p.published ? [p.published] : [],
    );
  router.get("/api/public/methods", async (_req, res) =>
    res.json((await published()).map(method => ({...method, questionCount: definition(method).questions.length}))),
  );
  router.get("/api/public/methods/document", async (req, res) => {
    const methods = await published();
    const method = req.query.slug
      ? methods.find((m) => m.slug === req.query.slug)
      : undefined;
    if (req.query.slug && !method)
      throw failure(404, "Методика не опубликована");
    res.json(publicDocument(methods, method));
  });
  router.get("/api/public/methods/:slug", async (req, res) => {
    const method = (await published()).find((m) => m.slug === req.params.slug);
    if (!method) throw failure(404, "Методика не опубликована");
    res.json({ method, questionCount: definition(method).questions.length });
  });
  router.post(
    "/api/public/methods/:slug/assessments",
    sameOrigin,
    limit,
    async (req, res) => {
      z.object({ adult: z.literal(true) })
        .strict()
        .parse(req.body);
      const method = (await published()).find(
        (m) => m.slug === req.params.slug,
      );
      if (!method) throw failure(404, "Методика не опубликована");
      const existing = cookieToken(req);
      const id = randomUUID(),
        token = /^[a-f0-9]{64}$/.test(existing)
          ? existing
          : randomBytes(32).toString("hex");
      const assessment = {
        id,
        definition: definition(method),
        answers: {},
        result: null,
        position: 0,
        revision: 0,
        expiresAt: new Date(Date.now() + 7 * DAY).toISOString(),
      };
      await repository.create(assessment, hash(token));
      res.setHeader("Cache-Control", "no-store");
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: req.secure || process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/public",
        maxAge: 30 * DAY,
      });
      res.status(201).json(assessment);
    },
  );
  router.get("/api/public/assessments/:id", async (req, res) => {
    const id = identifier.parse(req.params.id);
    res.json(await repository.assessment(id, hash(cookieToken(req)), (a) => a));
  });
  for (const action of ["save", "complete"] as const)
    router.post(
      `/api/public/assessments/:id/${action}`,
      sameOrigin,
      async (req, res) => {
        const id = identifier.parse(req.params.id),
          input = saveSchema.parse(req.body);
        const result = await repository.assessment(
          id,
          hash(cookieToken(req)),
          (a) => {
            if (a.result) {
              if (action === "complete") return a;
              throw failure(409, "Прохождение уже завершено");
            }
            if (input.revision !== a.revision)
              throw failure(
                409,
                "Ответы изменились в другой вкладке. Обновите страницу",
              );
            // The definition is a creation-time snapshot, never the latest publication.
            validateAnswers(a.definition, input.answers, action === "complete");
            if (input.position >= a.definition.questions.length)
              throw failure(400, "Некорректный номер вопроса");
            a.answers = input.answers;
            a.position = input.position;
            a.revision += 1;
            if (action === "complete") {
              a.result = calculate(a.definition, a.answers);
              a.expiresAt = new Date(Date.now() + 30 * DAY).toISOString();
            }
            return a;
          },
        );
        res.json(result);
      },
    );
  router.delete("/api/public/assessments/:id", sameOrigin, async (req, res) => {
    const id = identifier.parse(req.params.id);
    await repository.remove(id, hash(cookieToken(req)));
    res.status(204).end();
  });
  router.get("/api/admin/public-methods", ...admin, async (_req, res) =>
    res.json(await repository.publications()),
  );
  router.put(
    "/api/admin/public-methods/:slug",
    ...admin,
    sameOrigin,
    async (req, res) => {
      const input = z
        .object({
          content: contentSchema,
          action: z.enum(["draft", "publish", "unpublish"]),
          revision: z.number().int().positive(),
        })
        .strict()
        .parse(req.body);
      if (input.content.slug !== req.params.slug)
        throw failure(400, "Адрес публикации не совпадает");
      definition(input.content);
      await repository.savePublication(
        String(req.params.slug),
        input.content,
        input.action,
        input.revision,
      );
      res.json({ revision: input.revision + 1 });
    },
  );
  router.get(["/methods", "/methods/:slug"], async (req, res) => {
    const methods = await published();
    const slug = (req.params as { slug?: string }).slug;
    const method = slug ? methods.find((m) => m.slug === slug) : undefined;
    if (slug && !method)
      return res
        .status(404)
        .type("html")
        .send(
          '<!doctype html><html lang="ru"><meta charset="utf-8"><title>Методика не найдена</title><h1>Методика не опубликована</h1><a href="/methods">Все методики</a></html>',
        );
    const template = await readFile(
      fileURLToPath(new URL("../../../web/dist/index.html", import.meta.url)),
      "utf8",
    );
    res.setHeader("Cache-Control", "no-cache");
    res
      .type("html")
      .send(injectDocument(template, publicDocument(methods, method)));
  });
  router.get("/api/public/researcher-document",(_req,res)=>res.json(researcherDocument()));
  router.get("/for-researchers",async(_req,res)=>{
    const template=await readFile(fileURLToPath(new URL("../../../web/dist/index.html",import.meta.url)),"utf8");
    res.setHeader("Cache-Control","no-cache");res.type("html").send(injectDocument(template,researcherDocument()));
  });
  router.get("/methods-sitemap.xml", async (_req, res) =>
    res
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://mindresearch.pro/for-researchers</loc></url></urlset>`,
      ),
  );
  return router;
}
