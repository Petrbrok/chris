import { dbUnavailable, query } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const contact = String(body.contact || "").trim();

  if (!contact) {
    return Response.json({ error: "contact required" }, { status: 400 });
  }

  try {
    await query(
      "insert into leads (name, contact, message, source) values ($1, $2, $3, $4)",
      [
        String(body.name || "").trim(),
        contact,
        String(body.message || "").trim(),
        String(body.source || "site").trim(),
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
