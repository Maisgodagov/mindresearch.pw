import type { PoolConnection } from "mysql2/promise";
import { db } from "../db.js";
import {
  failure,
  type Definition,
  type PublicMethod,
  type PublicResult,
} from "./model.js";
export type Publication = {
  slug: string;
  draft: PublicMethod;
  published: PublicMethod | null;
  revision: number;
};
export type Assessment = {
  id: string;
  definition: Definition;
  answers: Record<string, number>;
  result: PublicResult | null;
  position: number;
  revision: number;
  expiresAt: string;
};
export interface Repository {
  publications(): Promise<Publication[]>;
  savePublication(
    slug: string,
    draft: PublicMethod,
    action: "draft" | "publish" | "unpublish",
    revision: number,
  ): Promise<void>;
  create(assessment: Assessment, tokenHash: string): Promise<void>;
  assessment<T>(
    id: string,
    tokenHash: string,
    operation: (assessment: Assessment) => T | Promise<T>,
  ): Promise<T>;
  remove(id: string, tokenHash: string): Promise<void>;
}
const json = <T>(value: T | string): T =>
  typeof value === "string" ? JSON.parse(value) : value;
export function mysqlRepository(): Repository {
  return {
    async publications() {
      const [rows] = await db.query<any[]>(
        "SELECT slug,draft,published,revision FROM public_method_publications ORDER BY slug",
      );
      return rows.map((row) => ({
        ...row,
        draft: json(row.draft),
        published: row.published ? json(row.published) : null,
      }));
    },
    async savePublication(slug, draft, action, revision) {
      const published =
        action === "draft" ? "" : ",published=?,published_at=UTC_TIMESTAMP()";
      const values: (string | number | null)[] = [JSON.stringify(draft)];
      if (action !== "draft")
        values.push(action === "publish" ? JSON.stringify(draft) : null);
      values.push(slug, revision);
      const [result] = await db.execute<any>(
        `UPDATE public_method_publications SET draft=?,revision=revision+1${published} WHERE slug=? AND revision=?`,
        values,
      );
      if (!result.affectedRows)
        throw failure(
          409,
          "Публикация изменилась. Обновите страницу перед сохранением",
        );
    },
    async create(a, tokenHash) {
      await db.execute(
        "INSERT INTO public_assessments (id,token_hash,definition,answers,position,revision,expires_at) VALUES (?,?,?,?,?,?,?)",
        [
          a.id,
          tokenHash,
          JSON.stringify(a.definition),
          JSON.stringify(a.answers),
          a.position,
          a.revision,
          a.expiresAt.slice(0, 19).replace("T", " "),
        ],
      );
    },
    async assessment<T>(
      id: string,
      tokenHash: string,
      operation: (a: Assessment) => T | Promise<T>,
    ): Promise<T> {
      const c: PoolConnection = await db.getConnection();
      try {
        await c.beginTransaction();
        const [rows] = await c.query<any[]>(
          "SELECT id,definition,answers,result,position,revision,DATE_FORMAT(expires_at, '%Y-%m-%dT%H:%i:%s.000Z') expiresAt FROM public_assessments WHERE id=? AND token_hash=? AND expires_at > UTC_TIMESTAMP() FOR UPDATE",
          [id, tokenHash],
        );
        if (!rows.length)
          throw failure(404, "Прохождение недоступно или срок хранения истёк");
        const row = rows[0];
        const assessment: Assessment = {
          id: row.id,
          definition: json(row.definition),
          answers: json(row.answers),
          result: row.result ? json(row.result) : null,
          position: row.position,
          revision: row.revision,
          expiresAt: row.expiresAt,
        };
        const result = await operation(assessment);
        await c.execute(
          "UPDATE public_assessments SET answers=?,result=?,position=?,revision=?,expires_at=? WHERE id=?",
          [
            JSON.stringify(assessment.answers),
            assessment.result ? JSON.stringify(assessment.result) : null,
            assessment.position,
            assessment.revision,
            assessment.expiresAt.slice(0, 19).replace("T", " "),
            id,
          ],
        );
        await c.commit();
        return result;
      } catch (error) {
        await c.rollback();
        throw error;
      } finally {
        c.release();
      }
    },
    async remove(id, tokenHash) {
      await db.execute(
        "DELETE FROM public_assessments WHERE id=? AND token_hash=?",
        [id, tokenHash],
      );
    },
  };
}
