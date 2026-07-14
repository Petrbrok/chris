import { isAuthorized } from "@/lib/admin";
import { dbUnavailable, query } from "@/lib/db";

const tables = [
  "leads",
  "test_results",
  "speaking_submissions",
  "media_records",
  "reviews",
  "faq_items",
  "speaking_club_events",
  "test_questions",
  "speaking_topics",
  "stats_events",
];

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const entries = await Promise.all(
      tables.map(async (table) => {
        const result = await query(`select * from ${table} order by 1 desc limit 100`);
        return [table, result.rows] as const;
      }),
    );
    return Response.json(Object.fromEntries(entries));
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ error: "DATABASE_URL is not set", tables }, { status: 503 });
    }
    throw error;
  }
}
