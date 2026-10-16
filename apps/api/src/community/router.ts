import { Router } from "express";
import { randomBytes, randomUUID } from "node:crypto";
import type { PoolConnection } from "mysql2/promise";
import { z } from "zod";
import { db } from "../db.js";
import { surveyDurationLabel, surveyDurationMinutes } from "./duration.js";
import { requireRole, type AuthRequest } from "../auth.js";
import {
  listingSchema,
  profileSchema,
  profileInputSchema,
  ageForProfile,
  matches,
  quotaFor,
  rewardFor,
  rewardDecision,
  screeningPass,
  type Listing,
  type Profile,
} from "./domain.js";

export const communityRouter = Router();
communityRouter.use(
  "/community",
  requireRole("owner", "admin"),
  (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  },
);
const json = (v: any): any => (typeof v === "string" ? JSON.parse(v) : v);
class CommunityError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
async function tx<T>(fn: (c: PoolConnection) => Promise<T>) {
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    const result = await fn(c);
    await c.commit();
    return result;
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}
function route(fn: (req: AuthRequest, res: any) => Promise<unknown>) {
  return (req: AuthRequest, res: any, next: any) => {
    void fn(req, res).catch((e) =>
      e instanceof CommunityError
        ? res.status(e.status).json({ message: e.message })
        : e instanceof z.ZodError
          ? res.status(400).json({
              message: e.issues[0]?.message ?? "Проверьте данные анкеты.",
            })
          : next(e),
    );
  };
}
async function wallet(c: PoolConnection, id: string) {
  await c.execute("INSERT INTO community_wallets(user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id)", [
    id,
  ]);
  const [rows] = await c.query<any[]>(
    "SELECT * FROM community_wallets WHERE user_id=? FOR UPDATE",
    [id],
  );
  return rows[0];
}
async function ledger(
  c: PoolConnection,
  user: string,
  key: string,
  amount: number,
  kind: string,
  note: string,
) {
  await c.execute(
    "INSERT INTO community_ledger(id,user_id,event_key,amount,kind,note) VALUES (?,?,?,?,?,?)",
    [randomUUID(), user, key, amount, kind, note],
  );
}
async function starterWallet(c: PoolConnection, user: string) {
  const w = await wallet(c, user);
  // Wallet row is locked, so first visits and placements share one grant.
  if (!w.bonus_granted) {
    await c.execute(
      "UPDATE community_wallets SET bonus=bonus+8,bonus_granted=TRUE WHERE user_id=?",
      [user],
    );
    w.bonus += 8;
    w.bonus_granted = true;
    await ledger(c, user, `starter:${user}`, 8, "bonus", "Стартовый бюджет закрытого пилота");
  }
  return w;
}
async function completeProfile(
  c: PoolConnection,
  user: string,
): Promise<Profile> {
  const [rows] = await c.query<any[]>(
    "SELECT data,complete FROM community_profiles WHERE user_id=?",
    [user],
  );
  if (!rows[0]?.complete)
    throw new CommunityError(409, "Сначала заполните анкету участника.");
  return profileSchema.parse(json(rows[0].data));
}
async function lockedListing(c: PoolConnection, id: string) {
  const [rows] = await c.query<any[]>(
    `SELECT l.*,s.title,s.slug,s.status survey_status,s.deleted_at FROM community_listings l JOIN surveys s ON s.id=l.survey_id WHERE l.id=? FOR UPDATE`,
    [id],
  );
  if (!rows.length) throw new CommunityError(404, "Размещение не найдено.");
  return rows[0];
}
async function counts(c: PoolConnection, id: string) {
  const [rows] = await c.query<any[]>(
    `SELECT quota_id,COUNT(*) count FROM community_participations WHERE listing_id=? AND (status IN ('pending','review','credited') OR (status='reserved' AND expires_at>NOW())) GROUP BY quota_id`,
    [id],
  );
  return Object.fromEntries(rows.map((r) => [r.quota_id, Number(r.count)]));
}
async function releaseFunds(c: PoolConnection, p: any) {
  await c.execute(
    "UPDATE community_listings SET earned_budget=earned_budget+?,bonus_budget=bonus_budget+? WHERE id=?",
    [p.reward - p.bonus_reserved, p.bonus_reserved, p.listing_id],
  );
}

