import { Router } from "express";
import { z } from "zod";
import { db } from "./db.js";
import { requireAuth, requireRole, type AuthRequest } from "./auth.js";

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

const range = (value: unknown) =>
  z.coerce.number().int().min(1).max(90).default(30).parse(value);
async function report(userId: string | null, days: number) {
  const where = `received_at>=DATE_SUB(NOW(),INTERVAL ? DAY)${userId ? " AND user_id=?" : ""}`,
    params = userId ? [days, userId] : [days];
  const [
    [summary],
    [daily],
    [pages],
    [actions],
    [sessions],
    [events],
    [funnel],
  ] = await Promise.all([
    db.query<any[]>(
      `SELECT COUNT(*) events,COUNT(DISTINCT user_id) users,COUNT(DISTINCT user_id,session_id) sessions,COALESCE(SUM(type='page_view'),0) pageViews,COALESCE(SUM(type='click'),0) clicks,COALESCE(SUM(type IN ('client_error','api_error')),0) errors,COALESCE(SUM(duration_ms),0) activeMs,MIN(received_at) trackingSince FROM product_events WHERE ${where}`,
      params,
    ),
    db.query<any[]>(
      `SELECT DATE(received_at) day,COUNT(DISTINCT user_id) users,COUNT(*) events,SUM(type='page_view') views,SUM(duration_ms) activeMs FROM product_events WHERE ${where} GROUP BY DATE(received_at) ORDER BY day`,
      params,
    ),
    db.query<any[]>(
      `SELECT page,COUNT(*) views,COUNT(DISTINCT user_id) users FROM product_events WHERE ${where} AND type='page_view' GROUP BY page ORDER BY views DESC LIMIT 30`,
      params,
    ),
    db.query<any[]>(
      `SELECT e.name,COUNT(*) count,COUNT(DISTINCT user_id) users,MAX(i.title) instrumentTitle FROM product_events e LEFT JOIN instruments i ON i.code=SUBSTRING_INDEX(e.name,'.',-1) WHERE ${where} AND type IN ('click','feature') GROUP BY e.name ORDER BY count DESC LIMIT 40`,
      params,
    ),
    db.query<any[]>(
      `SELECT e.user_id userId,e.session_id id,MIN(e.occurred_at) startedAt,MAX(e.occurred_at) lastAt,SUM(e.duration_ms) activeMs,COUNT(*) events,MIN(u.name) userName,MIN(e.user_agent) userAgent,SUM(e.type='click') clicks,SUM(e.type IN ('client_error','api_error')) errors,EXISTS(SELECT 1 FROM product_replay_chunks r WHERE r.user_id=e.user_id AND r.session_id=e.session_id) hasReplay FROM product_events e JOIN users u ON u.id=e.user_id WHERE ${where} GROUP BY e.user_id,e.session_id ORDER BY lastAt DESC LIMIT 50`,
      params,
    ),
    db.query<any[]>(
      `SELECT e.id,e.user_id userId,u.name userName,e.session_id sessionId,e.type,e.page,e.name,e.survey_id surveyId,s.title surveyTitle,i.title instrumentTitle,e.duration_ms durationMs,e.occurred_at at FROM product_events e JOIN users u ON u.id=e.user_id LEFT JOIN surveys s ON s.id=e.survey_id LEFT JOIN instruments i ON i.code=SUBSTRING_INDEX(e.name,'.',-1) WHERE ${where} AND type<>'active_time' ORDER BY e.occurred_at DESC,e.id DESC LIMIT 100`,
      params,
    ),
    db.query<any[]>(
      `SELECT page,COUNT(DISTINCT user_id) users FROM product_events WHERE ${where} AND type='page_view' AND page IN ('/app','/app/surveys/new','/app/surveys/:id/edit','/app/surveys/:id/results') GROUP BY page`,
      params,
    ),
  ]);
  return {
    days,
    summary: summary[0],
    daily,
    pages,
    actions,
    sessions,
    events,
    funnel,
    retention: { eventsDays: 90, replayDays: 14 },
  };
}
analyticsRouter.get(
  "/admin/analytics",
  requireRole("owner", "admin"),
  async (req, res, next) => {
    try {
      res.json(await report(null, range(req.query.days)));
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
      res.json(await report(String(req.params.id), range(req.query.days)));
    } catch (error) {
      next(error);
    }
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
