import { db } from "../db.js";
export async function migrateStatistics() {
  await db.query(`CREATE TABLE IF NOT EXISTS analysis_samples (
    id CHAR(36) PRIMARY KEY,survey_id CHAR(36) NOT NULL,name VARCHAR(160) NOT NULL,revision INT NOT NULL DEFAULT 1,
    created_by CHAR(36) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(survey_id) REFERENCES surveys(id) ON DELETE CASCADE,INDEX(survey_id))`);
  await db.query(`CREATE TABLE IF NOT EXISTS analysis_sample_versions (
    sample_id CHAR(36) NOT NULL,revision INT NOT NULL,definition JSON NOT NULL,members JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(sample_id,revision),
    FOREIGN KEY(sample_id) REFERENCES analysis_samples(id) ON DELETE CASCADE)`);
  await db.query(`CREATE TABLE IF NOT EXISTS statistical_analyses (
    id CHAR(36) PRIMARY KEY,survey_id CHAR(36) NOT NULL,created_by CHAR(36) NOT NULL,name VARCHAR(160) NOT NULL,
    status ENUM('queued','running','completed','failed') NOT NULL DEFAULT 'queued',input JSON NOT NULL,result JSON NULL,error TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,finished_at TIMESTAMP NULL,
    FOREIGN KEY(survey_id) REFERENCES surveys(id) ON DELETE CASCADE,INDEX(survey_id,created_at),INDEX(status))`);
}