communityRouter.get(
  "/community/me",
  route(async (req, res) => {
    const user = req.user!.id;
    await tx((c) => starterWallet(c, user));
    const [[profiles], [wallets], [history], [participations]] =
      await Promise.all([
        db.query<any[]>(
          "SELECT data,complete,confirmed_at confirmedAt FROM community_profiles WHERE user_id=?",
          [user],
        ),
        db.query<any[]>(
          "SELECT earned,bonus,bonus_granted bonusGranted FROM community_wallets WHERE user_id=?",
          [user],
        ),
        db.query<any[]>(
          "SELECT id,amount,kind,note,created_at createdAt FROM community_ledger WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 100",
          [user],
        ),
        db.query<any[]>(
          `SELECT p.id,p.status,p.reason,p.appeal,p.reward,p.expires_at expiresAt,p.created_at createdAt,s.title,s.slug,rs.public_token token FROM community_participations p JOIN community_listings l ON l.id=p.listing_id JOIN surveys s ON s.id=l.survey_id LEFT JOIN response_sessions rs ON rs.id=p.session_id WHERE p.user_id=? ORDER BY p.created_at DESC LIMIT 100`,
          [user],
        ),
      ]);
    res.json({
      profile: profiles[0]
        ? {
            ...profiles[0],
            data: json(profiles[0].data),
            complete: Boolean(profiles[0].complete),
          }
        : null,
      wallet: wallets[0] ?? { earned: 0, bonus: 0, bonusGranted: false },
      history,
      participations,
    });
  }),
);

communityRouter.put(
  "/community/profile",
  route(async (req, res) => {
    const body = z
      .object({
        data: z.record(z.string(), z.unknown()),
        complete: z.boolean(),
      })
      .parse(req.body);
    // Drafts contain only known questionnaire fields, not arbitrary uploaded data.
    const fields = [
      "adultConfirmed",
      "birthDate",
      "age",
      "ageRecordedAt",
      "sex",
      "education",
      "studying",
      "employment",
      "marital",
      "children",
      "childAges",
    ];
    const submittedFields = Object.fromEntries(
      Object.entries(body.data).filter(([key]) => fields.includes(key)),
    );
    const data: Record<string, any> = body.complete
      ? profileInputSchema.parse(submittedFields)
      : submittedFields;
    if (JSON.stringify(data).length > 6000)
      throw new CommunityError(400, "Анкета слишком большая.");
    await tx(async (c) => {
      const [old] = await c.query<any[]>(
        "SELECT data,complete FROM community_profiles WHERE user_id=? FOR UPDATE",
        [req.user!.id],
      );
      if (old[0]?.complete && !body.complete)
        throw new CommunityError(
          409,
          "Заполненную анкету нельзя заменить черновиком. Сохраните все изменения.",
        );
      const previous = json(old[0]?.data ?? {});
      if (typeof data.age === "number") {
        if (previous.ageRecordedAt && data.age === ageForProfile(previous)) {
          data.age = previous.age;
          data.ageRecordedAt = previous.ageRecordedAt;
        } else data.ageRecordedAt = new Date().toISOString().slice(0, 10);
        delete data.birthDate;
      } else delete data.ageRecordedAt;
      const changed = fields.filter(
        (key) =>
          JSON.stringify(previous[key]) !== JSON.stringify((data as any)[key]),
      );
      await c.execute(
        "INSERT INTO community_profiles(user_id,data,complete,confirmed_at) VALUES (?,?,?,IF(?,NOW(),NULL)) ON DUPLICATE KEY UPDATE data=VALUES(data),complete=VALUES(complete),confirmed_at=IF(VALUES(complete),NOW(),confirmed_at)",
        [req.user!.id, JSON.stringify(data), body.complete, body.complete],
      );
      if (changed.length)
        await c.execute(
          "INSERT INTO community_profile_history(user_id,changed_fields) VALUES (?,?)",
          [req.user!.id, JSON.stringify(changed)],
        );
    });
    res.json({ ok: true });
  }),
);

