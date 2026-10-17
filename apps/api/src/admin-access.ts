import { db } from "./db.js";
import type { AuthRequest } from "./auth.js";

export const isAdministrator = (req: AuthRequest) =>
  ["owner", "admin"].includes(req.user?.role ?? "");
// Admin inspection grants read access only; all mutation routes retain owner checks.
export async function canReadSurvey(req: AuthRequest, id: string) {
  const [rows] = await db.query<any[]>(
    "SELECT id FROM surveys WHERE id=? AND (owner_id=? OR ? OR EXISTS(SELECT 1 FROM survey_members m WHERE m.survey_id=surveys.id AND m.user_id=?)) AND deleted_at IS NULL",
    [id, req.user!.id, isAdministrator(req), req.user!.id],
  );
  return rows.length > 0;
}
