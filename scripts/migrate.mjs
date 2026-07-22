import nextEnv from "@next/env";
import pg from "pg";
import { readFile } from "node:fs/promises";

const { loadEnvConfig } = nextEnv;
const { Client } = pg;

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

await client.connect();
try {
  const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  await client.query(sql);
  const result = await client.query("select count(1)::int as count from bot_assignment_templates");
  console.log(`Database schema is up to date. Bot tasks: ${result.rows[0].count}.`);
} finally {
  await client.end();
}
