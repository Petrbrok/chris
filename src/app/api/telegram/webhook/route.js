import { processUpdate } from "../../../../../bot/index.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  await processUpdate(await request.json());
  return Response.json({ ok: true });
}
