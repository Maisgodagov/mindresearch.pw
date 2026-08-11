import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = process.env.DATABASE_URL
  ? { uri: process.env.DATABASE_URL }
  : { host: process.env.DB_HOST, port: Number(process.env.DB_PORT ?? 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME };
if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME)) throw new Error('Database settings are required');
export const db = mysql.createPool({ ...connection, connectionLimit: 10, decimalNumbers: true });

export async function migrate() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (id CHAR(36) PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role ENUM('owner','admin','researcher') NOT NULL DEFAULT 'owner', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS surveys (id CHAR(36) PRIMARY KEY, owner_id CHAR(36) NOT NULL, slug VARCHAR(120) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, welcome_title VARCHAR(255) NOT NULL, welcome_text TEXT NOT NULL, status ENUM('draft','active','archived') NOT NULL DEFAULT 'draft', settings JSON NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (owner_id) REFERENCES users(id))`,
    `CREATE TABLE IF NOT EXISTS sections (id CHAR(36) PRIMARY KEY, survey_id CHAR(36) NOT NULL, code VARCHAR(80) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NULL, position INT NOT NULL, UNIQUE(survey_id, code), FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS questions (id CHAR(36) PRIMARY KEY, section_id CHAR(36) NOT NULL, code VARCHAR(100) NOT NULL, text TEXT NOT NULL, type ENUM('single','multiple','text','number') NOT NULL, required BOOLEAN NOT NULL DEFAULT TRUE, position INT NOT NULL, options JSON NULL, validation JSON NULL, UNIQUE(section_id, code), FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS response_sessions (id CHAR(36) PRIMARY KEY, survey_id CHAR(36) NOT NULL, public_token CHAR(64) NOT NULL UNIQUE, status ENUM('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress', current_position INT NOT NULL DEFAULT 0, started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, completed_at TIMESTAMP NULL, user_agent VARCHAR(500) NULL, FOREIGN KEY (survey_id) REFERENCES surveys(id), INDEX idx_survey_status (survey_id,status), INDEX idx_activity (last_activity_at))`,
    `CREATE TABLE IF NOT EXISTS answers (id BIGINT AUTO_INCREMENT PRIMARY KEY, session_id CHAR(36) NOT NULL, question_id CHAR(36) NOT NULL, value JSON NOT NULL, answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE(session_id,question_id), FOREIGN KEY (session_id) REFERENCES response_sessions(id) ON DELETE CASCADE, FOREIGN KEY (question_id) REFERENCES questions(id))`,
    `CREATE TABLE IF NOT EXISTS dashboard_views (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, survey_id CHAR(36) NOT NULL, name VARCHAR(160) NOT NULL, config JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE)`
  ];
  for (const sql of statements) await db.execute(sql);
}
