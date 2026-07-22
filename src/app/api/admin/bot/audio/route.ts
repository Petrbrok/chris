import { adminToken } from "@/lib/admin";
import { query } from "@/lib/db";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== adminToken()) return new Response("Unauthorized", { status: 401 });
  const id = Number(url.searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return new Response("Bad id", { status: 400 });

  const result = await query<{ audio_url: string }>("select audio_url from bot_voice_submissions where id = $1", [id]);
  const audioUrl = result.rows[0]?.audio_url;
  if (!audioUrl?.startsWith("bot://")) return new Response("Audio not found", { status: 404 });

  const fileName = path.basename(audioUrl.slice("bot://".length));
  const file = await readFile(path.join(process.cwd(), "storage", "bot-voice", fileName)).catch(() => null);
  if (!file) return new Response("Audio not found", { status: 404 });

  const extension = path.extname(fileName).toLowerCase();
  const type = extension === ".mp3" ? "audio/mpeg" : extension === ".wav" ? "audio/wav" : "audio/ogg";
  return new Response(file, { headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" } });
}
