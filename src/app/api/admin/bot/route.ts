import { isAuthorized } from "@/lib/admin";
import { dbUnavailable, getPool, query } from "@/lib/db";
import { randomBytes } from "node:crypto";
import { fetch as undiciFetch, ProxyAgent } from "undici";

export const runtime = "nodejs";

const studentFields = new Set([
  "real_name",
  "phone",
  "status",
  "language",
  "level",
  "goals",
  "weak_points",
  "teacher_notes",
]);

export async function GET(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });

  try {
    const [students, submissions, slots, templates] = await Promise.all([
      query(`select s.*,
        count(distinct vs.id)::int as recordings_count,
        count(distinct sa.id) filter (where sa.status in ('submitted', 'reviewed'))::int as completed_count
        from bot_students s
        left join bot_voice_submissions vs on vs.student_id = s.id
        left join bot_student_assignments sa on sa.student_id = s.id
        where s.is_admin_profile = false
        group by s.id order by s.updated_at desc limit 300`),
      query(`select vs.*, s.real_name, s.telegram_username, t.title_ru, t.title_en
        from bot_voice_submissions vs
        join bot_students s on s.id = vs.student_id
        left join bot_student_assignments sa on sa.id = vs.student_assignment_id
        left join bot_assignment_templates t on t.id = sa.template_id
        order by (vs.status = 'pending') desc, vs.created_at desc limit 200`),
      query(`select sl.*, b.id as booking_id, b.status as booking_status, s.real_name as student_name
        from bot_availability_slots sl
        left join bot_lesson_bookings b on b.slot_id = sl.id and b.status <> 'cancelled'
        left join bot_students s on s.id = b.student_id
        where sl.starts_at > now() - interval '1 day'
        order by sl.starts_at limit 300`),
      query(`select t.*,
        count(sa.id)::int assigned_count,
        count(sa.id) filter (where sa.status in ('submitted', 'reviewed'))::int completed_count
        from bot_assignment_templates t
        left join bot_student_assignments sa on sa.template_id = t.id
        group by t.id order by t.sort_order, t.id`),
    ]);

    return Response.json({
      students: students.rows,
      submissions: submissions.rows,
      slots: slots.rows,
      templates: templates.rows,
    });
  } catch (error) {
    if (dbUnavailable(error)) return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });
    throw error;
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const action = String(body.action || "");

  try {
    if (action === "create_student") {
      const realName = String(body.real_name || "").trim();
      if (!realName) return Response.json({ error: "Укажите имя ученика" }, { status: 400 });
      const inviteCode = await uniqueInviteCode();
      const result = await query(
        `insert into bot_students (real_name, phone, student_kind, status, invite_code)
         values ($1, $2, 'existing', 'active', $3) returning *`,
        [realName, clean(body.phone), inviteCode],
      );
      return Response.json({ ok: true, student: result.rows[0] });
    }

    if (action === "save_student") {
      const id = positiveId(body.id);
      const values = body.values && typeof body.values === "object" ? body.values as Record<string, unknown> : {};
      const entries = Object.entries(values).filter(([key]) => studentFields.has(key));
      if (!id || !entries.length) return Response.json({ error: "Нет данных для сохранения" }, { status: 400 });
      const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
      const params = [id, ...entries.map(([, value]) => clean(value))];
      const result = await query(
        `update bot_students set ${assignments.join(", ")}, updated_at = now() where id = $1 returning *`,
        params,
      );
      return Response.json({ ok: true, student: result.rows[0] });
    }

    if (action === "approve_student") {
      const id = positiveId(body.id);
      const result = await query("update bot_students set status = 'active', updated_at = now() where id = $1 returning *", [id]);
      return Response.json({ ok: true, student: result.rows[0] });
    }

    if (action === "renew_invite") {
      const id = positiveId(body.id);
      const inviteCode = await uniqueInviteCode();
      const result = await query(
        "update bot_students set invite_code = $2, updated_at = now() where id = $1 returning *",
        [id, inviteCode],
      );
      return Response.json({ ok: true, student: result.rows[0] });
    }

    if (action === "assign_task") {
      const studentId = positiveId(body.student_id);
      const templateId = positiveId(body.template_id);
      await query(
        `insert into bot_student_assignments (student_id, template_id, assigned_by)
         values ($1, $2, 'chris') on conflict (student_id, template_id) do nothing`,
        [studentId, templateId],
      );
      return Response.json({ ok: true });
    }

    if (action === "review_submission") {
      const id = positiveId(body.id);
      const feedback = String(body.feedback || "").trim();
      const result = await query(
        `update bot_voice_submissions vs
         set status = 'reviewed', teacher_feedback = $2, reviewed_at = now()
         where vs.id = $1
         returning vs.*, (select telegram_user_id from bot_students where id = vs.student_id) telegram_user_id`,
        [id, feedback],
      );
      const submission = result.rows[0];
      if (!submission) return Response.json({ error: "Запись не найдена" }, { status: 404 });
      if (submission.student_assignment_id) {
        await query("update bot_student_assignments set status = 'reviewed' where id = $1", [submission.student_assignment_id]);
      }
      if (submission.telegram_user_id && feedback) {
        await sendTelegram(submission.telegram_user_id, `✅ <b>Крис проверил ваше голосовое</b>\n\n${escapeHtml(feedback)}`);
      }
      return Response.json({ ok: true });
    }

    if (action === "create_slots") {
      const startsAt = new Date(String(body.starts_at));
      const duration = Math.min(240, Math.max(15, Number(body.duration_minutes) || 60));
      const repeats = Math.min(12, Math.max(1, Number(body.repeats) || 1));
      const mode = body.lesson_mode === "offline" ? "offline" : "online";
      if (Number.isNaN(startsAt.getTime())) return Response.json({ error: "Некорректная дата" }, { status: 400 });
      const client = await getPool().connect();
      try {
        await client.query("begin");
        for (let index = 0; index < repeats; index += 1) {
          const start = new Date(startsAt.getTime() + index * 7 * 24 * 60 * 60 * 1000);
          const end = new Date(start.getTime() + duration * 60 * 1000);
          await client.query(
            `insert into bot_availability_slots (starts_at, ends_at, lesson_mode, location)
             values ($1, $2, $3, $4)`,
            [start, end, mode, clean(body.location)],
          );
        }
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      } finally {
        client.release();
      }
      return Response.json({ ok: true });
    }

    if (action === "cancel_slot") {
      const id = positiveId(body.id);
      await query("update bot_availability_slots set status = 'cancelled' where id = $1 and status <> 'booked'", [id]);
      return Response.json({ ok: true });
    }

    if (action === "toggle_template") {
      const id = positiveId(body.id);
      await query("update bot_assignment_templates set active = not active where id = $1", [id]);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Неизвестное действие" }, { status: 400 });
  } catch (error) {
    if (dbUnavailable(error)) return Response.json({ error: "DATABASE_URL is not set" }, { status: 503 });
    throw error;
  }
}

function clean(value: unknown) {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

function positiveId(value: unknown) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}

async function uniqueInviteCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `CHRIS-${randomBytes(3).toString("hex").toUpperCase()}`;
    const exists = await query("select 1 from bot_students where invite_code = $1", [code]);
    if (!exists.rowCount) return code;
  }
  throw new Error("Could not generate unique invite code");
}

async function sendTelegram(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return;
  const dispatcher = process.env.TELEGRAM_PROXY_URL
    ? new ProxyAgent(process.env.TELEGRAM_PROXY_URL)
    : undefined;
  await undiciFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    dispatcher,
  }).catch(() => undefined);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character] || character);
}