communityRouter.get(
  "/community/feed",
  route(async (req, res) => {
    const [profiles] = await db.query<any[]>(
      "SELECT data,complete FROM community_profiles WHERE user_id=?",
      [req.user!.id],
    );
    if (!profiles[0]?.complete)
      throw new CommunityError(409, "Сначала заполните анкету участника.");
    const p = profileSchema.parse(json(profiles[0].data));
    const [rows] = await db.query<any[]>(
      `SELECT l.id,l.config,l.reward,l.owner_id,l.impressions,l.earned_budget+l.bonus_budget budget,s.title,s.slug,u.name author,
    (SELECT COUNT(*) FROM community_participations x WHERE x.listing_id=l.id AND x.status='credited') completed,
    (SELECT JSON_OBJECTAGG(t.quota_id,t.n) FROM (SELECT listing_id,quota_id,COUNT(*) n FROM community_participations WHERE status IN ('pending','review','credited') OR (status='reserved' AND expires_at>NOW()) GROUP BY listing_id,quota_id) t WHERE t.listing_id=l.id) occupied,
    (SELECT status FROM community_participations x WHERE x.listing_id=l.id AND x.user_id=?) participation
    FROM community_listings l JOIN surveys s ON s.id=l.survey_id JOIN users u ON u.id=l.owner_id WHERE l.state='active' AND s.status='active' AND s.deleted_at IS NULL AND l.owner_id<>? AND l.earned_budget+l.bonus_budget>=l.reward
    ORDER BY completed ASC,l.impressions ASC,l.created_at DESC LIMIT 300`,
      [req.user!.id, req.user!.id],
    );
    const feed: any[] = [],
      authors = new Set<string>(),
      deferred: any[] = [];
    for (const row of rows) {
      const config: Listing = json(row.config),
        match = matches(p, config.criteria),
        quota = quotaFor(p, config.quotas),
        occupied = json(row.occupied ?? {});
      if (match === "fail" || row.participation) continue;
      if (quota && Number(occupied[quota.id] ?? 0) >= quota.target) continue;
      if (!quota && ageForProfile(p) !== null && p.sex !== "private") continue;
      const item = {
        id: row.id,
        title: row.title,
        author: row.author,
        description: config.description,
        topic: config.topic,
        sensitive: config.sensitive,
        minutes: config.minutes,
        reward: row.reward,
        criteria: config.criteria,
        screening: config.screening.map(({ accepted: _accepted, ...q }) => q),
        quotas: config.quotas.map((q) => ({
          ...q,
          occupied: Number(occupied[q.id] ?? 0),
        })),
        match:
          match === "unknown" || !quota
            ? "unknown"
            : config.screening.length
              ? "screening"
              : "pass",
      };
      if (authors.has(row.owner_id)) deferred.push(item);
      else {
        feed.push(item);
        authors.add(row.owner_id);
      }
    }
    const [started] = await db.query<any[]>(`SELECT p.id participationId,p.reward,p.expires_at expiresAt,p.snapshot,
      l.id,s.title,s.slug,rs.public_token token,u.name author
      FROM community_participations p JOIN community_listings l ON l.id=p.listing_id
      JOIN surveys s ON s.id=l.survey_id JOIN response_sessions rs ON rs.id=p.session_id
      JOIN users u ON u.id=l.owner_id
      WHERE p.user_id=? AND p.status='reserved' AND p.expires_at>NOW()
      AND rs.status<>'completed' AND s.status='active' AND s.deleted_at IS NULL
      ORDER BY p.created_at DESC`, [req.user!.id]);
    const ongoing = started.map(row => {
      const snapshot = json(row.snapshot);
      const config = snapshot.config ?? snapshot.listing;
      return { id: row.id, title: row.title, author: row.author, description: config.description,
        topic: config.topic, sensitive: config.sensitive, minutes: config.minutes, reward: row.reward,
        criteria: config.criteria, screening: [], quotas: [], match: "resume",
        participation: { id: row.participationId, slug: row.slug, token: row.token, expiresAt: row.expiresAt } };
    });
    res.json([...ongoing, ...feed, ...deferred]);
  }),
);

communityRouter.post(
  "/community/impressions",
  route(async (req, res) => {
    const { ids } = z
      .object({ ids: z.array(z.string().uuid()).max(50) })
      .parse(req.body);
    await tx(async (c) => {
      await completeProfile(c, req.user!.id);
      for (const id of new Set(ids)) {
        const [result] = await c.execute<any>(
          "INSERT IGNORE INTO community_impressions(listing_id,user_id,viewed_on) SELECT id,?,CURRENT_DATE FROM community_listings WHERE id=? AND owner_id<>?",
          [req.user!.id, id, req.user!.id],
        );
        if (result.affectedRows)
          await c.execute(
            "UPDATE community_listings SET impressions=impressions+1 WHERE id=?",
            [id],
          );
      }
    });
    res.json({ ok: true });
  }),
);

communityRouter.get(
  "/community/surveys",
  route(async (req, res) => {
    const [rows] = await db.query<any[]>(`SELECT s.id,s.title,s.description,s.settings,
      (SELECT COUNT(*) FROM questions q JOIN sections sec ON sec.id=q.section_id WHERE sec.survey_id=s.id) questionCount,
      (SELECT COUNT(*) FROM questions q JOIN sections sec ON sec.id=q.section_id WHERE sec.survey_id=s.id AND q.type='text') openCount
      FROM surveys s WHERE s.owner_id=? AND s.status='active' AND s.deleted_at IS NULL ORDER BY s.created_at DESC`, [req.user!.id]);
    res.json(rows.map(s => {
      const setting = json(s.settings ?? {}).estimatedDuration;
      const questions = [...Array(Number(s.questionCount) - Number(s.openCount)).fill({ type: "single" }), ...Array(Number(s.openCount)).fill({ type: "text" })];
      const minutes = surveyDurationMinutes(questions, setting);
      return { id: s.id, title: s.title, description: s.description, minutes, durationLabel: surveyDurationLabel(questions, setting), eligible: minutes <= 240 };
    }));
  }),
);

