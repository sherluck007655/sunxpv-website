import mysql, { type Pool } from "mysql2/promise";

declare global {
  var sunxMysqlPool: Pool | undefined;
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export function getMysqlPool() {
  if (globalThis.sunxMysqlPool) return globalThis.sunxMysqlPool;

  const pool = mysql.createPool({
    host: required("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT || 3306),
    database: required("MYSQL_DATABASE"),
    user: required("MYSQL_USER"),
    password: required("MYSQL_PASSWORD"),
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60_000,
    queueLimit: 0,
    enableKeepAlive: true,
    ...(process.env.MYSQL_SSL === "true"
      ? { ssl: { rejectUnauthorized: true } }
      : {}),
  });

  globalThis.sunxMysqlPool = pool;
  return pool;
}

export async function pingDatabase() {
  await getMysqlPool().query("SELECT 1");
}
