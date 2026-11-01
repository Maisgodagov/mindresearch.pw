import { Router, type RequestHandler } from "express";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "./db.js";
import { analyticsReport } from "./analytics-report.js";
import { requireAuth, requireRole, type AuthRequest } from "./auth.js";
import { CONSENT_ALLOWED, CONSENT_COOKIE, publicAnalyticsPath } from "./analytics-policy.js";

export const analyticsRouter = Router();
export const eventSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  type: z.enum([
    "page_view",
    "click",
    "active_time",
    "client_error",
    "api_error",
    "feature",
  ]),
  page: z
    .string()
    .regex(/^\/app(?:\/[a-zA-Z0-9_:\/-]*)?$/)
    .max(200),
  name: z.string().regex(/^[a-zA-Z0-9_.:/ -]{1,120}$/),
  durationMs: z.number().int().min(0).max(60_000).default(0),
  surveyId: z.string().uuid().nullable().default(null),
  at: z.number().int().min(0),
});
const batchSchema = z.object({ events: z.array(eventSchema).min(1).max(100) });
export const publicEventSchema = eventSchema.extend({
  page: z.string().max(200).refine(path => publicAnalyticsPath(path) === path),
  type: z.enum(["page_view", "click", "active_time"]),
  name: z.enum(["screen.open", "screen.active", "control.click", "test.start", "test.share"]),
  surveyId: z.null().default(null),
});
const cookie = (header: string | undefined, name: string) => header?.split(";").map(part => part.trim()).find(part => part.startsWith(name + "="))?.slice(name.length + 1);
const consentRequired: RequestHandler = (req, res, next) => {
  if (cookie(req.headers.cookie, CONSENT_COOKIE) !== CONSENT_ALLOWED)
    return res.status(403).json({ message: "Аналитика отключена" });
  next();
};
const sameOrigin: RequestHandler = (req, res, next) => {
  const origin = req.get("origin");
  const allowed = ["https://mindresearch.pro", ...(process.env.CLIENT_URL?.split(",") ?? []), `${req.protocol}://${req.get("host")}`];
  const local = process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin ?? "");
  if (req.get("sec-fetch-site") === "cross-site" || (origin && !allowed.includes(origin) && !local))
    return res.status(403).json({ message: "Запрос с другого сайта запрещён" });
  next();
};
const visitorCookie = "mindresearch_visitor";
const visitorOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api" };
const signVisitor = (id: string) => createHmac("sha256", process.env.JWT_SECRET!).update("analytics:" + id).digest("hex");
function visitorIdentity(header: string | undefined) {
  const token = cookie(header, visitorCookie);
  if (token && /^[0-9a-f-]{36}\.[0-9a-f]{64}$/.test(token)) {
    const [id, signature] = token.split(".");
    if (timingSafeEqual(Buffer.from(signature), Buffer.from(signVisitor(id)))) return id;
  }
  return randomUUID();
}
const publicLimits = new Map<string, { count: number; until: number }>();
const publicLimit: RequestHandler = (req, res, next) => {
  const now = Date.now();
  for (const [key, value] of publicLimits) if (value.until < now) publicLimits.delete(key);
  const key = createHmac("sha256", process.env.JWT_SECRET!).update(req.ip ?? "unknown").digest("hex");
  const entry = publicLimits.get(key) ?? { count: 0, until: now + 60_000 };
  if (++entry.count > 120 || (!publicLimits.has(key) && publicLimits.size >= 5000)) return res.status(429).json({ message: "Лимит аналитики" });
  publicLimits.set(key, entry);
  next();
};

analyticsRouter.post("/analytics/forget", sameOrigin, (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.clearCookie(visitorCookie, visitorOptions).json({ ok: true });
});
analyticsRouter.post("/analytics/events", sameOrigin, consentRequired, publicLimit,
  (req, res, next) => req.headers.authorization ? requireAuth(req, res, next) : next(),
  async (req: AuthRequest, res, next) => {
    try {
      const { events } = z.object({ events: z.array(publicEventSchema).min(1).max(50) }).parse(req.body);
      const visitorId = req.user ? null : visitorIdentity(req.headers.cookie);
      const [count] = await db.query<any[]>("SELECT COUNT(*) n FROM product_events WHERE (visitor_id=? OR user_id=?) AND received_at>DATE_SUB(NOW(),INTERVAL 1 DAY)", [visitorId, req.user?.id ?? null]);
      if (Number(count[0].n) + events.length > 10000) return res.status(429).json({ message: "Лимит аналитики" });
      const values = events.map(e => [e.id, req.user?.id ?? null, visitorId, e.sessionId, e.type, e.page, e.name, null,
        req.get("user-agent")?.slice(0,320) ?? null, e.durationMs,
        new Date(Math.max(Date.now() - 86_400_000, Math.min(Date.now() + 60_000, e.at)))]);
      await db.query("INSERT IGNORE INTO product_events(id,user_id,visitor_id,session_id,type,page,name,survey_id,user_agent,duration_ms,occurred_at) VALUES ?", [values]);
      res.setHeader("Cache-Control", "no-store");
      if (visitorId) res.cookie(visitorCookie, `${visitorId}.${signVisitor(visitorId)}`, { ...visitorOptions, maxAge: 90 * 86400_000 });
      void cleanup().catch(console.error);
      res.json({ ok: true });
    } catch (error) { next(error); }
  });