communityRouter.get(
  "/community/listings",
  route(async (req, res) => {
    const [rows] = await db.query<any[]>(
      `SELECT l.*,s.title,s.status surveyStatus,
    (SELECT COUNT(*) FROM community_participations p WHERE p.listing_id=l.id AND p.session_id IS NOT NULL) started,
    (SELECT COUNT(*) FROM community_participations p WHERE p.listing_id=l.id AND p.status='credited') completed,
    (SELECT COUNT(*) FROM community_participations p WHERE p.listing_id=l.id AND p.status IN ('review','pending')) pending,
    (SELECT COUNT(*) FROM community_participations p WHERE p.listing_id=l.id AND p.status='reserved' AND p.expires_at>NOW()) reserved
    FROM community_listings l JOIN surveys s ON s.id=l.survey_id WHERE l.owner_id=? ORDER BY l.created_at DESC`,
      [req.user!.id],
    );
    const output = [];
    for (const row of rows) {
      const [groups] = await db.query<any[]>(
        `SELECT quota_id,SUM(status='credited') completed,SUM(status IN ('review','pending')) pending,SUM(status='reserved' AND expires_at>NOW()) reserved FROM community_participations WHERE listing_id=? GROUP BY quota_id`,
        [row.id],
      );
      output.push({
        ...row,
        config: json(row.config),
        groups,
        spent: Number(row.completed) * row.reward,
      });
    }
    res.json(output);
  }),
);

communityRouter.post(
  "/community/listings",
  route(async (req, res) => {
    const config = listingSchema.parse(req.body),
      user = req.user!.id,
      id = randomUUID();
    await tx(async (c) => {
      await completeProfile(c, user);
      const [surveys] = await c.query<any[]>(
        "SELECT id,settings FROM surveys WHERE id=? AND owner_id=? AND status='active' AND deleted_at IS NULL FOR UPDATE",
        [config.surveyId, user],
      );
      if (!surveys.length)
        throw new CommunityError(
          400,
          "Выберите свой опубликованный активный опрос.",
        );
      const [questions] = await c.query<any[]>("SELECT q.type FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=?", [config.surveyId]);
      config.minutes = surveyDurationMinutes(questions, json(surveys[0].settings ?? {}).estimatedDuration);
      if (config.minutes > 240) throw new CommunityError(400, "Для размещения выберите опрос длительностью до 240 минут.");
      const reward = rewardFor(config.minutes);
      if (config.budget < reward) throw new CommunityError(400, "Бюджета должно хватать хотя бы на одно прохождение.");
      const [existing] = await c.query<any[]>(
        "SELECT id FROM community_listings WHERE survey_id=?",
        [config.surveyId],
      );
      if (existing.length)
        throw new CommunityError(409, "Это исследование уже размещено.");
      const w = await starterWallet(c, user);
      if (w.earned + w.bonus < config.budget)
        throw new CommunityError(
          409,
          "Недостаточно баллов. Уменьшите бюджет или пройдите другие исследования.",
        );
      const bonus = Math.min(w.bonus, config.budget);
      await c.execute(
        "UPDATE community_wallets SET earned=earned-?,bonus=bonus-? WHERE user_id=?",
        [config.budget - bonus, bonus, user],
      );
      await c.execute(
        "INSERT INTO community_listings(id,survey_id,owner_id,config,reward,earned_budget,bonus_budget) VALUES (?,?,?,?,?,?,?)",
        [
          id,
          config.surveyId,
          user,
          JSON.stringify(config),
          reward,
          config.budget - bonus,
          bonus,
        ],
      );
      await ledger(
        c,
        user,
        `listing:${id}`,
        -config.budget,
        "promotion",
        "Бюджет продвижения исследования",
      );
    });
    res.status(201).json({ id });
  }),
);

