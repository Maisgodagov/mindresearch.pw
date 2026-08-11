import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: process.argv[2] ?? '.env' });
const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10_000,
};
console.log({ host: config.host, port: config.port, user: config.user, database: config.database, passwordLength: config.password?.length });
const url = `mysql://${encodeURIComponent(config.user ?? '')}:${encodeURIComponent(config.password ?? '')}@${config.host}:${config.port}/${encodeURIComponent(config.database ?? '')}`;
for (const [name, connectionConfig] of [['fields', config], ['url', { uri: url }]]) {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log(`${name}: connected`);
    await connection.end();
  } catch (error) {
    console.log(`${name}: ${error.code} | ${error.message}`);
  }
}
