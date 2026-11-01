import { z } from "zod";
import { db } from "./db.js";
import { analyticsPeriod } from "./analytics-policy.js";

export async function analyticsReport(userId: string | null, query: Record<string, unknown>) {
  const period = z.enum(["today", "yesterday", "24h", "1", "7", "30", "90"]).parse(query.period ?? String(query.days ?? 30));
  const audience = userId ? "registered" : z.enum(["all", "registered", "guests"]).default("all").parse(query.audience);
  const { from, to, hourly } = analyticsPeriod(period);
  const where = `e.received_at>=FROM_UNIXTIME(?) AND e.received_at<FROM_UNIXTIME(?)${userId ? " AND e.user_id=?" : audience === "registered" ? " AND e.user_id IS NOT NULL" : audience === "guests" ? " AND e.user_id IS NULL AND e.visitor_id IS NOT NULL" : ""}`;
  const params = userId ? [from / 1000, to / 1000, userId] : [from / 1000, to / 1000];
  const identity = "COALESCE(CONCAT('user:',e.user_id),CONCAT('guest:',e.visitor_id))";
  const [[summary], [dailyRows], [hourlyRows], [pages], [actions], [sessions], [events], [funnel]] = await Promise.all([
    db.query<any[]>(`SELECT COUNT(*) events,COUNT(DISTINCT ${identity}) users,COUNT(DISTINCT e.user_id) registeredUsers,COUNT(DISTINCT IF(e.user_id IS NULL,e.visitor_id,NULL)) guests,COUNT(DISTINCT ${identity},e.session_id) sessions,COALESCE(SUM(e.type='page_view'),0) pageViews,COALESCE(SUM(e.type='click'),0) clicks,COALESCE(SUM(e.type IN ('client_error','api_error')),0) errors,COALESCE(SUM(e.duration_ms),0) activeMs,MIN(e.received_at) trackingSince FROM product_events e WHERE ${where}`, params),
    db.query<any[]>(`SELECT FLOOR((UNIX_TIMESTAMP(e.received_at)+10800)/86400) dayKey,COUNT(DISTINCT ${identity}) users,COUNT(*) events,SUM(e.type='page_view') views,SUM(e.duration_ms) activeMs FROM product_events e WHERE ${where} GROUP BY dayKey ORDER BY dayKey`, params),
    hourly ? db.query<any[]>(`SELECT FLOOR(UNIX_TIMESTAMP(e.received_at)/3600) hourKey,COUNT(DISTINCT ${identity}) users,COUNT(*) events,SUM(e.type='page_view') views,SUM(e.duration_ms) activeMs FROM product_events e WHERE ${where} GROUP BY hourKey ORDER BY hourKey`, params) : Promise.resolve([[]]),
    db.query<any[]>(`SELECT e.page,COUNT(*) views,COUNT(DISTINCT ${identity}) users FROM product_events e WHERE ${where} AND e.type='page_view' GROUP BY e.page ORDER BY views DESC LIMIT 30`, params),
    db.query<any[]>(`SELECT e.name,COUNT(*) count,COUNT(DISTINCT ${identity}) users,MAX(i.title) instrumentTitle FROM product_events e LEFT JOIN instruments i ON i.code=SUBSTRING_INDEX(e.name,'.',-1) WHERE ${where} AND e.type IN ('click','feature') GROUP BY e.name ORDER BY count DESC LIMIT 40`, params),
    db.query<any[]>(`SELECT e.user_id userId,e.visitor_id visitorId,e.session_id id,MIN(e.occurred_at) startedAt,MAX(e.occurred_at) lastAt,SUM(e.duration_ms) activeMs,COUNT(*) events,MIN(u.name) userName,MIN(e.user_agent) userAgent,SUM(e.type='click') clicks,SUM(e.type IN ('client_error','api_error')) errors,EXISTS(SELECT 1 FROM product_replay_chunks r WHERE r.user_id=e.user_id AND r.session_id=e.session_id) hasReplay FROM product_events e LEFT JOIN users u ON u.id=e.user_id WHERE ${where} GROUP BY e.user_id,e.visitor_id,e.session_id ORDER BY lastAt DESC LIMIT 50`, params),
    db.query<any[]>(`SELECT e.id,e.user_id userId,u.name userName,e.session_id sessionId,e.type,e.page,e.name,e.survey_id surveyId,s.title surveyTitle,i.title instrumentTitle,e.duration_ms durationMs,e.occurred_at at FROM product_events e LEFT JOIN users u ON u.id=e.user_id LEFT JOIN surveys s ON s.id=e.survey_id LEFT JOIN instruments i ON i.code=SUBSTRING_INDEX(e.name,'.',-1) WHERE ${where} AND e.type<>'active_time' ORDER BY e.occurred_at DESC,e.id DESC LIMIT 100`, params),
    db.query<any[]>(`SELECT e.page,COUNT(DISTINCT ${identity}) users FROM product_events e WHERE ${where} AND e.type='page_view' AND e.page IN ('/app','/app/surveys/new','/app/surveys/:id/edit','/app/surveys/:id/results') GROUP BY e.page`, params),
  ]);
  const daily = [];
  for (let key = Math.floor((from + 10800_000)/86400_000); key <= Math.floor((to - 1 + 10800_000)/86400_000); key++) {
    const row = dailyRows.find(row => Number(row.dayKey) === key);
    daily.push({ users: 0, events: 0, views: 0, activeMs: 0, ...row, day: new Date(key * 86400_000).toISOString().slice(0,10) });
  }
  const hours = [];
  if (hourly) for (let key = Math.floor(from/3600_000); key <= Math.floor((to - 1)/3600_000); key++) {
    const row = hourlyRows.find(row => Number(row.hourKey) === key);
    hours.push({ users: 0, events: 0, views: 0, activeMs: 0, ...row, hour: new Date(key * 3600_000).toISOString() });
  }
  return { period, audience, from: new Date(from).toISOString(), to: new Date(to).toISOString(), timezone: "Europe/Moscow", summary: summary[0], daily, hourly: hours, pages, actions, sessions, events, funnel, retention: {eventsDays:90,replayDays:14} };
}