communityRouter.patch(
  "/community/listings/:id",
  route(async (req, res) => {
    const body = z
      .object({
        state: z.enum(["active", "paused", "closed"]).optional(),
        topup: z.number().int().min(1).max(10000).optional(),
        config: listingSchema.optional(),
      })
      .parse(req.body);
    await tx(async (c) => {
      const l = await lockedListing(c, String(req.params.id));
      if (l.owner_id !== req.user!.id)
        throw new CommunityError(
          403,
          "Можно управлять только своими размещениями.",
        );
      if (l.state === "closed")
        throw new CommunityError(409, "Размещение закрыто.");
      if (body.config) {
        const old: Listing = json(l.config);
        if (
          body.config.surveyId !== l.survey_id ||
          body.config.minutes !== old.minutes
        )
          throw new CommunityError(
            400,
            "Опрос и длительность после размещения не меняются.",
          );
        const [used] = await c.query<any[]>(
          `SELECT quota_id,COUNT(*) count FROM community_participations WHERE listing_id=? AND status IN ('reserved','pending','review','credited') GROUP BY quota_id`,
          [l.id],
        );
        for (const group of used) {
          const a = old.quotas.find((q) => q.id === group.quota_id),
            b = body.config.quotas.find((q) => q.id === group.quota_id);
          if (
            !a ||
            !b ||
            a.sex !== b.sex ||
            a.ageMin !== b.ageMin ||
            a.ageMax !== b.ageMax ||
            b.target < Number(group.count)
          )
            throw new CommunityError(
              409,
              "Нельзя менять занятую группу или уменьшать квоту ниже числа занятых мест.",
            );
        }
        await c.execute("UPDATE community_listings SET config=? WHERE id=?", [
          JSON.stringify({ ...body.config, budget: old.budget }),
          l.id,
        ]);
      }
      if (body.topup) {
        const w = await wallet(c, req.user!.id);
        if (w.earned + w.bonus < body.topup)
          throw new CommunityError(409, "Недостаточно баллов.");
        const bonus = Math.min(w.bonus, body.topup);
        await c.execute(
          "UPDATE community_wallets SET earned=earned-?,bonus=bonus-? WHERE user_id=?",
          [body.topup - bonus, bonus, req.user!.id],
        );
        await c.execute(
          "UPDATE community_listings SET earned_budget=earned_budget+?,bonus_budget=bonus_budget+? WHERE id=?",
          [body.topup - bonus, bonus, l.id],
        );
        await ledger(
          c,
          req.user!.id,
          `topup:${randomUUID()}`,
          -body.topup,
          "promotion",
          "Пополнение бюджета продвижения",
        );
      }
      if (
        body.state === "active" &&
        (l.survey_status !== "active" || l.deleted_at)
      )
        throw new CommunityError(409, "Исследование должно быть активно.");
      if (body.state === "closed") {
        const [fresh] = await c.query<any[]>(
          "SELECT earned_budget,bonus_budget FROM community_listings WHERE id=?",
          [l.id],
        );
        const amount = fresh[0].earned_budget + fresh[0].bonus_budget;
        await wallet(c, req.user!.id);
        await c.execute(
          "UPDATE community_wallets SET earned=earned+?,bonus=bonus+? WHERE user_id=?",
          [fresh[0].earned_budget, fresh[0].bonus_budget, req.user!.id],
        );
        await c.execute(
          "UPDATE community_listings SET earned_budget=0,bonus_budget=0 WHERE id=?",
          [l.id],
        );
        await ledger(
          c,
          req.user!.id,
          `close:${l.id}`,
          amount,
          "refund",
          "Возврат свободного бюджета",
        );
      }
      if (body.state)
        await c.execute("UPDATE community_listings SET state=? WHERE id=?", [
          body.state,
          l.id,
        ]);
    });
    res.json({ ok: true });
  }),
);

