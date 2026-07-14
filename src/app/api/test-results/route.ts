import { dbUnavailable, query } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const kind = String(body.kind || "").trim();

  if (!kind) {
    return Response.json({ error: "kind required" }, { status: 400 });
  }

  try {
    await query(
      "insert into test_results (kind, name, contact, score, payload) values ($1, $2, $3, $4, $5)",
      [
        kind,
        String(body.name || "").trim(),
        String(body.contact || "").trim(),
        Number.isFinite(body.score) ? body.score : null,
        body.payload || {},
      ],
    );
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ ok: false, error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }

  return Response.json({ ok: true });
}
