import { dbUnavailable, query } from "@/lib/db";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const body = contentType.includes("multipart/form-data")
    ? await readFormBody(request)
    : await request.json();
  const name = String(body.name || "").trim();
  const telegram = String(body.telegram || "").trim();
  const topic = String(body.topic || "").trim();

  if (!name || !telegram || !topic) {
    return Response.json({ error: "name, telegram and topic required" }, { status: 400 });
  }

  try {
    await query(
      "insert into speaking_submissions (name, telegram, topic, audio_url, note) values ($1, $2, $3, $4, $5)",
      [name, telegram, topic, String(body.audioUrl || "").trim(), String(body.note || "").trim()],
    );
  } catch (error) {
    if (dbUnavailable(error)) {
      return Response.json({ ok: false, error: "DATABASE_URL is not set" }, { status: 503 });
    }
    throw error;
  }

  return Response.json({ ok: true });
}

async function readFormBody(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");
  let audioUrl = String(form.get("audioUrl") || "").trim();

  if (audio instanceof File && audio.size > 0) {
    const bytes = Buffer.from(await audio.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", "speaking");
    await mkdir(dir, { recursive: true });
    const ext = audio.type.includes("mp4") ? "mp4" : audio.type.includes("mpeg") ? "mp3" : "webm";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await writeFile(path.join(dir, fileName), bytes);
    audioUrl = `/uploads/speaking/${fileName}`;
  }

  return {
    name: form.get("name"),
    telegram: form.get("telegram"),
    topic: form.get("topic"),
    note: form.get("note"),
    audioUrl,
  };
}