communityRouter.post(
  "/community/listings/:id/join",
  route(async (req, res) => {
    const { answers } = z
      .object({
        answers: z
          .record(z.string(), z.number().int().min(0).max(7))
          .default({}),
      })
      .parse(req.body);
    const result = await tx(async (c) => {
      const l = await lockedListing(c, String(req.params.id)),
        config: Listing = json(l.config),
        user = req.user!.id;
      if (l.owner_id === user)
        throw new CommunityError(403, "За свой опрос баллы не начисляются.");
      const [old] = await c.query<any[]>(
        "SELECT p.*,rs.public_token token FROM community_participations p LEFT JOIN response_sessions rs ON rs.id=p.session_id WHERE p.listing_id=? AND p.user_id=? FOR UPDATE",
        [l.id, user],
      );
      if (
        old[0]?.status === "reserved" &&
        new Date(old[0].expires_at).getTime() > Date.now()
      )
        return {
          token: old[0].token,
          slug: l.slug,
          reward: old[0].reward,
          expiresAt: old[0].expires_at,
        };
      if (old[0])
        throw new CommunityError(
          409,
          "Вы уже участвовали в этом отборе. Повторное вознаграждение недоступно.",
        );
      if (l.state !== "active" || l.survey_status !== "active" || l.deleted_at)
        throw new CommunityError(409, "Набор сейчас приостановлен.");
      const profile = await completeProfile(c, user),
        match = matches(profile, config.criteria);
      if (match !== "pass")
        throw new CommunityError(
          409,
          match === "unknown"
            ? "Уточните анкету участника перед началом."
            : "Вы не соответствуете условиям исследования.",
        );
      const quota = quotaFor(profile, config.quotas);
      if (!quota)
        throw new CommunityError(
          409,
          "Нет подходящей группы. Уточните анкету.",
        );
      const occupied = await counts(c, l.id);
      if ((occupied[quota.id] ?? 0) >= quota.target)
        throw new CommunityError(409, "Набор в вашу группу завершён.");
      if (
        config.screening.some(
          (q) =>
            !Number.isInteger(answers[q.id]) ||
            answers[q.id] >= q.options.length,
        )
      )
        throw new CommunityError(400, "Ответьте на все отборочные вопросы.");
      const pass = screeningPass(config.screening, answers),
        id = old[0]?.id ?? randomUUID();
      const snapshot = JSON.stringify({ profile, config, answers });
      if (!pass) {
        await c.execute(
          "INSERT INTO community_participations(id,listing_id,user_id,quota_id,snapshot,reward,status,expires_at) VALUES (?,?,?,?,?,?,'screened_out',NOW()) ON DUPLICATE KEY UPDATE status='screened_out',snapshot=VALUES(snapshot),session_id=NULL",
          [id, l.id, user, quota.id, snapshot, l.reward],
        );
        return { screenedOut: true };
      }
      if (l.earned_budget + l.bonus_budget < l.reward)
        throw new CommunityError(
          409,
          "Бюджет закончился. Выберите другое исследование.",
        );
      const bonus = Math.min(l.bonus_budget, l.reward),
        sessionId = randomUUID(),
        token = randomBytes(32).toString("hex");
      const expiresAt = new Date(
        Date.now() + Math.max(120, config.minutes * 4) * 60_000,
      );
      await c.execute(
        "UPDATE community_listings SET earned_budget=earned_budget-?,bonus_budget=bonus_budget-? WHERE id=?",
        [l.reward - bonus, bonus, l.id],
      );
      await c.execute(
        "INSERT INTO response_sessions(id,survey_id,public_token,user_agent) VALUES (?,?,?,?)",
        [
          sessionId,
          l.survey_id,
          token,
          req.get("user-agent")?.slice(0, 500) ?? null,
        ],
      );
      await c.execute(
        "INSERT INTO community_participations(id,listing_id,user_id,session_id,quota_id,snapshot,reward,bonus_reserved,status,expires_at) VALUES (?,?,?,?,?,?,?,?,'reserved',?) ON DUPLICATE KEY UPDATE session_id=VALUES(session_id),quota_id=VALUES(quota_id),snapshot=VALUES(snapshot),reward=VALUES(reward),bonus_reserved=VALUES(bonus_reserved),status='reserved',expires_at=VALUES(expires_at),created_at=NOW(),reason=''",
        [
          id,
          l.id,
          user,
          sessionId,
          quota.id,
          snapshot,
          l.reward,
          bonus,
          expiresAt,
        ],
      );
      return { token, slug: l.slug, reward: l.reward, expiresAt };
    });
    res.json(result);
  }),
);

async function resolve(
  c: PoolConnection,
  l: any,
  p: any,
  status: string,
  reason: string,
) {
  if (status === "credited") {
    await wallet(c, p.user_id);
    await c.execute(
      "UPDATE community_wallets SET earned=earned+? WHERE user_id=?",
      [p.reward, p.user_id],
    );
    await ledger(
      c,
      p.user_id,
      `participation:${p.id}`,
      p.reward,
      "participation",
      `Участие: ${l.title}`.slice(0, 300),
    );
  } else await releaseFunds(c, p);
  await c.execute(
    "UPDATE community_participations SET status=?,reason=?,resolved_at=NOW() WHERE id=?",
    [status, reason, p.id],
  );
  // Closing returns reserves as they are released, even after the initial close refund.
  if (status !== "credited" && l.state === "closed") {
    await wallet(c, l.owner_id);
    await c.execute(
      "UPDATE community_wallets SET earned=earned+?,bonus=bonus+? WHERE user_id=?",
      [p.reward - p.bonus_reserved, p.bonus_reserved, l.owner_id],
    );
    await c.execute(
      "UPDATE community_listings SET earned_budget=earned_budget-?,bonus_budget=bonus_budget-? WHERE id=?",
      [p.reward - p.bonus_reserved, p.bonus_reserved, l.id],
    );
    await ledger(
      c,
      l.owner_id,
      `release:${p.id}:${p.created_at instanceof Date ? p.created_at.getTime() : p.created_at}`,
      p.reward,
      "refund",
      "Возврат неиспользованного резерва",
    );
  }
}

