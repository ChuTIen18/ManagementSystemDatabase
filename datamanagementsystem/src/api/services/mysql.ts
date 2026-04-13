import fs from 'fs';
import path from 'path';
import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

type MysqlEnvConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

function getMysqlEnvConfig(): MysqlEnvConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coffee_shop_db',
  };
}

function findSchemaSqlPath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'dist/database/schemas/schema.sql'),
    path.resolve(process.cwd(), 'src/database/schemas/schema.sql'),
    path.resolve(__dirname, '../../database/schemas/schema.sql'),
    path.resolve(__dirname, '../../../database/schemas/schema.sql'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(
    `schema.sql not found. Looked in:\n${candidates.map((c) => `- ${c}`).join('\n')}`
  );
}

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

export async function initMysql(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { host, port, user, password, database } = getMysqlEnvConfig();

    const adminConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
    });

    try {
      await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    } finally {
      await adminConnection.end();
    }

    const schemaConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true,
    });

    try {
      const schemaPath = findSchemaSqlPath();
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await schemaConnection.query(schemaSql);
    } finally {
      await schemaConnection.end();
    }

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  })();

  return initPromise;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('MySQL pool not initialized. Call initMysql() before handling requests.');
  }
  return pool;
}

