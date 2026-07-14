import { csv, isAuthorized } from "@/lib/admin";
import { dbUnavailable, query } from "@/lib/db";

const allowed = new Set(["leads", "test_results", "speaking_submissions"]);

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const table = url.searchParams.get("table") || "leads";

  if (!allowed.has(table)) {
    return Response.json({ error: "unsupported table" }, { status: 400 });
  }

  try {
    const result = await query(`select * from ${table} order by 1 desc`);
    return new Response(csv(result.rows), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${table}.csv"`,
      },
    });
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }
}
