import { dbUnavailable, query } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const contact = String(body.contact || "").trim();
  const level = String(body.level || "").trim();
  const clubName = String(body.clubName || "").trim();
  const clubId = Number(body.clubId);
  const source = String(body.source || "site").trim();

  if (!name || !contact || !level || !clubName || !Number.isInteger(clubId) || clubId < 1 || clubId > 6) {
    return Response.json({ error: "invalid speaking club signup" }, { status: 400 });
  }

  try {
    await query(
      "insert into speaking_club_signups (name, contact, level, club_id, club_name, source) values ($1, $2, $3, $4, $5, $6)",
      [name, contact, level, clubId, clubName, source],
    );
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ ok: false, error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }

  return Response.json({ ok: true });
}
