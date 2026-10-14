import { readProfileLinks } from './profile-links.js';
import { Router } from "express";
import { z } from "zod";
import { db } from "./db.js";
import { requireRole, type AuthRequest } from "./auth.js";
export const adminManagementRouter = Router();
adminManagementRouter.use("/admin/users", requireRole("owner", "admin"));

adminManagementRouter.get("/admin/users/:id", async (req, res, next) => {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT id,email,name,role,bio,profile_links profileLinks,avatar_seed avatarSeed,public_slug publicSlug,is_profile_public isProfilePublic,onboarding_status onboardingStatus,created_at createdAt,last_seen_at lastSeenAt FROM users WHERE id=?`,
      [req.params.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.json({ ...rows[0],profileLinks:readProfileLinks(rows[0].profileLinks), isProfilePublic: Boolean(rows[0].isProfilePublic) });
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get(
  "/admin/users/:id/deletion-preview",
  async (req: AuthRequest, res, next) => {
    try {
      const [users] = await db.query<any[]>(
        "SELECT id,email,role FROM users WHERE id=?",
        [req.params.id],
      );
      if (!users.length)
        return res.status(404).json({ message: "Пользователь не найден" });
      const [rows] = await db.query<any[]>(
        `SELECT COUNT(DISTINCT s.id) surveys,COUNT(DISTINCT rs.id) responses,COUNT(DISTINCT a.id) answers FROM surveys s LEFT JOIN response_sessions rs ON rs.survey_id=s.id LEFT JOIN answers a ON a.session_id=rs.id WHERE s.owner_id=?`,
        [req.params.id],
      );
      res.json({
        ...rows[0],
        email: users[0].email,
        canDelete:
          req.params.id !== req.user!.id &&
          users[0].role !== "owner" &&
          (users[0].role !== "admin" || req.user!.role === "owner"),
      });
    } catch (error) {
      next(error);
    }
  },
);

adminManagementRouter.delete(
  "/admin/users/:id",
  async (req: AuthRequest, res, next) => {
    let connection;
    try {
      const { confirmEmail } = z
        .object({ confirmEmail: z.string().email() })
        .parse(req.body);
      connection = await db.getConnection();
      await connection.beginTransaction();
      const [users] = await connection.query<any[]>(
        "SELECT id,email,role FROM users WHERE id=? FOR UPDATE",
        [req.params.id],
      );
      if (!users.length) {
        await connection.rollback();
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      const user = users[0];
      if (
        user.id === req.user!.id ||
        user.role === "owner" ||
        (user.role === "admin" && req.user!.role !== "owner")
      ) {
        await connection.rollback();
        return res
          .status(403)
          .json({
            message: "Этот аккаунт нельзя удалить с вашим уровнем доступа",
          });
      }
      if (confirmEmail.toLowerCase() !== user.email.toLowerCase()) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: "Введите почту удаляемого пользователя" });
      }
      const [surveys] = await connection.query<any[]>(
        "SELECT id FROM surveys WHERE owner_id=? FOR UPDATE",
        [user.id],
      );
      const [jobs] = await connection.query<any[]>(
        `SELECT j.id FROM quality_jobs j JOIN surveys s ON s.id=j.survey_id WHERE s.owner_id=? AND j.status IN ('queued','running') LIMIT 1`,
        [user.id],
      );
      if (jobs.length) {
        await connection.rollback();
        return res
          .status(409)
          .json({
            message:
              "Дождитесь завершения пересчёта качества в опросах этого пользователя",
          });
      }
      const [counts] = await connection.query<any[]>(
        "SELECT COUNT(*) count FROM response_sessions rs JOIN surveys s ON s.id=rs.survey_id WHERE s.owner_id=?",
        [user.id],
      );
      await connection.execute(
        "DELETE d FROM dashboard_views d LEFT JOIN surveys s ON s.id=d.survey_id WHERE d.user_id=? OR s.owner_id=?",
        [user.id, user.id],
      );
      await connection.execute(
        "DELETE q FROM quality_settings q JOIN surveys s ON s.id=q.survey_id WHERE s.owner_id=?",
        [user.id],
      );
      await connection.execute(
        "DELETE rs FROM response_sessions rs JOIN surveys s ON s.id=rs.survey_id WHERE s.owner_id=?",
        [user.id],
      );
      await connection.execute("DELETE FROM surveys WHERE owner_id=?", [
        user.id,
      ]);
      // Keep library definitions already referenced by another researcher's survey.
      await connection.execute(
        `UPDATE instruments i SET owner_id=NULL WHERE owner_id=? AND (is_verified=TRUE OR EXISTS(SELECT 1 FROM sections s WHERE s.source_instrument_id=i.id))`,
        [user.id],
      );
      await connection.execute("DELETE FROM users WHERE id=?", [user.id]);
      await connection.execute(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,details) VALUES (?,?,?,?)",
        [
          req.user!.id,
          "user_deleted",
          user.id,
          JSON.stringify({
            surveys: surveys.length,
            responses: Number(counts[0].count),
          }),
        ],
      );
      await connection.commit();
      res.json({
        ok: true,
        surveys: surveys.length,
        responses: Number(counts[0].count),
      });
    } catch (error) {
      if (connection) await connection.rollback();
      next(error);
    } finally {
      connection?.release();
    }
  },
);
