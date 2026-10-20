import { db } from "../db.js";
import { initialCatalog } from "./model.js";
export async function migratePublicMethods() {
  await db.query(`CREATE TABLE IF NOT EXISTS public_method_publications (
    slug VARCHAR(100) PRIMARY KEY, draft JSON NOT NULL, published JSON NULL,
    revision INT UNSIGNED NOT NULL DEFAULT 1, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL
  )`);
  await db.query(`CREATE TABLE IF NOT EXISTS public_assessments (
    id CHAR(36) PRIMARY KEY, token_hash CHAR(64) NOT NULL,
    definition JSON NOT NULL, answers JSON NOT NULL, result JSON NULL,
    position INT UNSIGNED NOT NULL DEFAULT 0, revision INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_public_assessment_expiry (expires_at)
  )`);
  for (const method of initialCatalog) {
    await db.execute(
      "INSERT IGNORE INTO public_method_publications (slug,draft,published,published_at) VALUES (?,?,?,CURRENT_TIMESTAMP)",
      [method.slug, JSON.stringify(method), JSON.stringify(method)],
    );
  }
  await db.execute(
    "DELETE FROM public_assessments WHERE expires_at <= UTC_TIMESTAMP()",
  );
  setInterval(() => {
    void db
      .execute(
        "DELETE FROM public_assessments WHERE expires_at <= UTC_TIMESTAMP()",
      )
      .catch(() => console.error("Public assessment expiry cleanup failed"));
  }, 3600000).unref();
}
