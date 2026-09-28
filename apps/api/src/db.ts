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
    `CREATE TABLE IF NOT EXISTS dashboard_views (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, survey_id CHAR(36) NOT NULL, name VARCHAR(160) NOT NULL, config JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS assessment_results (session_id CHAR(36) NOT NULL, section_id CHAR(36) NOT NULL, formula_version VARCHAR(80) NOT NULL, result JSON NOT NULL, interpretation JSON NULL, calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (session_id,section_id), FOREIGN KEY (session_id) REFERENCES response_sessions(id) ON DELETE CASCADE, FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE)`
    ,`CREATE TABLE IF NOT EXISTS instruments (id CHAR(36) PRIMARY KEY, owner_id CHAR(36) NULL, code VARCHAR(100) NULL UNIQUE, title VARCHAR(255) NOT NULL, description TEXT NULL, is_verified BOOLEAN NOT NULL DEFAULT FALSE, scoring_code VARCHAR(80) NULL, status ENUM('active','archived') NOT NULL DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_instrument_owner (owner_id), INDEX idx_instrument_verified (is_verified,status))`
    ,`CREATE TABLE IF NOT EXISTS instrument_questions (id CHAR(36) PRIMARY KEY, instrument_id CHAR(36) NOT NULL, code VARCHAR(100) NOT NULL, text TEXT NOT NULL, type ENUM('single','multiple','text','number') NOT NULL, required BOOLEAN NOT NULL DEFAULT TRUE, position INT NOT NULL, options JSON NULL, validation JSON NULL, UNIQUE(instrument_id,code), FOREIGN KEY (instrument_id) REFERENCES instruments(id) ON DELETE CASCADE)`
    ,`CREATE TABLE IF NOT EXISTS instrument_submissions (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, title VARCHAR(255) NOT NULL, original_author VARCHAR(500) NOT NULL, publication_year SMALLINT UNSIGNED NULL, has_russian_adaptation BOOLEAN NULL, source_url TEXT NULL, description TEXT NOT NULL, questionnaire_text MEDIUMTEXT NOT NULL, scoring_text MEDIUMTEXT NULL, rights_note TEXT NULL, status ENUM('submitted','reviewing','approved','rejected') NOT NULL DEFAULT 'submitted', admin_note TEXT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_submission_status (status,created_at))`
    ,`CREATE TABLE IF NOT EXISTS auth_sessions (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE, expires_at DATETIME NOT NULL, revoked_at DATETIME NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_agent VARCHAR(500) NULL, ip_address VARCHAR(45) NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_auth_user (user_id), INDEX idx_auth_expiry (expires_at,revoked_at))`
    ,`CREATE TABLE IF NOT EXISTS password_reset_tokens (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE, expires_at DATETIME NOT NULL, used_at DATETIME NULL, requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_reset_user_time (user_id,requested_at), INDEX idx_reset_expiry (expires_at))`
    ,`CREATE TABLE IF NOT EXISTS bug_reports (id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, category ENUM('bug','methodology','other') NOT NULL DEFAULT 'bug', description TEXT NOT NULL, page_url TEXT NULL, status ENUM('new','in_progress','resolved','dismissed') NOT NULL DEFAULT 'new', admin_note TEXT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_bug_report_status (status,created_at))`
  ];
  for (const sql of statements) await db.query(sql);
  const ensureColumn=async(table:string,column:string,definition:string)=>{const[rows]=await db.query<any[]>(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?`,[table,column]);if(!rows.length)await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)};
  await ensureColumn('users','bio','TEXT NULL');
  await ensureColumn('users','avatar_url','TEXT NULL');
  await ensureColumn('users','avatar_seed','VARCHAR(120) NULL');
  await ensureColumn('users','public_slug','VARCHAR(120) NULL UNIQUE');
  await ensureColumn('users','is_profile_public','BOOLEAN NOT NULL DEFAULT FALSE');
  await ensureColumn('users','updated_at','TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  await ensureColumn('surveys','description','TEXT NULL');
  await ensureColumn('surveys','updated_at','TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  await ensureColumn('surveys','show_author','BOOLEAN NOT NULL DEFAULT TRUE');
  await ensureColumn('surveys','builder_state','JSON NULL');
  await ensureColumn('surveys','deleted_at','TIMESTAMP NULL');
  await ensureColumn('sections','source_instrument_id','CHAR(36) NULL');
  await ensureColumn('sections','section_kind',"ENUM('custom','verified') NOT NULL DEFAULT 'custom'");
  await ensureColumn('instrument_submissions','publication_year','SMALLINT UNSIGNED NULL');
  await ensureColumn('instrument_submissions','has_russian_adaptation','BOOLEAN NULL');
  await ensureColumn('instruments','methodology','JSON NULL');
  await ensureColumn('instruments','scoring_config','JSON NULL');
  await ensureColumn('instruments','validation_cases','JSON NULL');
  await ensureColumn('instruments','formula_version','VARCHAR(100) NULL');
  await db.query("UPDATE users SET public_slug=CONCAT('user-', LEFT(REPLACE(id, '-', ''), 8)) WHERE public_slug IS NULL");
  const [deletedAtColumns]=await db.query<any[]>(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='response_sessions' AND COLUMN_NAME='deleted_at'`);
  if(!deletedAtColumns.length) await db.query(`ALTER TABLE response_sessions ADD COLUMN deleted_at TIMESTAMP NULL, ADD INDEX idx_deleted_at (deleted_at)`);
}
