import { isAuthorized } from "@/lib/admin";
import { dbUnavailable, query } from "@/lib/db";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await query<{ key: string; value: unknown }>(
      "select key, value from site_settings order by key",
    );
    return Response.json(Object.fromEntries(result.rows.map((row) => [row.key, row.value])));
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const key = String(body.key || "").trim();

  if (!key) {
    return Response.json({ error: "key required" }, { status: 400 });
  }

  try {
    await query(
      "insert into site_settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value, updated_at = now()",
      [key, body.value || {}],
    );
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }

  return Response.json({ ok: true });
}