export async function settleCommunity() {
  const [pending] = await db.query<any[]>(
    `SELECT p.id,p.listing_id FROM community_participations p LEFT JOIN response_sessions rs ON rs.id=p.session_id WHERE p.status IN ('reserved','pending') AND (p.expires_at<NOW() OR rs.status='completed' AND rs.completed_at<DATE_SUB(NOW(),INTERVAL 2 MINUTE)) ORDER BY p.created_at LIMIT 100`,
  );
  for (const row of pending)
    await tx(async (c) => {
      const l = await lockedListing(c, row.listing_id);
      const [rows] = await c.query<any[]>(
        `SELECT p.*,rs.status session_status,rs.completed_at,rs.deleted_at,TIMESTAMPDIFF(SECOND,rs.started_at,rs.completed_at) seconds,m.cohort,m.eligibility,m.confirmed_duplicate FROM community_participations p LEFT JOIN response_sessions rs ON rs.id=p.session_id LEFT JOIN quality_metadata m ON m.session_id=p.session_id WHERE p.id=? FOR UPDATE`,
        [row.id],
      );
      const p = rows[0];
      if (!p || !["reserved", "pending"].includes(p.status)) return;
      if (
        p.session_status === "completed" &&
        new Date(p.completed_at).getTime() <= new Date(p.expires_at).getTime()
      ) {
        const [jobs] = await c.query<any[]>(
          `SELECT status FROM quality_jobs WHERE survey_id=? AND kind='recompute' AND created_at>=? AND (JSON_EXTRACT(options,'$.sessionId') IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(options,'$.sessionId'))=?) AND status IN ('queued','running','failed') ORDER BY created_at DESC LIMIT 1`,
          [l.survey_id, p.created_at, p.session_id],
        );
        if (
          jobs[0] &&
          Date.now() - new Date(p.completed_at).getTime() < 15 * 60_000
        ) {
          await c.execute(
            "UPDATE community_participations SET status='pending',reason='Ожидаем расчёт показателей качества.' WHERE id=?",
            [p.id],
          );
          return;
        }
        if (jobs[0]) {
          await c.execute(
            "UPDATE community_participations SET status='review',reason='Автоматическая проверка качества задержалась. Требуется проверка администратора.' WHERE id=?",
            [p.id],
          );
          return;
        }
        const [qualities] = await c.query<any[]>(
          `SELECT r.result FROM quality_results r JOIN quality_result_heads h ON h.session_id=r.session_id AND h.algorithm_version=r.algorithm_version AND h.baseline_version=r.baseline_version AND h.input_hash=r.input_hash WHERE r.session_id=? ORDER BY r.calculated_at DESC LIMIT 1`,
          [p.session_id],
        );
        const decision = rewardDecision({
          seconds: Number(p.seconds),
          minutes: json(p.snapshot).config.minutes,
          duplicate: Boolean(p.confirmed_duplicate),
          eligibility: p.eligibility,
          cohort: p.cohort,
          deleted: Boolean(p.deleted_at),
          quality: qualities[0] ? json(qualities[0].result) : null,
        });
        if (decision.status === "review")
          await c.execute(
            "UPDATE community_participations SET status='review',reason=? WHERE id=?",
            [decision.reason, p.id],
          );
        else await resolve(c, l, p, decision.status, decision.reason);
      } else if (new Date(p.expires_at).getTime() < Date.now())
        await resolve(
          c,
          l,
          p,
          "expired",
          "Срок резервирования истёк. Место и баллы освобождены.",
        );
    });
}
let settling = false;
export function startCommunityWorker() {
  const tick = async () => {
    if (settling) return;
    settling = true;
    try {
      await settleCommunity();
    } catch (e) {
      console.error(
        "Community settlement failed",
        e instanceof Error ? e.message : String(e),
      );
    } finally {
      settling = false;
    }
  };
  void tick();
  const timer = setInterval(() => void tick(), 30_000);
  timer.unref();
}

