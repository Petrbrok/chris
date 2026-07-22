"use client";

import { useEffect, useMemo, useState } from "react";

type Row = Record<string, unknown>;
type Section = "students" | "review" | "calendar" | "tasks";
export type AdminLang = "ru" | "en";

const adminText = {
  ru: {
    sections: ["Ученики", "Проверка голосовых", "Расписание", "Задания"],
    loading: "Загрузка…",
    loadError: "Не удалось загрузить данные",
    saved: "Сохранено",
    error: "Ошибка",
    eyebrow: "Управление обучением",
    title: "Ученики, практика и уроки",
    intro:
      "Числовой идентификатор в мессенджере определяет ученика. Имя, цели и заметки видит только Крис.",
    studentsMetric: "учеников",
    pendingMetric: "ждут проверки",
    slotsMetric: "окон",
    addStudent: "Добавить действующего ученика",
    addNote: "После создания передайте ему персональный код.",
    name: "Имя",
    knownAs: "Как Крис его знает",
    optionalPhone: "Телефон — необязательно",
    createCode: "Создать и получить код",
    allStudents: "Все ученики",
    search: "Поиск",
    searchHint: "Имя или имя в мессенджере",
    notLinked: "Учётная запись в мессенджере ещё не привязана",
    tasksDone: "заданий",
    recordings: "голосовых",
    studentCard: "Карточка ученика",
    cardNote:
      "Выберите ученика слева. Здесь Крис может вести цели, слабые места и личные заметки.",
    noCard: "Карточка пока не выбрана",
    student: "Ученик",
    privateCard: "Закрытая карточка Криса",
    realName: "Настоящее имя",
    phone: "Телефон",
    status: "Статус",
    botLanguage: "Язык помощника",
    level: "Уровень",
    inviteCode: "Персональный код",
    codeUsed: "уже использован",
    renewCode: "Выпустить новый код",
    goals: "Цели ученика",
    goalsHint: "Зачем ему английский и к какому результату идём",
    weak: "Слабые места",
    weakHint: "Паузы, страх ошибки, времена, словарный запас…",
    notes: "Личные заметки Криса",
    notesHint: "Ученик этого не видит",
    saveCard: "Сохранить карточку",
    approve: "Подтвердить ученика",
    assignTask: "Назначить конкретное задание",
    chooseLibrary: "Выберите из библиотеки",
    assign: "Назначить",
    review: "Проверка голосовых",
    noReviews: "Новых записей пока нет.",
    reviewHint: "Когда ученик пришлёт голосовое, оно появится здесь.",
    freePractice: "Свободная практика",
    missingAudio: "Файл остался в мессенджере и не скачан.",
    feedback: "Комментарий Криса",
    feedbackHint:
      "Одна сильная сторона, одна главная поправка и следующая попытка",
    sendStudent: "Отправить ученику",
    analysisNote: "Поле подготовлено для будущей расшифровки и разбора речи.",
    openSlot: "Открыть свободное окно",
    repeatNote: "Можно сразу повторить это время на несколько недель.",
    dateTime: "Дата и время",
    minutes: "Минут",
    weeks: "Недель подряд",
    lessonMode: "Формат урока",
    online: "Дистанционно",
    offline: "Очно",
    location: "Адрес или место",
    addCalendar: "Добавить в расписание",
    upcoming: "Ближайшие окна",
    studentsSeeFree: "Ученики видят только свободные варианты.",
    close: "Закрыть",
    firstSlot: "Добавьте первое свободное окно.",
    library: "Библиотека",
    libraryNote:
      "Помощник выдаёт активные задания по порядку. Они тренируют объяснение мысли, а не перевод.",
    enabled: "Включено",
    disabled: "Выключено",
    completed: "Выполнено",
    assigned: "назначено",
  },
  en: {
    sections: ["Students", "Voice review", "Schedule", "Assignments"],
    loading: "Loading…",
    loadError: "Could not load data",
    saved: "Saved",
    error: "Error",
    eyebrow: "Learning management",
    title: "Students, practice, and lessons",
    intro:
      "A Telegram numeric identifier links each student. Only Chris can see names, goals, and private notes.",
    studentsMetric: "students",
    pendingMetric: "awaiting review",
    slotsMetric: "slots",
    addStudent: "Add an existing student",
    addNote: "After creating the student, send them their personal code.",
    name: "Name",
    knownAs: "Name Chris knows",
    optionalPhone: "Phone — optional",
    createCode: "Create and get code",
    allStudents: "All students",
    search: "Search",
    searchHint: "Name or Telegram username",
    notLinked: "Telegram is not linked yet",
    tasksDone: "assignments",
    recordings: "recordings",
    studentCard: "Student record",
    cardNote:
      "Select a student on the left. Chris can keep goals, weak points, and private notes here.",
    noCard: "No student selected",
    student: "Student",
    privateCard: "Chris's private record",
    realName: "Real name",
    phone: "Phone",
    status: "Status",
    botLanguage: "Bot language",
    level: "Level",
    inviteCode: "Personal code",
    codeUsed: "already used",
    renewCode: "Issue a new code",
    goals: "Student goals",
    goalsHint: "Why they need English and what result they are working toward",
    weak: "Weak points",
    weakHint: "Pauses, fear of mistakes, tenses, vocabulary…",
    notes: "Chris's private notes",
    notesHint: "The student cannot see these notes",
    saveCard: "Save record",
    approve: "Approve student",
    assignTask: "Assign a specific task",
    chooseLibrary: "Choose from the library",
    assign: "Assign",
    review: "Voice review",
    noReviews: "There are no new recordings.",
    reviewHint: "New student recordings will appear here.",
    freePractice: "Free practice",
    missingAudio: "The file remains in Telegram and was not downloaded.",
    feedback: "Chris's feedback",
    feedbackHint: "One strength, one main correction, and the next attempt",
    sendStudent: "Send to student",
    analysisNote:
      "This field is reserved for future transcription and speech analysis.",
    openSlot: "Open an available slot",
    repeatNote: "You can repeat this time for several weeks.",
    dateTime: "Date and time",
    minutes: "Minutes",
    weeks: "Consecutive weeks",
    lessonMode: "Lesson format",
    online: "Online",
    offline: "In person",
    location: "Address or place",
    addCalendar: "Add to schedule",
    upcoming: "Upcoming slots",
    studentsSeeFree: "Students only see available options.",
    close: "Close",
    firstSlot: "Add the first available slot.",
    library: "Library",
    libraryNote:
      "The bot gives active assignments in order. They train students to explain ideas rather than translate.",
    enabled: "Enabled",
    disabled: "Disabled",
    completed: "Completed",
    assigned: "assigned",
  },
} as const;