const replaySchema = z.object({
  sessionId: z.string().uuid(),
  sequence: z.number().int().min(0).max(2000),
  events: z
    .array(
      z.union([
        z.string().max(150_000),
        z
          .object({
            type: z.number().int().min(0).max(6),
            timestamp: z.number().int(),
            data: z.unknown(),
          })
          .passthrough(),
      ]),
    )
    .min(1)
    .max(500),
});
let lastCleanup = 0;
// Bounded retention and request sizes; no additional services on the VM.
async function cleanup() {
  if (Date.now() - lastCleanup < 3_600_000) return;
  lastCleanup = Date.now();
  await db.execute(
    "DELETE FROM product_replay_chunks WHERE created_at<DATE_SUB(NOW(),INTERVAL 14 DAY) LIMIT 1000",
  );
  await db.execute(
    "DELETE FROM product_events WHERE received_at<DATE_SUB(NOW(),INTERVAL 90 DAY) LIMIT 10000",
  );
}
analyticsRouter.post(
  "/account/analytics/events",
  requireAuth,
  consentRequired,
  async (req: AuthRequest, res, next) => {
    try {
      const { events } = batchSchema.parse(req.body);
      // Cap one account at 10k events/day. Retries are idempotent by event UUID.
      const [count] = await db.query<any[]>(
        "SELECT COUNT(*) n FROM product_events WHERE user_id=? AND received_at>DATE_SUB(NOW(),INTERVAL 1 DAY)",
        [req.user!.id],
      );
      if (Number(count[0].n) + events.length > 10000)
        return res.status(429).json({ message: "Лимит аналитики" });
      const values = events.map((e) => [
        e.id,
        req.user!.id,
        e.sessionId,
        e.type,
        e.page,
        e.name,
        e.surveyId,
        req.get("user-agent")?.slice(0, 320) ?? null,
        e.durationMs,
        new Date(
          Math.max(
            Date.now() - 86_400_000,
            Math.min(Date.now() + 60_000, e.at),
          ),
        ),
      ]);
      await db.query(
        "INSERT IGNORE INTO product_events(id,user_id,session_id,type,page,name,survey_id,user_agent,duration_ms,occurred_at) VALUES ?",
        [values],
      );
      void cleanup().catch(console.error);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);
analyticsRouter.post(
  "/account/analytics/replay",
  requireAuth,
  consentRequired,
  async (req: AuthRequest, res, next) => {
    try {
      const body = replaySchema.parse(req.body),
        payload = JSON.stringify(body.events),
        bytes = Buffer.byteLength(payload);
      if (bytes > 150_000)
        return res.status(413).json({ message: "Запись слишком велика" });
      const [rows] = await db.query<any[]>(
        "SELECT COALESCE(SUM(bytes),0) bytes FROM product_replay_chunks WHERE user_id=? AND created_at>DATE_SUB(NOW(),INTERVAL 1 DAY)",
        [req.user!.id],
      );
      if (Number(rows[0].bytes) + bytes > 10_000_000)
        return res.status(429).json({ message: "Лимит записей" });
      await db.execute(
        "INSERT IGNORE INTO product_replay_chunks(user_id,session_id,sequence,events,bytes) VALUES (?,?,?,?,?)",
        [req.user!.id, body.sessionId, body.sequence, payload, bytes],
      );
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

analyticsRouter.get(
  "/admin/analytics",
  requireRole("owner", "admin"),
  async (req, res, next) => {
    try {
      res.json(await analyticsReport(null, req.query));
    } catch (error) {
      next(error);
    }
  },
);
analyticsRouter.get(
  "/admin/users/:id/analytics",
  requireRole("owner", "admin"),
  async (req, res, next) => {
    try {
      res.json(await analyticsReport(String(req.params.id), req.query));
    } catch (error) {
      next(error);
    }
  },
);
analyticsRouter.get(
  "/admin/analytics/guests/:visitorId/sessions/:sessionId",
  requireRole("owner", "admin"),
  async (req, res, next) => {
    try {
      const visitorId = z.string().uuid().parse(req.params.visitorId);
      const sessionId = z.string().uuid().parse(req.params.sessionId);
      const [events] = await db.query<any[]>("SELECT type,page,name,duration_ms durationMs,occurred_at at FROM product_events WHERE user_id IS NULL AND visitor_id=? AND session_id=? ORDER BY occurred_at,id LIMIT 2000", [visitorId, sessionId]);
      res.json({events,replay:[]});
    } catch (error) { next(error); }
  },
);
analyticsRouter.get(
  "/admin/users/:id/analytics/sessions/:sessionId",
  requireRole("owner", "admin"),
  async (req, res, next) => {
    try {
      const [events] = await db.query<any[]>(
        `SELECT e.type,e.page,e.name,e.survey_id surveyId,s.title surveyTitle,i.title instrumentTitle,e.duration_ms durationMs,e.occurred_at at FROM product_events e LEFT JOIN surveys s ON s.id=e.survey_id LEFT JOIN instruments i ON i.code=SUBSTRING_INDEX(e.name,'.',-1) WHERE e.user_id=? AND e.session_id=? ORDER BY e.occurred_at,e.id LIMIT 2000`,
        [req.params.id, req.params.sessionId],
      );
      const [chunks] = await db.query<any[]>(
        "SELECT events FROM product_replay_chunks WHERE user_id=? AND session_id=? ORDER BY sequence",
        [req.params.id, req.params.sessionId],
      );
      res.json({
        events,
        replay: chunks.flatMap((r) =>
          typeof r.events === "string" ? JSON.parse(r.events) : r.events,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
);