communityRouter.post(
  "/community/participations/:id/appeal",
  route(async (req, res) => {
    const { text } = z
      .object({ text: z.string().trim().min(10).max(1500) })
      .parse(req.body);
    const [result] = await db.execute<any>(
      "UPDATE community_participations SET appeal=? WHERE id=? AND user_id=? AND status IN ('review','rejected')",
      [text, req.params.id, req.user!.id],
    );
    if (!result.affectedRows)
      throw new CommunityError(409, "Обращение недоступно для этого участия.");
    res.json({ ok: true });
  }),
);
communityRouter.get(
  "/community/reviews",
  route(async (_req, res) => {
    const [rows] = await db.query<any[]>(
      `SELECT p.id,p.status,p.reason,p.appeal,p.reward,p.created_at createdAt,s.title,p.user_id userId,l.owner_id ownerId FROM community_participations p JOIN community_listings l ON l.id=p.listing_id JOIN surveys s ON s.id=l.survey_id WHERE p.status='review' OR p.status='rejected' AND p.appeal IS NOT NULL ORDER BY p.created_at LIMIT 100`,
    );
    res.json(rows);
  }),
);
communityRouter.get(
  "/community/reviews/:id",
  route(async (req, res) => {
    const [rows] = await db.query<any[]>(
      `SELECT p.*,l.owner_id,s.title,s.id surveyId,rs.started_at,rs.completed_at,TIMESTAMPDIFF(SECOND,rs.started_at,rs.completed_at) seconds,m.cohort,m.eligibility,m.confirmed_duplicate FROM community_participations p JOIN community_listings l ON l.id=p.listing_id JOIN surveys s ON s.id=l.survey_id LEFT JOIN response_sessions rs ON rs.id=p.session_id LEFT JOIN quality_metadata m ON m.session_id=p.session_id WHERE p.id=?`,
      [req.params.id],
    );
    const p = rows[0];
    if (!p) throw new CommunityError(404, "Участие не найдено.");
    if (req.user!.id === p.user_id || req.user!.id === p.owner_id)
      throw new CommunityError(
        403,
        "Проверку должен выполнить другой администратор, не связанный с участием.",
      );
    const [quality] = await db.query<any[]>(
      `SELECT r.result FROM quality_results r JOIN quality_result_heads h ON h.session_id=r.session_id AND h.algorithm_version=r.algorithm_version AND h.baseline_version=r.baseline_version AND h.input_hash=r.input_hash WHERE r.session_id=? ORDER BY r.calculated_at DESC LIMIT 1`,
      [p.session_id],
    );
    const snapshot = json(p.snapshot);
    res.json({
      id: p.id,
      title: p.title,
      status: p.status,
      reason: p.reason,
      appeal: p.appeal,
      reward: p.reward,
      ownerId: p.owner_id,
      surveyId: p.surveyId,
      seconds: p.seconds,
      cohort: p.cohort,
      eligibility: p.eligibility,
      duplicate: Boolean(p.confirmed_duplicate),
      screening: snapshot.config.screening.map((q: any) => ({
        question: q.question,
        answer: q.options[snapshot.answers[q.id]],
      })),
      minutes: snapshot.config.minutes,
      quality: quality[0] ? json(quality[0].result) : null,
    });
  }),
);
communityRouter.post(
  "/community/reviews/:id",
  route(async (req, res) => {
    const body = z
      .object({
        approve: z.boolean(),
        reason: z.string().trim().min(10).max(500),
      })
      .parse(req.body);
    const [found] = await db.query<any[]>(
      "SELECT listing_id FROM community_participations WHERE id=?",
      [req.params.id],
    );
    if (!found.length) throw new CommunityError(404, "Участие не найдено.");
    await tx(async (c) => {
      const l = await lockedListing(c, found[0].listing_id),
        [rows] = await c.query<any[]>(
          "SELECT * FROM community_participations WHERE id=? FOR UPDATE",
          [req.params.id],
        ),
        p = rows[0];
      if (req.user!.id === p.user_id || req.user!.id === l.owner_id)
        throw new CommunityError(
          403,
          "Проверку должен выполнить другой администратор, не связанный с участием.",
        );
      if (p.status !== "review" && !(p.status === "rejected" && p.appeal))
        throw new CommunityError(409, "Участие уже рассмотрено.");
      if (p.status === "rejected") {
        if (!body.approve) {
          await c.execute(
            "UPDATE community_participations SET appeal=NULL,reason=? WHERE id=?",
            [body.reason, p.id],
          );
        } else {
          // Reinstating an already released reward is funded by a separately audited pilot adjustment, never another participant's reserve.
          await wallet(c, p.user_id);
          await c.execute(
            "UPDATE community_wallets SET earned=earned+? WHERE user_id=?",
            [p.reward, p.user_id],
          );
          await ledger(
            c,
            p.user_id,
            `participation:${p.id}`,
            p.reward,
            "appeal",
            "Начисление по результатам пересмотра",
          );
          await c.execute(
            "UPDATE community_participations SET status='credited',reason=?,resolved_at=NOW() WHERE id=?",
            [body.reason, p.id],
          );
        }
      } else
        await resolve(
          c,
          l,
          p,
          body.approve ? "credited" : "rejected",
          body.reason,
        );
      await c.execute(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,details) VALUES (?,'community_review',?,?)",
        [req.user!.id, p.id, JSON.stringify(body)],
      );
    });
    res.json({ ok: true });
  }),
);