export default function BotAdmin({
  token,
  lang,
}: {
  token: string;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  const sections: Array<{ key: Section; label: string }> = (
    ["students", "review", "calendar", "tasks"] as Section[]
  ).map((key, index) => ({ key, label: c.sections[index] }));
  const [section, setSection] = useState<Section>("students");
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [status, setStatus] = useState<string>(c.loading);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    const response = await fetch("/api/admin/bot", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(c.loadError);
      return;
    }
    setData(body);
    setStatus("");
  }

  async function act(action: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    const response = await fetch("/api/admin/bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    });
    await response.json();
    setBusy(false);
    setStatus(response.ok ? c.saved : c.error);
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
          setStatus(c.loadError);
          return;
        }
        setData(body);
        setStatus("");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError")
          setStatus(c.loadError);
      });
    return () => controller.abort();
  }, [token, c.loadError]);

  const students = data.students || [];
  const submissions = data.submissions || [];
  const slots = data.slots || [];
  const templates = data.templates || [];
  const pending = submissions.filter(
    (item) => item.status === "pending",
  ).length;

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[24px] border border-[#087bd3]/10 bg-[#172033] text-white shadow-[0_22px_60px_rgba(23,32,51,0.16)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a51d]">
              {c.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              {c.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/65">
              {c.intro}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <DarkMetric label={c.studentsMetric} value={students.length} />
            <DarkMetric label={c.pendingMetric} value={pending} accent />
            <DarkMetric
              label={c.slotsMetric}
              value={slots.filter((item) => item.status === "available").length}
            />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 pt-3">
          {sections.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSection(item.key)}
              className={`whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-black transition ${
                section === item.key
                  ? "bg-[#f6f2ea] text-[#172033]"
                  : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.label}
              {item.key === "review" && pending ? ` · ${pending}` : ""}
            </button>
          ))}
        </nav>
      </section>

      {status ? (
        <p className="rounded-xl bg-[#087bd3]/8 px-4 py-3 text-sm font-bold text-[#087bd3]">
          {status}
        </p>
      ) : null}

      {section === "students" ? (
        <Students
          rows={students}
          templates={templates}
          busy={busy}
          act={act}
          lang={lang}
        />
      ) : null}
      {section === "review" ? (
        <Review
          rows={submissions}
          token={token}
          busy={busy}
          act={act}
          lang={lang}
        />
      ) : null}
      {section === "calendar" ? (
        <Calendar rows={slots} busy={busy} act={act} lang={lang} />
      ) : null}
      {section === "tasks" ? (
        <Tasks rows={templates} busy={busy} act={act} lang={lang} />
      ) : null}
    </div>
  );
}

function Students({
  rows,
  templates,
  busy,
  act,
  lang,
}: {
  rows: Row[];
  templates: Row[];
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const selected = rows.find((row) => Number(row.id) === selectedId) || null;
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        `${text(row.real_name)} ${text(row.telegram_username)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  async function createStudent() {
    if (await act("create_student", { real_name: newName, phone: newPhone })) {
      setNewName("");
      setNewPhone("");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="grid h-fit gap-4">
        <Panel title={c.addStudent} note={c.addNote}>
          <Field
            label={c.name}
            value={newName}
            onChange={setNewName}
            placeholder={c.knownAs}
          />
          <Field
            label={c.optionalPhone}
            value={newPhone}
            onChange={setNewPhone}
            placeholder="+7…"
          />
          <Primary disabled={busy || !newName.trim()} onClick={createStudent}>
            {c.createCode}
          </Primary>
        </Panel>
        <Panel title={c.allStudents}>
          <Field
            label={c.search}
            value={query}
            onChange={setQuery}
            placeholder={c.searchHint}
          />
          <div className="grid max-h-[620px] gap-2 overflow-y-auto pr-1">
            {filtered.map((row) => (
              <button
                key={text(row.id)}
                type="button"
                onClick={() => setSelectedId(Number(row.id))}
                className={`rounded-2xl border p-4 text-left transition ${selectedId === Number(row.id) ? "border-[#087bd3] bg-[#087bd3]/6" : "border-[#172033]/8 bg-[#f6f2ea] hover:border-[#087bd3]/35"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{text(row.real_name)}</p>
                    <p className="mt-1 text-xs font-bold text-[#42506a]">
                      {row.telegram_user_id
                        ? `${lang === "ru" ? "Идентификатор" : "Identifier"} ${text(row.telegram_user_id)}`
                        : c.notLinked}
                    </p>
                  </div>
                  <Status value={text(row.status)} lang={lang} />
                </div>
                <p className="mt-3 text-xs font-bold text-[#087bd3]">
                  {text(row.completed_count)} {c.tasksDone} ·{" "}
                  {text(row.recordings_count)} {c.recordings}
                </p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {selected ? (
        <StudentCard
          key={text(selected.id)}
          row={selected}
          templates={templates}
          busy={busy}
          act={act}
          lang={lang}
        />
      ) : (
        <Panel title={c.studentCard} note={c.cardNote}>
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#087bd3]/25 bg-[#087bd3]/4 px-6 text-center font-bold text-[#42506a]">
            {c.noCard}
          </div>
        </Panel>
      )}
    </div>
  );
}

function StudentCard({
  row,
  templates,
  busy,
  act,
  lang,
}: {
  row: Row;
  templates: Row[];
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  const [values, setValues] = useState({
    real_name: text(row.real_name),
    phone: text(row.phone),
    status: text(row.status),
    language: text(row.language),
    level: text(row.level),
    goals: text(row.goals),
    weak_points: text(row.weak_points),
    teacher_notes: text(row.teacher_notes),
  });
  const [templateId, setTemplateId] = useState("");
  const update = (key: keyof typeof values, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <Panel
      title={values.real_name || c.student}
      note={
        row.telegram_username
          ? `@${text(row.telegram_username)}`
          : c.privateCard
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label={c.realName}
          value={values.real_name}
          onChange={(value) => update("real_name", value)}
        />
        <Field
          label={c.phone}
          value={values.phone}
          onChange={(value) => update("phone", value)}
        />
        <Select
          label={c.status}
          value={values.status}
          onChange={(value) => update("status", value)}
          options={statusOptions(lang)}
        />
        <Select
          label={c.botLanguage}
          value={values.language}
          onChange={(value) => update("language", value)}
          options={[
            ["ru", lang === "ru" ? "Русский" : "Russian"],
            ["en", lang === "ru" ? "Английский" : "English"],
          ]}
        />
        <Field
          label={c.level}
          value={values.level}
          onChange={(value) => update("level", value)}
          placeholder="A2, B1…"
        />
        <div className="rounded-2xl bg-[#f3a51d]/12 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9b5f08]">
            {c.inviteCode}
          </p>
          <p className="mt-2 font-mono text-lg font-black">
            {text(row.invite_code) || c.codeUsed}
          </p>
          {!row.telegram_user_id ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => act("renew_invite", { id: row.id })}
              className="mt-2 text-xs font-black text-[#087bd3] underline underline-offset-4"
            >
              {c.renewCode}
            </button>
          ) : null}
        </div>
      </div>
      <Area
        label={c.goals}
        value={values.goals}
        onChange={(value) => update("goals", value)}
        placeholder={c.goalsHint}
      />
      <Area
        label={c.weak}
        value={values.weak_points}
        onChange={(value) => update("weak_points", value)}
        placeholder={c.weakHint}
      />
      <Area
        label={c.notes}
        value={values.teacher_notes}
        onChange={(value) => update("teacher_notes", value)}
        placeholder={c.notesHint}
      />
      <div className="flex flex-wrap gap-3">
        <Primary
          disabled={busy}
          onClick={() => act("save_student", { id: row.id, values })}
        >
          {c.saveCard}
        </Primary>
        {row.status === "pending" ? (
          <Secondary
            disabled={busy}
            onClick={() => act("approve_student", { id: row.id })}
          >
            {c.approve}
          </Secondary>
        ) : null}
      </div>
      <div className="mt-2 grid gap-3 rounded-2xl border border-[#172033]/8 bg-[#f6f2ea] p-4 md:grid-cols-[1fr_auto] md:items-end">
        <Select
          label={c.assignTask}
          value={templateId}
          onChange={setTemplateId}
          options={[
            ["", c.chooseLibrary],
            ...templates
              .filter((item) => item.active)
              .map((item) => [
                text(item.id),
                text(lang === "ru" ? item.title_ru : item.title_en),
              ]),
          ]}
        />
        <Secondary
          disabled={busy || !templateId}
          onClick={() =>
            act("assign_task", { student_id: row.id, template_id: templateId })
          }
        >
          {c.assign}
        </Secondary>
      </div>
    </Panel>
  );
}

function Review({
  rows,
  token,
  busy,
  act,
  lang,
}: {
  rows: Row[];
  token: string;
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  if (!rows.length)
    return (
      <Panel title={c.review} note={c.noReviews}>
        <Empty>{c.reviewHint}</Empty>
      </Panel>
    );
  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <Submission
          key={text(row.id)}
          row={row}
          token={token}
          busy={busy}
          act={act}
          lang={lang}
        />
      ))}
    </div>
  );
}

function Submission({
  row,
  token,
  busy,
  act,
  lang,
}: {
  row: Row;
  token: string;
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  const [feedback, setFeedback] = useState(text(row.teacher_feedback));
  return (
    <article
      className={`rounded-[22px] border bg-white/75 p-5 shadow-sm ${row.status === "pending" ? "border-[#f3a51d]/50" : "border-white"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black">{text(row.real_name)}</p>
          <p className="mt-1 text-sm font-bold text-[#087bd3]">
            {text(lang === "ru" ? row.title_ru : row.title_en) ||
              c.freePractice}
          </p>
          <p className="mt-1 text-xs font-bold text-[#42506a]">
            {formatDate(row.created_at, lang)}
          </p>
        </div>
        <Status value={text(row.status)} lang={lang} />
      </div>
      {row.audio_url ? (
        <audio
          controls
          preload="none"
          src={`/api/admin/bot/audio?id=${encodeURIComponent(text(row.id))}&token=${encodeURIComponent(token)}`}
          className="mt-4 w-full"
        />
      ) : (
        <p className="mt-4 rounded-xl bg-[#f6f2ea] p-3 text-sm font-bold text-[#42506a]">
          {c.missingAudio}
        </p>
      )}
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <Area
          label={c.feedback}
          value={feedback}
          onChange={setFeedback}
          placeholder={c.feedbackHint}
        />
        <Primary
          disabled={busy || !feedback.trim()}
          onClick={() => act("review_submission", { id: row.id, feedback })}
        >
          {c.sendStudent}
        </Primary>
      </div>
      <p className="mt-3 text-xs font-bold text-[#42506a]">
        {lang === "ru" ? "Автоматический разбор" : "Automated analysis"}:{" "}
        {translateAiStatus(text(row.ai_status), lang)} · {c.analysisNote}
      </p>
    </article>
  );
}

function Calendar({
  rows,
  busy,
  act,
  lang,
}: {
  rows: Row[];
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [repeats, setRepeats] = useState("1");
  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <Panel title={c.openSlot} note={c.repeatNote}>
        <label className="grid gap-2 text-sm font-bold text-[#42506a]">
          {c.dateTime}
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={c.minutes}
            value={duration}
            onChange={setDuration}
            type="number"
          />
          <Field
            label={c.weeks}
            value={repeats}
            onChange={setRepeats}
            type="number"
          />
        </div>
        <Select
          label={c.lessonMode}
          value={mode}
          onChange={setMode}
          options={[
            ["online", c.online],
            ["offline", c.offline],
          ]}
        />
        {mode === "offline" ? (
          <Field label={c.location} value={location} onChange={setLocation} />
        ) : null}
        <Primary
          disabled={busy || !startsAt}
          onClick={() =>
            act("create_slots", {
              starts_at: new Date(startsAt).toISOString(),
              duration_minutes: duration,
              repeats,
              lesson_mode: mode,
              location,
            })
          }
        >
          {c.addCalendar}
        </Primary>
      </Panel>
      <Panel title={c.upcoming} note={c.studentsSeeFree}>
        <div className="grid gap-2">
          {rows.length ? (
            rows.map((row) => (
              <div
                key={text(row.id)}
                className="flex flex-col gap-3 rounded-2xl border border-[#172033]/8 bg-[#f6f2ea] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black">
                    {formatDate(row.starts_at, lang)} —{" "}
                    {timeOnly(row.ends_at, lang)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#42506a]">
                    {row.lesson_mode === "offline"
                      ? `${c.offline}${row.location ? ` · ${text(row.location)}` : ""}`
                      : c.online}
                    {row.student_name ? ` · ${text(row.student_name)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Status value={text(row.status)} lang={lang} />
                  {row.status === "available" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => act("cancel_slot", { id: row.id })}
                      className="text-xs font-black text-red-700"
                    >
                      {c.close}
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <Empty>{c.firstSlot}</Empty>
          )}
        </div>
      </Panel>
    </div>
  );
}

function Tasks({
  rows,
  busy,
  act,
  lang,
}: {
  rows: Row[];
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = adminText[lang];
  return (
    <Panel title={`${c.library} · ${rows.length}`} note={c.libraryNote}>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <article
            key={text(row.id)}
            className={`rounded-2xl border p-4 ${row.active ? "border-[#087bd3]/14 bg-[#f6f2ea]" : "border-[#172033]/8 bg-[#172033]/4 opacity-60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">
                  {text(lang === "ru" ? row.title_ru : row.title_en)}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#087bd3]">
                  {translateTaskMeta(text(row.category), lang)} ·{" "}
                  {translateTaskMeta(text(row.difficulty), lang)}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => act("toggle_template", { id: row.id })}
                className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#42506a]"
              >
                {row.active ? c.enabled : c.disabled}
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#42506a]">
              {text(lang === "ru" ? row.prompt_ru : row.prompt_en)}
            </p>
            <p className="mt-3 text-xs font-bold text-[#9b5f08]">
              {c.completed}: {text(row.completed_count)} · {c.assigned}:{" "}
              {text(row.assigned_count)}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

type Action = (
  action: string,
  payload?: Record<string, unknown>,
) => Promise<boolean>;

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-white/80 bg-white/75 p-5 shadow-[0_16px_44px_rgba(31,45,70,0.07)]">
      <h3 className="text-xl font-black">{title}</h3>
      {note ? (
        <p className="mt-1 text-sm font-semibold leading-6 text-[#42506a]">
          {note}
        </p>
      ) : null}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function DarkMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-20 rounded-2xl px-3 py-3 ${accent ? "bg-[#f3a51d] text-[#172033]" : "bg-white/8"}`}
    >
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] opacity-65">
        {label}
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#172033]/12 bg-white px-4 py-3 text-[#172033] outline-none transition focus:border-[#087bd3]";
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#42506a]">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}
function Area({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#42506a]">
      {label}
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} min-h-28 resize-y`}
      />
    </label>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#42506a]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
function Primary({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-12 rounded-xl bg-[#f3a51d] px-5 py-3 text-sm font-black text-[#172033] transition hover:bg-[#e69810] disabled:opacity-45"
    >
      {children}
    </button>
  );
}
function Secondary({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-12 rounded-xl border border-[#087bd3]/20 bg-white px-5 py-3 text-sm font-black text-[#087bd3] transition hover:border-[#087bd3] disabled:opacity-45"
    >
      {children}
    </button>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-[#087bd3]/20 bg-[#087bd3]/4 px-5 text-center text-sm font-bold text-[#42506a]">
      {children}
    </div>
  );
}
function Status({ value, lang }: { value: string; lang: AdminLang }) {
  const names = statusNames[lang];
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-black ${value === "pending" ? "bg-[#f3a51d]/18 text-[#9b5f08]" : value === "active" || value === "available" || value === "reviewed" ? "bg-emerald-100 text-emerald-800" : "bg-[#172033]/8 text-[#42506a]"}`}
    >
      {names[value] || value}
    </span>
  );
}
function text(value: unknown) {
  return value == null ? "" : String(value);
}
const statusNames: Record<AdminLang, Record<string, string>> = {
  ru: {
    pending: "Ожидает",
    active: "Активен",
    paused: "Приостановлен",
    archived: "В архиве",
    reviewed: "Проверено",
    available: "Свободно",
    booked: "Занято",
    cancelled: "Закрыто",
  },
  en: {
    pending: "Pending",
    active: "Active",
    paused: "Paused",
    archived: "Archived",
    reviewed: "Reviewed",
    available: "Available",
    booked: "Booked",
    cancelled: "Closed",
  },
};
function statusOptions(lang: AdminLang): string[][] {
  return ["pending", "active", "paused", "archived"].map((value) => [
    value,
    statusNames[lang][value],
  ]);
}
function translateAiStatus(value: string, lang: AdminLang) {
  const names: Record<string, [string, string]> = {
    disabled: ["отключён", "disabled"],
    queued: ["в очереди", "queued"],
    processing: ["обрабатывается", "processing"],
    ready: ["готов", "ready"],
    failed: ["ошибка", "failed"],
  };
  return names[value]?.[lang === "ru" ? 0 : 1] || value;
}
function translateTaskMeta(value: string, lang: AdminLang) {
  if (lang === "en") return value;
  const names: Record<string, string> = {
    explain: "объяснение",
    reflex: "быстрый ответ",
    rescue: "выход из трудности",
    flexibility: "гибкость",
    story: "рассказ",
    opinion: "мнение",
    real_life: "жизненная ситуация",
    club: "разговорный клуб",
    summary: "пересказ",
    description: "описание",
    reflection: "самоанализ",
    beginner: "начальный",
    intermediate: "средний",
    any: "любой",
  };
  return names[value] || value;
}
function formatDate(value: unknown, lang: AdminLang) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? text(value)
    : date.toLocaleString(lang === "ru" ? "ru-RU" : "en-GB", {
        timeZone: "Europe/Moscow",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
}
function timeOnly(value: unknown, lang: AdminLang) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? text(value)
    : date.toLocaleTimeString(lang === "ru" ? "ru-RU" : "en-GB", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
      });
}
