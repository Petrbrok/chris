"use client";

import { useEffect, useMemo, useState } from "react";

type Row = Record<string, unknown>;
type Section = "students" | "review" | "calendar" | "tasks";

const sections: Array<{ key: Section; label: string }> = [
  { key: "students", label: "Ученики" },
  { key: "review", label: "Проверка голосовых" },
  { key: "calendar", label: "Расписание" },
  { key: "tasks", label: "Задания" },
];

export default function BotAdmin({ token }: { token: string }) {
  const [section, setSection] = useState<Section>("students");
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [status, setStatus] = useState("Загрузка...");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    const response = await fetch("/api/admin/bot", { headers: { Authorization: `Bearer ${token}` } });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(body.error || "Не удалось загрузить данные бота");
      return;
    }
    setData(body);
    setStatus("");
  }

  async function act(action: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    const response = await fetch("/api/admin/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, ...payload }),
    });
    const body = await response.json();
    setBusy(false);
    setStatus(response.ok ? "Сохранено" : body.error || "Ошибка");
    if (response.ok) await load();
    return response.ok;
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/bot", {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!response.ok) {
          setStatus(body.error || "Не удалось загрузить данные бота");
          return;
        }
        setData(body);
        setStatus("");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") setStatus("Не удалось загрузить данные бота");
      });
    return () => controller.abort();
  }, [token]);

  const students = data.students || [];
  const submissions = data.submissions || [];
  const slots = data.slots || [];
  const templates = data.templates || [];
  const pending = submissions.filter((item) => item.status === "pending").length;

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[24px] border border-[#087bd3]/10 bg-[#172033] text-white shadow-[0_22px_60px_rgba(23,32,51,0.16)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a51d]">Chris Speaking OS</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Ученики, практика и уроки</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/65">
              Telegram ID определяет человека, а имя, цели и заметки остаются в закрытой карточке Криса.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <DarkMetric label="учеников" value={students.length} />
            <DarkMetric label="ждут проверки" value={pending} accent />
            <DarkMetric label="окон" value={slots.filter((item) => item.status === "available").length} />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 pt-3">
          {sections.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSection(item.key)}
              className={`whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-black transition ${
                section === item.key ? "bg-[#f6f2ea] text-[#172033]" : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.label}{item.key === "review" && pending ? ` · ${pending}` : ""}
            </button>
          ))}
        </nav>
      </section>

      {status ? <p className="rounded-xl bg-[#087bd3]/8 px-4 py-3 text-sm font-bold text-[#087bd3]">{status}</p> : null}

      {section === "students" ? <Students rows={students} templates={templates} busy={busy} act={act} /> : null}
      {section === "review" ? <Review rows={submissions} token={token} busy={busy} act={act} /> : null}
      {section === "calendar" ? <Calendar rows={slots} busy={busy} act={act} /> : null}
      {section === "tasks" ? <Tasks rows={templates} busy={busy} act={act} /> : null}
    </div>
  );
}

function Students({ rows, templates, busy, act }: { rows: Row[]; templates: Row[]; busy: boolean; act: Action }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const selected = rows.find((row) => Number(row.id) === selectedId) || null;
  const filtered = useMemo(() => rows.filter((row) => `${text(row.real_name)} ${text(row.telegram_username)}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);

  async function createStudent() {
    if (await act("create_student", { real_name: newName, phone: newPhone })) {
      setNewName("");
      setNewPhone("");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="grid h-fit gap-4">
        <Panel title="Добавить действующего ученика" note="После создания передайте ему персональный код.">
          <Field label="Имя" value={newName} onChange={setNewName} placeholder="Как Крис его знает" />
          <Field label="Телефон — необязательно" value={newPhone} onChange={setNewPhone} placeholder="+7…" />
          <Primary disabled={busy || !newName.trim()} onClick={createStudent}>Создать и получить код</Primary>
        </Panel>
        <Panel title="Все ученики">
          <Field label="Поиск" value={query} onChange={setQuery} placeholder="Имя или Telegram" />
          <div className="grid max-h-[620px] gap-2 overflow-y-auto pr-1">
            {filtered.map((row) => (
              <button key={text(row.id)} type="button" onClick={() => setSelectedId(Number(row.id))} className={`rounded-2xl border p-4 text-left transition ${selectedId === Number(row.id) ? "border-[#087bd3] bg-[#087bd3]/6" : "border-[#172033]/8 bg-[#f6f2ea] hover:border-[#087bd3]/35"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{text(row.real_name)}</p>
                    <p className="mt-1 text-xs font-bold text-[#42506a]">{row.telegram_user_id ? `ID ${text(row.telegram_user_id)}` : "Telegram ещё не привязан"}</p>
                  </div>
                  <Status value={text(row.status)} />
                </div>
                <p className="mt-3 text-xs font-bold text-[#087bd3]">{text(row.completed_count)} заданий · {text(row.recordings_count)} голосовых</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {selected ? <StudentCard key={text(selected.id)} row={selected} templates={templates} busy={busy} act={act} /> : (
        <Panel title="Карточка ученика" note="Выберите ученика слева. Здесь Крис сможет вести цели, слабые места и личные заметки.">
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#087bd3]/25 bg-[#087bd3]/4 px-6 text-center font-bold text-[#42506a]">Карточка пока не выбрана</div>
        </Panel>
      )}
    </div>
  );
}

function StudentCard({ row, templates, busy, act }: { row: Row; templates: Row[]; busy: boolean; act: Action }) {
  const [values, setValues] = useState({
    real_name: text(row.real_name), phone: text(row.phone), status: text(row.status), language: text(row.language),
    level: text(row.level), goals: text(row.goals), weak_points: text(row.weak_points), teacher_notes: text(row.teacher_notes),
  });
  const [templateId, setTemplateId] = useState("");
  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <Panel title={values.real_name || "Ученик"} note={row.telegram_username ? `@${text(row.telegram_username)}` : "Закрытая карточка Криса"}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Настоящее имя" value={values.real_name} onChange={(value) => update("real_name", value)} />
        <Field label="Телефон" value={values.phone} onChange={(value) => update("phone", value)} />
        <Select label="Статус" value={values.status} onChange={(value) => update("status", value)} options={[["pending", "Ожидает подтверждения"], ["active", "Активен"], ["paused", "Пауза"], ["archived", "Архив"]]} />
        <Select label="Язык бота" value={values.language} onChange={(value) => update("language", value)} options={[["ru", "Русский"], ["en", "English"]]} />
        <Field label="Уровень" value={values.level} onChange={(value) => update("level", value)} placeholder="A2, B1…" />
        <div className="rounded-2xl bg-[#f3a51d]/12 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9b5f08]">Персональный код</p>
          <p className="mt-2 font-mono text-lg font-black">{text(row.invite_code) || "уже использован"}</p>
          {!row.telegram_user_id ? <button type="button" disabled={busy} onClick={() => act("renew_invite", { id: row.id })} className="mt-2 text-xs font-black text-[#087bd3] underline underline-offset-4">Выпустить новый код</button> : null}
        </div>
      </div>
      <Area label="Цели ученика" value={values.goals} onChange={(value) => update("goals", value)} placeholder="Зачем ему английский и к какому результату идём" />
      <Area label="Слабые места" value={values.weak_points} onChange={(value) => update("weak_points", value)} placeholder="Паузы, страх ошибки, времена, словарный запас…" />
      <Area label="Личные заметки Криса" value={values.teacher_notes} onChange={(value) => update("teacher_notes", value)} placeholder="Ученик этого не видит" />
      <div className="flex flex-wrap gap-3">
        <Primary disabled={busy} onClick={() => act("save_student", { id: row.id, values })}>Сохранить карточку</Primary>
        {row.status === "pending" ? <Secondary disabled={busy} onClick={() => act("approve_student", { id: row.id })}>Подтвердить ученика</Secondary> : null}
      </div>
      <div className="mt-2 grid gap-3 rounded-2xl border border-[#172033]/8 bg-[#f6f2ea] p-4 md:grid-cols-[1fr_auto] md:items-end">
        <Select label="Назначить конкретное задание" value={templateId} onChange={setTemplateId} options={[["", "Выберите из библиотеки"], ...templates.filter((item) => item.active).map((item) => [text(item.id), text(item.title_ru)])]} />
        <Secondary disabled={busy || !templateId} onClick={() => act("assign_task", { student_id: row.id, template_id: templateId })}>Назначить</Secondary>
      </div>
    </Panel>
  );
}

function Review({ rows, token, busy, act }: { rows: Row[]; token: string; busy: boolean; act: Action }) {
  if (!rows.length) return <Panel title="Проверка голосовых" note="Новых записей пока нет."><Empty>Когда ученик пришлёт голосовое, оно появится здесь.</Empty></Panel>;
  return (
    <div className="grid gap-4">
      {rows.map((row) => <Submission key={text(row.id)} row={row} token={token} busy={busy} act={act} />)}
    </div>
  );
}

function Submission({ row, token, busy, act }: { row: Row; token: string; busy: boolean; act: Action }) {
  const [feedback, setFeedback] = useState(text(row.teacher_feedback));
  return (
    <article className={`rounded-[22px] border bg-white/75 p-5 shadow-sm ${row.status === "pending" ? "border-[#f3a51d]/50" : "border-white"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black">{text(row.real_name)}</p>
          <p className="mt-1 text-sm font-bold text-[#087bd3]">{text(row.title_ru) || "Свободная практика"}</p>
          <p className="mt-1 text-xs font-bold text-[#42506a]">{formatDate(row.created_at)}</p>
        </div>
        <Status value={text(row.status)} />
      </div>
      {row.audio_url ? <audio controls preload="none" src={`/api/admin/bot/audio?id=${encodeURIComponent(text(row.id))}&token=${encodeURIComponent(token)}`} className="mt-4 w-full" /> : <p className="mt-4 rounded-xl bg-[#f6f2ea] p-3 text-sm font-bold text-[#42506a]">Файл остался в Telegram и не скачан локально.</p>}
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <Area label="Комментарий Криса" value={feedback} onChange={setFeedback} placeholder="Одна сильная сторона, одна главная поправка и следующая попытка" />
        <Primary disabled={busy || !feedback.trim()} onClick={() => act("review_submission", { id: row.id, feedback })}>Отправить ученику</Primary>
      </div>
      <p className="mt-3 text-xs font-bold text-[#42506a]">AI: {text(row.ai_status)} · поле уже подготовлено для будущей расшифровки и анализа.</p>
    </article>
  );
}

function Calendar({ rows, busy, act }: { rows: Row[]; busy: boolean; act: Action }) {
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [repeats, setRepeats] = useState("1");
  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <Panel title="Открыть свободное окно" note="Можно сразу повторить это время на несколько недель.">
        <label className="grid gap-2 text-sm font-bold text-[#42506a]">Дата и время<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={inputClass} /></label>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Минут" value={duration} onChange={setDuration} type="number" />
          <Field label="Недель подряд" value={repeats} onChange={setRepeats} type="number" />
        </div>
        <Select label="Формат урока" value={mode} onChange={setMode} options={[["online", "Онлайн"], ["offline", "Очно"]]} />
        {mode === "offline" ? <Field label="Адрес или место" value={location} onChange={setLocation} /> : null}
        <Primary disabled={busy || !startsAt} onClick={() => act("create_slots", { starts_at: new Date(startsAt).toISOString(), duration_minutes: duration, repeats, lesson_mode: mode, location })}>Добавить в календарь</Primary>
      </Panel>
      <Panel title="Ближайшие окна" note="Ученики видят только свободные варианты.">
        <div className="grid gap-2">
          {rows.length ? rows.map((row) => (
            <div key={text(row.id)} className="flex flex-col gap-3 rounded-2xl border border-[#172033]/8 bg-[#f6f2ea] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black">{formatDate(row.starts_at)} — {timeOnly(row.ends_at)}</p>
                <p className="mt-1 text-sm font-bold text-[#42506a]">{row.lesson_mode === "offline" ? `Очно${row.location ? ` · ${text(row.location)}` : ""}` : "Онлайн"}{row.student_name ? ` · ${text(row.student_name)}` : ""}</p>
              </div>
              <div className="flex items-center gap-3"><Status value={text(row.status)} />{row.status === "available" ? <button type="button" disabled={busy} onClick={() => act("cancel_slot", { id: row.id })} className="text-xs font-black text-red-700">Закрыть</button> : null}</div>
            </div>
          )) : <Empty>Добавьте первое свободное окно.</Empty>}
        </div>
      </Panel>
    </div>
  );
}

function Tasks({ rows, busy, act }: { rows: Row[]; busy: boolean; act: Action }) {
  return (
    <Panel title={`Библиотека · ${rows.length} заданий`} note="Бот выдаёт активные задания по порядку. Они тренируют объяснение мысли, а не перевод.">
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <article key={text(row.id)} className={`rounded-2xl border p-4 ${row.active ? "border-[#087bd3]/14 bg-[#f6f2ea]" : "border-[#172033]/8 bg-[#172033]/4 opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-black">{text(row.title_ru)}</p><p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#087bd3]">{text(row.category)} · {text(row.difficulty)}</p></div>
              <button type="button" disabled={busy} onClick={() => act("toggle_template", { id: row.id })} className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#42506a]">{row.active ? "Включено" : "Выключено"}</button>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#42506a]">{text(row.prompt_ru)}</p>
            <p className="mt-3 text-xs font-bold text-[#9b5f08]">Выполнено: {text(row.completed_count)} · назначено: {text(row.assigned_count)}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

type Action = (action: string, payload?: Record<string, unknown>) => Promise<boolean>;

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return <section className="rounded-[22px] border border-white/80 bg-white/75 p-5 shadow-[0_16px_44px_rgba(31,45,70,0.07)]"><h3 className="text-xl font-black">{title}</h3>{note ? <p className="mt-1 text-sm font-semibold leading-6 text-[#42506a]">{note}</p> : null}<div className="mt-5 grid gap-4">{children}</div></section>;
}

function DarkMetric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return <div className={`min-w-20 rounded-2xl px-3 py-3 ${accent ? "bg-[#f3a51d] text-[#172033]" : "bg-white/8"}`}><p className="text-2xl font-black">{value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] opacity-65">{label}</p></div>;
}

const inputClass = "w-full rounded-xl border border-[#172033]/12 bg-white px-4 py-3 text-[#172033] outline-none transition focus:border-[#087bd3]";
function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) { return <label className="grid gap-2 text-sm font-bold text-[#42506a]">{label}<input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>; }
function Area({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="grid gap-2 text-sm font-bold text-[#42506a]">{label}<textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`${inputClass} min-h-28 resize-y`} /></label>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="grid gap-2 text-sm font-bold text-[#42506a]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>; }
function Primary({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) { return <button type="button" disabled={disabled} onClick={onClick} className="min-h-12 rounded-xl bg-[#f3a51d] px-5 py-3 text-sm font-black text-[#172033] transition hover:bg-[#e69810] disabled:opacity-45">{children}</button>; }
function Secondary({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) { return <button type="button" disabled={disabled} onClick={onClick} className="min-h-12 rounded-xl border border-[#087bd3]/20 bg-white px-5 py-3 text-sm font-black text-[#087bd3] transition hover:border-[#087bd3] disabled:opacity-45">{children}</button>; }
function Empty({ children }: { children: React.ReactNode }) { return <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-[#087bd3]/20 bg-[#087bd3]/4 px-5 text-center text-sm font-bold text-[#42506a]">{children}</div>; }
function Status({ value }: { value: string }) { const names: Record<string, string> = { pending: "Ожидает", active: "Активен", paused: "Пауза", archived: "Архив", reviewed: "Проверено", available: "Свободно", booked: "Занято", cancelled: "Закрыто" }; return <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${value === "pending" ? "bg-[#f3a51d]/18 text-[#9b5f08]" : value === "active" || value === "available" || value === "reviewed" ? "bg-emerald-100 text-emerald-800" : "bg-[#172033]/8 text-[#42506a]"}`}>{names[value] || value}</span>; }
function text(value: unknown) { return value == null ? "" : String(value); }
function formatDate(value: unknown) { const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? text(value) : date.toLocaleString("ru-RU", { timeZone: "Europe/Moscow", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
function timeOnly(value: unknown) { const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? text(value) : date.toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit" }); }
