import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000,
  });

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  const result = await getPool().query<T>(text, values);
  return result;
}

export function dbUnavailable(error: unknown) {
  return error instanceof Error && error.message.includes("DATABASE_URL");
}
