import nextEnv from "@next/env";
import pg from "pg";
import { fetch as undiciFetch, ProxyAgent } from "undici";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";

const { loadEnvConfig } = nextEnv;
const { Pool } = pg;

loadEnvConfig(process.cwd());

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error(
    "TELEGRAM_BOT_TOKEN is not set. Add it to .env.local and restart the bot.",
  );
  process.exit(1);
}

const permanentAdminIds = [834148332, 1508442116];
const configuredAdminIds = (process.env.TELEGRAM_ADMIN_IDS || "")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Number.isSafeInteger);
const adminIds = new Set([...permanentAdminIds, ...configuredAdminIds]);
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5555"
).replace(/\/$/, "");
const apiUrl = `https://api.telegram.org/bot${token}`;
const fileUrl = `https://api.telegram.org/file/bot${token}`;
const telegramDispatcher = process.env.TELEGRAM_PROXY_URL
  ? new ProxyAgent(process.env.TELEGRAM_PROXY_URL)
  : undefined;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

let offset = 0;
let stopping = false;
const studentCommands = {
  ru: [
    { command: "start", description: "Запустить помощника" },
    { command: "menu", description: "Главное меню" },
    { command: "task", description: "Текущее задание" },
    { command: "progress", description: "Мой прогресс" },
    { command: "recordings", description: "Мои голосовые" },
    { command: "booking", description: "Записаться на урок" },
  ],
  en: [
    { command: "start", description: "Start the assistant" },
    { command: "menu", description: "Main menu" },
    { command: "task", description: "Current assignment" },
    { command: "progress", description: "My progress" },
    { command: "recordings", description: "My recordings" },
    { command: "booking", description: "Book a lesson" },
  ],
};
const adminCommands = {
  ru: [
    ...studentCommands.ru,
    { command: "admin", description: "Панель управления" },
    { command: "students", description: "Ученики" },
    { command: "reviews", description: "Проверка голосовых" },
    { command: "slots", description: "Расписание" },
    { command: "tasks", description: "Библиотека заданий" },
  ],
  en: [
    ...studentCommands.en,
    { command: "admin", description: "Admin panel" },
    { command: "students", description: "Students" },
    { command: "reviews", description: "Review recordings" },
    { command: "slots", description: "Schedule" },
    { command: "tasks", description: "Assignment library" },
  ],
};

const copy = {
  ru: {
    welcome:
      "Привет! Это разговорный тренажёр Chris Matoz. Здесь важно не говорить идеально, а уметь продолжить мысль на английском.",
    identify: "Вы уже занимаетесь с Крисом или пришли впервые?",
    existing: "Я уже ученик",
    newStudent: "Я новый ученик",
    code: "Введите персональный код, который дал вам Крис.",
    badCode:
      "Код не найден или уже использован. Проверьте его или выберите регистрацию нового ученика.",
    askName: "Как вас зовут в жизни? Это имя увидит только Крис.",
    askPhone:
      "Поделитесь номером телефона, чтобы Крис точно отличил вас от однофамильцев. Его не увидят другие ученики.",
    sharePhone: "Поделиться номером",
    skipPhone: "Продолжить без номера",
    pending:
      "Готово. Крис увидит вашу заявку и подтвердит профиль. Пока уже можно попробовать первое задание.",
    linked: "Профиль найден и привязан. Добро пожаловать!",
    menu: "Что сделаем сейчас?",
    task: "Задание",
    progress: "Мой прогресс",
    recordings: "Мои голосовые",
    booking: "Записаться",
    language: "Язык",
    sendVoice:
      "Запишите ответ голосовым сообщением. Не готовьте идеальную речь — начните говорить и объясняйте мысль.",
    voiceSaved:
      "Запись сохранена и отправлена Крису. После проверки здесь появится обратная связь.",
    noTask: "Вы уже выполнили все доступные задания. Крис скоро добавит новые.",
    noRecordings: "У вас пока нет сохранённых голосовых.",
    noSlots: "Свободных окон пока нет. Крис добавит их в календарь.",
    chooseSlot: "Выберите свободное окно. Время указано по Москве:",
    booked: "Запись подтверждена. Крис получил уведомление.",
    slotGone: "Это окно уже занято. Выберите другое.",
    back: "← Назад",
  },
  en: {
    welcome:
      "Hi! This is Chris Matoz's speaking trainer. The goal is not perfect English. The goal is to keep your thought moving.",
    identify: "Are you already Chris's student, or are you new here?",
    existing: "I am a student",
    newStudent: "I am new",
    code: "Enter the personal code Chris gave you.",
    badCode: "This code was not found or has already been used.",
    askName: "What is your real name? Only Chris will see it.",
    askPhone: "Share your phone number so Chris can identify you correctly.",
    sharePhone: "Share phone number",
    skipPhone: "Continue without phone",
    pending:
      "Done. Chris will review your profile. You can already try your first task.",
    linked: "Your profile is linked. Welcome!",
    menu: "What would you like to do?",
    task: "Task",
    progress: "My progress",
    recordings: "My recordings",
    booking: "Book a lesson",
    language: "Language",
    sendVoice:
      "Send your answer as a voice message. Do not prepare a perfect speech — start talking and explain your idea.",
    voiceSaved:
      "Your recording is saved and has been sent to Chris for review.",
    noTask: "You have completed all available tasks. Chris will add more soon.",
    noRecordings: "You do not have any recordings yet.",
    noSlots: "There are no available time slots yet.",
    chooseSlot: "Choose an available time. Times are shown in Moscow time:",
    booked: "Your lesson is booked. Chris has been notified.",
    slotGone: "This time is no longer available. Please choose another.",
    back: "← Back",
  },
};

const adminCopy = {
  ru: {
    panel: "Панель управления",
    students: "Ученики",
    awaitingApproval: "Ждут подтверждения",
    awaitingReview: "Голосовых на проверке",
    freeSlots: "Свободных окон",
    review: "Проверка",
    schedule: "Расписание",
    tasks: "Задания",
    addStudent: "Добавить ученика",
    openWeb: "Открыть панель на сайте",
    back: "← Назад",
    chooseStudent: "Выберите ученика.",
    empty: "Список пуст.",
    add: "Добавить",
    approve: "Подтвердить",
    assignTask: "Назначить задание",
    editCard: "Изменить карточку",
    status: "Статус",
    newCode: "Новый код",
    language: "Язык",
    level: "Уровень",
    phone: "Телефон",
    code: "Код",
    used: "использован",
    taskCount: "Заданий",
    voiceCount: "Голосовых",
    card: "Карточка ученика",
    whatEdit: "Что изменить?",
    fields: [
      "Имя",
      "Телефон",
      "Язык",
      "Уровень",
      "Цели",
      "Слабые места",
      "Личные заметки",
    ],
    statusNames: {
      pending: "Ожидает",
      active: "Активен",
      paused: "Приостановлен",
      archived: "В архиве",
    },
    chooseTask: "Выберите задание",
    practice: "Практика",
    chooseRecording: "Выберите запись.",
    noRecordings: "Новых записей нет.",
    feedbackFor: "Отзыв для",
    sendComment: "Отправьте комментарий одним сообщением.",
    addSlots: "Добавить окна",
    cancelHint: "Нажмите свободное окно для отмены.",
    noSlots: "Ближайших окон нет.",
    library: "Библиотека заданий",
    enabled: "включено",
    disabled: "выключено",
    turnOff: "Выключить",
    turnOn: "Включить",
    newStudent: "Новый ученик",
    sendName: "Отправьте имя.",
    newValue: "Отправьте новое значение.\n\nДля очистки поля: <code>-</code>",
    closeSlot: "Закрыть это свободное окно?",
    closeAction: "Закрыть",
    newSlots: "Новые окна",
    moscowDate: "Дата и время по Москве",
    lessonMode: "Формат урока",
    online: "Дистанционно",
    offline: "Очно",
    repeats: "Сколько еженедельных окон создать?",
    sendAddress: "Отправьте адрес очного урока.",
    noPhone: "Без телефона",
    sendPhone: "Отправьте телефон или нажмите «Без телефона».",
    invalidDate: "Неверная или прошедшая дата.",
    duration: "Длительность",
    minutes: "мин",
    created: "Ученик создан",
    openCard: "Открыть карточку",
  },
  en: {
    panel: "Admin panel",
    students: "Students",
    awaitingApproval: "Awaiting approval",
    awaitingReview: "Recordings awaiting review",
    freeSlots: "Available slots",
    review: "Review",
    schedule: "Schedule",
    tasks: "Assignments",
    addStudent: "Add student",
    openWeb: "Open web dashboard",
    back: "← Back",
    chooseStudent: "Choose a student.",
    empty: "The list is empty.",
    add: "Add",
    approve: "Approve",
    assignTask: "Assign task",
    editCard: "Edit record",
    status: "Status",
    newCode: "New code",
    language: "Language",
    level: "Level",
    phone: "Phone",
    code: "Code",
    used: "used",
    taskCount: "Assignments",
    voiceCount: "Recordings",
    card: "Student record",
    whatEdit: "What would you like to edit?",
    fields: [
      "Name",
      "Phone",
      "Language",
      "Level",
      "Goals",
      "Weak points",
      "Private notes",
    ],
    statusNames: {
      pending: "Pending",
      active: "Active",
      paused: "Paused",
      archived: "Archived",
    },
    chooseTask: "Choose an assignment",
    practice: "Practice",
    chooseRecording: "Choose a recording.",
    noRecordings: "There are no new recordings.",
    feedbackFor: "Feedback for",
    sendComment: "Send your feedback in one message.",
    addSlots: "Add slots",
    cancelHint: "Select an available slot to close it.",
    noSlots: "There are no upcoming slots.",
    library: "Assignment library",
    enabled: "enabled",
    disabled: "disabled",
    turnOff: "Disable",
    turnOn: "Enable",
    newStudent: "New student",
    sendName: "Send the student's name.",
    newValue: "Send the new value.\n\nTo clear the field, send: <code>-</code>",
    closeSlot: "Close this available slot?",
    closeAction: "Close",
    newSlots: "New slots",
    moscowDate: "Date and time in Moscow",
    lessonMode: "Lesson format",
    online: "Online",
    offline: "In person",
    repeats: "How many weekly slots should be created?",
    sendAddress: "Send the address for the in-person lesson.",
    noPhone: "No phone",
    sendPhone: "Send the phone number or choose ‘No phone’.",
    invalidDate: "The date is invalid or in the past.",
    duration: "Duration",
    minutes: "min",
    created: "Student created",
    openCard: "Open student record",
  },
};

async function adminLocale(chatId) {
  const student = await getStudent(chatId);
  return student?.language === "en" ? "en" : "ru";
}

async function telegram(method, body = {}) {
  const response = await undiciFetch(`${apiUrl}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    dispatcher: telegramDispatcher,
  });
  const result = await response.json();
  if (!result.ok)
    throw new Error(`${method}: ${result.description || response.status}`);
  return result.result;
}

function inlineKeyboard(rows) {
  return { reply_markup: { inline_keyboard: rows } };
}

async function send(chatId, text, extra = {}) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...extra,
  });
}

async function render(chatId, messageId, text, extra = {}) {
  if (!messageId) return send(chatId, text, extra);
  try {
    return await telegram("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      ...extra,
    });
  } catch (error) {
    if (error.message.includes("message is not modified")) return null;
    return send(chatId, text, extra);
  }
}

function isAdmin(telegramId) {
  return adminIds.has(Number(telegramId));
}

async function getStudent(telegramId) {
  const result = await pool.query(
    "select * from bot_students where telegram_user_id = $1 limit 1",
    [telegramId],
  );
  return result.rows[0] || null;
}

async function touchStudent(user) {
  await pool.query(
    `update bot_students
     set telegram_username = $2, telegram_first_name = $3, last_seen_at = now(), updated_at = now()
     where telegram_user_id = $1`,
    [user.id, user.username || null, user.first_name || null],
  );
}

async function setSession(telegramId, state, payload = {}) {
  await pool.query(
    `insert into bot_sessions (telegram_user_id, state, payload)
     values ($1, $2, $3)
     on conflict (telegram_user_id) do update
     set state = excluded.state, payload = excluded.payload, updated_at = now()`,
    [telegramId, state, payload],
  );
}

async function getSession(telegramId) {
  const result = await pool.query(
    "select * from bot_sessions where telegram_user_id = $1",
    [telegramId],
  );
  return result.rows[0] || null;
}

async function clearSession(telegramId) {
  await pool.query("delete from bot_sessions where telegram_user_id = $1", [
    telegramId,
  ]);
}

function languageOf(student) {
  return student?.language === "en" ? "en" : "ru";
}

async function ensureAdminStudent(user) {
  const existing = await getStudent(user.id);
  if (existing || !isAdmin(user.id)) return existing;
  const result = await pool.query(
    `insert into bot_students
      (telegram_user_id, telegram_username, telegram_first_name, real_name, student_kind, status, is_admin_profile, last_seen_at)
     values ($1, $2, $3, $4, 'existing', 'active', true, now()) returning *`,
    [
      user.id,
      user.username || null,
      user.first_name || null,
      `${user.first_name || "Admin"} (админ)`,
    ],
  );
  return result.rows[0];
}

async function showStart(chatId, user, messageId = null) {
  const student = await ensureAdminStudent(user);
  if (student) {
    if (isAdmin(user.id))
      await configureAdminChat(user.id, languageOf(student)).catch(() => {});
    await touchStudent(user);
    await showMenu(chatId, student, messageId);
    return;
  }
  await render(
    chatId,
    messageId,
    `${copy.ru.welcome}\n\n${copy.ru.identify}`,
    inlineKeyboard([
      [{ text: copy.ru.existing, callback_data: "onboard:existing" }],
      [{ text: copy.ru.newStudent, callback_data: "onboard:new" }],
    ]),
  );
}

async function showMenu(chatId, student, messageId = null) {
  const lang = languageOf(student);
  const t = copy[lang];
  const rows = [
    [
      { text: `🎙 ${t.task}`, callback_data: "menu:task" },
      { text: `📈 ${t.progress}`, callback_data: "menu:progress" },
    ],
    [
      { text: `🎧 ${t.recordings}`, callback_data: "menu:recordings" },
      { text: `🗓 ${t.booking}`, callback_data: "menu:booking" },
    ],
    [{ text: `🌐 ${t.language}`, callback_data: "menu:language" }],
  ];
  if (isAdmin(student.telegram_user_id))
    rows.push([
      {
        text: lang === "en" ? "⚙️ Admin panel" : "⚙️ Управление",
        callback_data: "admin:home",
      },
    ]);
  await render(chatId, messageId, t.menu, inlineKeyboard(rows));
}

async function handleMessage(message) {
  if (!message.from || message.from.is_bot) return;
  const user = message.from;
  const chatId = message.chat.id;
  const text = message.text?.trim();

  if (text === "/start" || text === "/menu") {
    await clearSession(user.id);
    await showStart(chatId, user);
    return;
  }

  const student = await ensureAdminStudent(user);
  if (student) await touchStudent(user);
  const session = await getSession(user.id);

  if (
    isAdmin(user.id) &&
    text &&
    (await handleAdminCommand(chatId, user, student, text))
  )
    return;
  if (
    isAdmin(user.id) &&
    session?.state.startsWith("admin_") &&
    (await handleAdminInput(message, session))
  )
    return;

  if (text === "/task" && student) return showNextTask(chatId, student);
  if (text === "/progress" && student) return showProgress(chatId, student);
  if (text === "/recordings" && student) return showRecordings(chatId, student);
  if (text === "/booking" && student) return showSlots(chatId, student);

  if (message.voice && student) {
    await saveVoice(message, student, session);
    return;
  }

  if (session?.state === "existing_code" && text) {
    await linkExistingStudent(chatId, user, text);
    return;
  }

  if (session?.state === "new_name" && text) {
    await setSession(user.id, "new_phone", {
      realName: text.slice(0, 120),
      panelMessageId: session.payload.panelMessageId,
    });
    await askForPhone(chatId, "ru");
    return;
  }

  if (session?.state === "new_phone" && text === copy.ru.back) {
    await setSession(user.id, "new_name", {
      panelMessageId: session.payload.panelMessageId,
    });
    await render(
      chatId,
      session.payload.panelMessageId,
      copy.ru.askName,
      backButton("ru", "onboard:home"),
    );
    return;
  }

  if (session?.state === "new_phone" && (message.contact || text)) {
    await createNewStudent(
      chatId,
      user,
      session.payload.realName,
      message.contact?.phone_number || null,
    );
    return;
  }

  if (!student) {
    await showStart(chatId, user);
    return;
  }

  await showMenu(chatId, student);
}

async function askForPhone(chatId, lang) {
  const t = copy[lang];
  await send(chatId, t.askPhone, {
    reply_markup: {
      keyboard: [
        [{ text: t.sharePhone, request_contact: true }],
        [{ text: t.skipPhone }],
        [{ text: t.back }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

async function createNewStudent(chatId, user, realName, phone) {
  const session = await getSession(user.id);
  const result = await pool.query(
    `insert into bot_students
      (telegram_user_id, telegram_username, telegram_first_name, real_name, phone, student_kind, status, last_seen_at)
     values ($1, $2, $3, $4, $5, 'new', 'pending', now())
     on conflict (telegram_user_id) do update
     set telegram_username = excluded.telegram_username, telegram_first_name = excluded.telegram_first_name,
         real_name = excluded.real_name, phone = coalesce(excluded.phone, bot_students.phone), updated_at = now()
     returning *`,
    [user.id, user.username || null, user.first_name || null, realName, phone],
  );
  const student = result.rows[0];
  await clearSession(user.id);
  await pool.query(
    "insert into bot_student_events (student_id, event_type) values ($1, 'registered')",
    [student.id],
  );
  await send(chatId, copy.ru.pending, {
    reply_markup: { remove_keyboard: true },
  });
  await notifyAdmins(
    {
      ru: `🆕 <b>Новый ученик</b>\n${escapeHtml(realName)}${phone ? `\nТелефон: ${escapeHtml(phone)}` : ""}\nИдентификатор: <code>${user.id}</code>`,
      en: `🆕 <b>New student</b>\n${escapeHtml(realName)}${phone ? `\nPhone: ${escapeHtml(phone)}` : ""}\nIdentifier: <code>${user.id}</code>`,
    },
  );
  if (session?.payload.panelMessageId)
    await showMenu(chatId, student, session.payload.panelMessageId);
}

async function linkExistingStudent(chatId, user, rawCode) {
  const session = await getSession(user.id);
  const code = rawCode.toUpperCase().replace(/\s+/g, "");
  const result = await pool.query(
    `update bot_students
     set telegram_user_id = $1, telegram_username = $2, telegram_first_name = $3,
         invite_code = null, student_kind = 'existing', status = 'active', last_seen_at = now(), updated_at = now()
     where upper(invite_code) = $4 and telegram_user_id is null
     returning *`,
    [user.id, user.username || null, user.first_name || null, code],
  );
  if (!result.rowCount) {
    await render(
      chatId,
      session?.payload.panelMessageId,
      copy.ru.badCode,
      backButton("ru", "onboard:home"),
    );
    return;
  }
  await clearSession(user.id);
  await notifyAdmins(
    {
      ru: `✅ <b>Ученик привязал учётную запись</b>\n${escapeHtml(result.rows[0].real_name)}\nИдентификатор: <code>${user.id}</code>`,
      en: `✅ <b>Student linked their account</b>\n${escapeHtml(result.rows[0].real_name)}\nIdentifier: <code>${user.id}</code>`,
    },
  );
  await render(
    chatId,
    session?.payload.panelMessageId,
    copy.ru.linked,
    homeButton("ru"),
  );
}

async function handleCallback(callback) {
  const data = callback.data || "";
  const user = callback.from;
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;
  await telegram("answerCallbackQuery", {
    callback_query_id: callback.id,
  }).catch(() => {});
  if (!chatId) return;

  if (data === "onboard:existing") {
    await setSession(user.id, "existing_code", { panelMessageId: messageId });
    await render(
      chatId,
      messageId,
      copy.ru.code,
      backButton("ru", "onboard:home"),
    );
    return;
  }
  if (data === "onboard:new") {
    await setSession(user.id, "new_name", { panelMessageId: messageId });
    await render(
      chatId,
      messageId,
      copy.ru.askName,
      backButton("ru", "onboard:home"),
    );
    return;
  }

  if (data === "onboard:home") {
    await clearSession(user.id);
    return showStart(chatId, user, messageId);
  }

  const student = await ensureAdminStudent(user);
  if (!student) {
    await showStart(chatId, user, messageId);
    return;
  }
  const lang = languageOf(student);

  if (data.startsWith("admin:")) {
    if (!isAdmin(user.id))
      return telegram("answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Нет доступа",
        show_alert: true,
      }).catch(() => {});
    return handleAdminCallback(data, chatId, messageId, user);
  }

  if (data === "menu:task") return showNextTask(chatId, student, messageId);
  if (data === "menu:progress") return showProgress(chatId, student, messageId);
  if (data === "menu:recordings")
    return showRecordings(chatId, student, messageId);
  if (data === "menu:booking") return showSlots(chatId, student, messageId);
  if (data === "menu:language") {
    return render(
      chatId,
      messageId,
      "Выберите язык / Choose language",
      inlineKeyboard([
        [
          { text: "Русский", callback_data: "lang:ru" },
          { text: "English", callback_data: "lang:en" },
        ],
        [{ text: copy[lang].back, callback_data: "menu:home" }],
      ]),
    );
  }
  if (data.startsWith("lang:")) {
    const nextLang = data.endsWith("en") ? "en" : "ru";
    const result = await pool.query(
      "update bot_students set language = $2, updated_at = now() where id = $1 returning *",
      [student.id, nextLang],
    );
    if (isAdmin(user.id))
      await configureAdminChat(user.id, nextLang).catch(() => {});
    return showMenu(chatId, result.rows[0], messageId);
  }
  if (data.startsWith("book:"))
    return bookSlot(chatId, student, Number(data.slice(5)), lang, messageId);
  if (data === "menu:home") {
    await clearSession(user.id);
    return showMenu(chatId, student, messageId);
  }
}

async function showNextTask(chatId, student, messageId = null) {
  const lang = languageOf(student);
  let result = await pool.query(
    `select t.*, sa.id as student_assignment_id
     from bot_student_assignments sa
     join bot_assignment_templates t on t.id = sa.template_id
     where sa.student_id = $1 and sa.status = 'assigned' and t.active = true
     order by (sa.assigned_by = 'chris') desc, sa.created_at, sa.id limit 1`,
    [student.id],
  );
  if (!result.rowCount) {
    result = await pool.query(
      `select t.*
       from bot_assignment_templates t
       where t.active = true and not exists (
         select 1 from bot_student_assignments sa where sa.student_id = $1 and sa.template_id = t.id
       )
       order by t.sort_order, t.id limit 1`,
      [student.id],
    );
  }
  if (!result.rowCount) {
    await render(chatId, messageId, copy[lang].noTask, homeButton(lang));
    return;
  }
  const task = result.rows[0];
  const studentAssignmentId =
    task.student_assignment_id ||
    (
      await pool.query(
        `insert into bot_student_assignments (student_id, template_id)
     values ($1, $2) returning id`,
        [student.id, task.id],
      )
    ).rows[0].id;
  await setSession(student.telegram_user_id, "awaiting_voice", {
    studentAssignmentId,
    templateId: task.id,
  });
  const title = lang === "en" ? task.title_en : task.title_ru;
  const prompt = lang === "en" ? task.prompt_en : task.prompt_ru;
  await render(
    chatId,
    messageId,
    `🎙 <b>${escapeHtml(title)}</b>\n\n${escapeHtml(prompt)}\n\n${copy[lang].sendVoice}`,
    homeButton(lang),
  );
}

async function saveVoice(message, student, session) {
  let audioUrl = null;
  try {
    audioUrl = await downloadVoice(
      message.voice.file_id,
      message.voice.file_unique_id,
    );
  } catch (error) {
    console.error("Voice download failed:", error.message);
  }
  const studentAssignmentId =
    session?.state === "awaiting_voice"
      ? Number(session.payload.studentAssignmentId)
      : null;
  const result = await pool.query(
    `insert into bot_voice_submissions
      (student_id, student_assignment_id, telegram_file_id, telegram_file_unique_id, audio_url, duration_seconds)
     values ($1, $2, $3, $4, $5, $6) returning id`,
    [
      student.id,
      studentAssignmentId,
      message.voice.file_id,
      message.voice.file_unique_id,
      audioUrl,
      message.voice.duration || null,
    ],
  );
  if (studentAssignmentId) {
    await pool.query(
      "update bot_student_assignments set status = 'submitted', completed_at = now() where id = $1",
      [studentAssignmentId],
    );
  }
  await clearSession(student.telegram_user_id);
  await pool.query(
    "insert into bot_student_events (student_id, event_type, payload) values ($1, 'voice_submitted', $2)",
    [student.id, { submissionId: result.rows[0].id }],
  );
  await send(
    message.chat.id,
    copy[languageOf(student)].voiceSaved,
    homeButton(languageOf(student)),
  );
  await notifyAdmins(
    {
      ru: `🎧 <b>Новое голосовое</b>\n${escapeHtml(student.real_name)}\nОткрыть проверку: ${escapeHtml(siteUrl)}/admin`,
      en: `🎧 <b>New recording</b>\n${escapeHtml(student.real_name)}\nOpen review: ${escapeHtml(siteUrl)}/admin`,
    },
  );
}

async function downloadVoice(fileId, uniqueId) {
  const file = await telegram("getFile", { file_id: fileId });
  const response = await undiciFetch(`${fileUrl}/${file.file_path}`, {
    dispatcher: telegramDispatcher,
  });
  if (!response.ok) throw new Error(`download: ${response.status}`);
  const extension = path.extname(file.file_path) || ".ogg";
  const directory = path.join(process.cwd(), "storage", "bot-voice");
  await mkdir(directory, { recursive: true });
  const fileName = `${Date.now()}-${uniqueId}${extension}`;
  await writeFile(
    path.join(directory, fileName),
    Buffer.from(await response.arrayBuffer()),
  );
  return `bot://${fileName}`;
}

async function showProgress(chatId, student, messageId = null) {
  const result = await pool.query(
    `select
       count(*) filter (where status in ('submitted', 'reviewed'))::int completed,
       count(*) filter (where status = 'reviewed')::int reviewed
     from bot_student_assignments where student_id = $1`,
    [student.id],
  );
  const recordings = await pool.query(
    "select count(*)::int total from bot_voice_submissions where student_id = $1",
    [student.id],
  );
  const stats = result.rows[0];
  const lang = languageOf(student);
  const text =
    lang === "en"
      ? `📈 <b>Your progress</b>\n\nTasks completed: ${stats.completed}\nReviewed by Chris: ${stats.reviewed}\nVoice recordings: ${recordings.rows[0].total}`
      : `📈 <b>Ваш прогресс</b>\n\nВыполнено заданий: ${stats.completed}\nПроверено Крисом: ${stats.reviewed}\nГолосовых записей: ${recordings.rows[0].total}`;
  await render(chatId, messageId, text, homeButton(lang));
}

async function showRecordings(chatId, student, messageId = null) {
  const result = await pool.query(
    `select vs.*, t.title_ru, t.title_en
     from bot_voice_submissions vs
     left join bot_student_assignments sa on sa.id = vs.student_assignment_id
     left join bot_assignment_templates t on t.id = sa.template_id
     where vs.student_id = $1 order by vs.created_at desc limit 8`,
    [student.id],
  );
  const lang = languageOf(student);
  if (!result.rowCount)
    return render(chatId, messageId, copy[lang].noRecordings, homeButton(lang));
  await render(
    chatId,
    messageId,
    lang === "en" ? "🎧 Your latest recordings:" : "🎧 Ваши последние записи:",
    homeButton(lang),
  );
  for (const row of result.rows) {
    const title =
      (lang === "en" ? row.title_en : row.title_ru) || "Speaking practice";
    const feedback = row.teacher_feedback
      ? `\n\n${lang === "en" ? "Chris's feedback" : "Комментарий Криса"}: ${row.teacher_feedback}`
      : `\n\n${lang === "en" ? "Waiting for Chris's feedback" : "Ожидает проверки Криса"}`;
    await telegram("sendVoice", {
      chat_id: chatId,
      voice: row.telegram_file_id,
      caption: `${title}${feedback}`,
    });
  }
}

async function showSlots(chatId, student, messageId = null) {
  const result = await pool.query(
    `select * from bot_availability_slots
     where status = 'available' and starts_at > now()
     order by starts_at limit 12`,
  );
  const lang = languageOf(student);
  if (!result.rowCount)
    return render(chatId, messageId, copy[lang].noSlots, homeButton(lang));
  const rows = result.rows.map((slot) => [
    {
      text: `${formatMoscow(slot.starts_at, lang)} · ${slot.lesson_mode === "online" ? "онлайн" : "очно"}`,
      callback_data: `book:${slot.id}`,
    },
  ]);
  rows.push([{ text: copy[lang].back, callback_data: "menu:home" }]);
  await render(chatId, messageId, copy[lang].chooseSlot, inlineKeyboard(rows));
}

async function bookSlot(chatId, student, slotId, lang, messageId = null) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const slot = await client.query(
      "select * from bot_availability_slots where id = $1 and status = 'available' and starts_at > now() for update",
      [slotId],
    );
    if (!slot.rowCount) {
      await client.query("rollback");
      await render(chatId, messageId, copy[lang].slotGone, homeButton(lang));
      return;
    }
    await client.query(
      "update bot_availability_slots set status = 'booked' where id = $1",
      [slotId],
    );
    await client.query(
      "insert into bot_lesson_bookings (slot_id, student_id) values ($1, $2)",
      [slotId, student.id],
    );
    await client.query("commit");
    await render(
      chatId,
      messageId,
      `${copy[lang].booked}\n\n${formatMoscow(slot.rows[0].starts_at, lang)}`,
      homeButton(lang),
    );
    await notifyAdmins(
      {
        ru: `🗓 <b>Новая запись</b>\n${escapeHtml(student.real_name)}\n${formatMoscow(slot.rows[0].starts_at, "ru")} · ${slot.rows[0].lesson_mode === "online" ? "дистанционно" : "очно"}`,
        en: `🗓 <b>New booking</b>\n${escapeHtml(student.real_name)}\n${formatMoscow(slot.rows[0].starts_at, "en")} · ${slot.rows[0].lesson_mode === "online" ? "online" : "in person"}`,
      },
    );
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

function homeButton(lang) {
  return backButton(lang, "menu:home");
}

function backButton(lang, callbackData) {
  return inlineKeyboard([
    [{ text: copy[lang].back, callback_data: callbackData }],
  ]);
}

function formatMoscow(value, lang) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "ru-RU", {
    timeZone: "Europe/Moscow",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character],
  );
}

async function handleAdminCommand(chatId, user, student, rawText) {
  const command = rawText.split(/\s+/)[0].split("@")[0];
  if (command === "/admin") {
    await showAdminHome(chatId, null);
    return true;
  }
  if (command === "/students") {
    await showAdminStudents(chatId, null, 0);
    return true;
  }
  if (command === "/reviews") {
    await showAdminReviews(chatId, null, 0);
    return true;
  }
  if (command === "/slots") {
    await showAdminSlots(chatId, null);
    return true;
  }
  if (command === "/tasks") {
    await showAdminTasks(chatId, null, 0);
    return true;
  }
  return false;
}

async function showAdminHome(chatId, messageId) {
  const a = adminCopy[await adminLocale(chatId)];
  const [students, reviews, slots] = await Promise.all([
    pool.query(
      "select count(*)::int total, count(*) filter (where status = 'pending')::int pending from bot_students where is_admin_profile = false",
    ),
    pool.query(
      "select count(*)::int total from bot_voice_submissions where status = 'pending'",
    ),
    pool.query(
      "select count(*)::int total from bot_availability_slots where status = 'available' and starts_at > now()",
    ),
  ]);
  const stats = students.rows[0];
  await render(
    chatId,
    messageId,
    `⚙️ <b>${a.panel}</b>\n\n${a.students}: ${stats.total}\n${a.awaitingApproval}: ${stats.pending}\n${a.awaitingReview}: ${reviews.rows[0].total}\n${a.freeSlots}: ${slots.rows[0].total}`,
    inlineKeyboard([
      [
        {
          text: `👥 ${a.students}${stats.pending ? ` · ${stats.pending}` : ""}`,
          callback_data: "admin:students:0",
        },
        {
          text: `🎧 ${a.review}${reviews.rows[0].total ? ` · ${reviews.rows[0].total}` : ""}`,
          callback_data: "admin:reviews:0",
        },
      ],
      [
        { text: `🗓 ${a.schedule}`, callback_data: "admin:slots" },
        { text: `🎯 ${a.tasks}`, callback_data: "admin:tasks:0" },
      ],
      [{ text: `➕ ${a.addStudent}`, callback_data: "admin:create" }],
      [{ text: `🌐 ${a.openWeb}`, url: `${siteUrl}/admin` }],
      [{ text: a.back, callback_data: "menu:home" }],
    ]),
  );
}

async function showAdminStudents(chatId, messageId, page) {
  const a = adminCopy[await adminLocale(chatId)];
  const offsetRows = Math.max(0, page) * 8;
  const result = await pool.query(
    `select id, real_name, status, telegram_username, invite_code from bot_students
     where is_admin_profile = false order by (status = 'pending') desc, updated_at desc limit 9 offset $1`,
    [offsetRows],
  );
  const rows = result.rows.slice(0, 8).map((row) => [
    {
      text: `${row.status === "pending" ? "🟡" : "🟢"} ${row.real_name}`,
      callback_data: `admin:student:${row.id}`,
    },
  ]);
  const nav = [];
  if (page > 0)
    nav.push({ text: "←", callback_data: `admin:students:${page - 1}` });
  if (result.rows.length > 8)
    nav.push({ text: "→", callback_data: `admin:students:${page + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: `➕ ${a.add}`, callback_data: "admin:create" }]);
  rows.push([{ text: a.back, callback_data: "admin:home" }]);
  await render(
    chatId,
    messageId,
    `👥 <b>${a.students}</b>\n\n${result.rowCount ? a.chooseStudent : a.empty}`,
    inlineKeyboard(rows),
  );
}

async function showAdminStudent(chatId, messageId, studentId) {
  const a = adminCopy[await adminLocale(chatId)];
  const result = await pool.query(
    `select s.*, count(distinct vs.id)::int recordings, count(distinct sa.id) filter (where sa.status in ('submitted','reviewed'))::int completed
     from bot_students s left join bot_voice_submissions vs on vs.student_id = s.id
     left join bot_student_assignments sa on sa.student_id = s.id
     where s.id = $1 and s.is_admin_profile = false group by s.id`,
    [studentId],
  );
  if (!result.rowCount) return showAdminStudents(chatId, messageId, 0);
  const row = result.rows[0];
  const buttons = [];
  if (row.status === "pending")
    buttons.push([
      { text: `✅ ${a.approve}`, callback_data: `admin:approve:${row.id}` },
    ]);
  buttons.push([
    { text: `🎯 ${a.assignTask}`, callback_data: `admin:assign:${row.id}:0` },
  ]);
  buttons.push([
    { text: `✏️ ${a.editCard}`, callback_data: `admin:edit:${row.id}` },
    { text: `🔄 ${a.status}`, callback_data: `admin:statuses:${row.id}` },
  ]);
  if (!row.telegram_user_id)
    buttons.push([
      { text: `🔑 ${a.newCode}`, callback_data: `admin:renew:${row.id}` },
    ]);
  buttons.push([{ text: a.back, callback_data: "admin:students:0" }]);
  await render(
    chatId,
    messageId,
    `👤 <b>${escapeHtml(row.real_name)}</b>\n${row.telegram_username ? `@${escapeHtml(row.telegram_username)}\n` : ""}${a.status}: ${a.statusNames[row.status] || row.status}\n${a.language}: ${row.language === "en" ? (a === adminCopy.en ? "English" : "английский") : a === adminCopy.en ? "Russian" : "русский"}\n${a.level}: ${escapeHtml(row.level || "—")}\n${a.phone}: ${escapeHtml(row.phone || "—")}\n${a.code}: <code>${escapeHtml(row.invite_code || a.used)}</code>\n\n${a.taskCount}: ${row.completed} · ${a.voiceCount}: ${row.recordings}`,
    inlineKeyboard(buttons),
  );
}

async function showAdminEdit(chatId, messageId, studentId) {
  const a = adminCopy[await adminLocale(chatId)];
  const fields = [
    "real_name",
    "phone",
    "language",
    "level",
    "goals",
    "weak_points",
    "teacher_notes",
  ].map((field, index) => [field, a.fields[index]]);
  const rows = fields.map(([field, label]) => [
    { text: label, callback_data: `admin:field:${studentId}:${field}` },
  ]);
  rows.push([{ text: a.back, callback_data: `admin:student:${studentId}` }]);
  await render(
    chatId,
    messageId,
    `✏️ <b>${a.card}</b>\n\n${a.whatEdit}`,
    inlineKeyboard(rows),
  );
}

async function showAdminStatuses(chatId, messageId, studentId) {
  const a = adminCopy[await adminLocale(chatId)];
  const rows = ["pending", "active", "paused", "archived"].map((status) => [
    {
      text: a.statusNames[status],
      callback_data: `admin:setStatus:${studentId}:${status}`,
    },
  ]);
  rows.push([{ text: a.back, callback_data: `admin:student:${studentId}` }]);
  await render(
    chatId,
    messageId,
    `🔄 <b>${a.status}</b>`,
    inlineKeyboard(rows),
  );
}

async function showAdminAssignments(chatId, messageId, studentId, page) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    "select id, title_ru, title_en from bot_assignment_templates where active = true order by sort_order, id limit 9 offset $1",
    [page * 8],
  );
  const rows = result.rows
    .slice(0, 8)
    .map((row) => [
      {
        text: lang === "en" ? row.title_en : row.title_ru,
        callback_data: `admin:assignDo:${studentId}:${row.id}`,
      },
    ]);
  const nav = [];
  if (page > 0)
    nav.push({
      text: "←",
      callback_data: `admin:assign:${studentId}:${page - 1}`,
    });
  if (result.rows.length > 8)
    nav.push({
      text: "→",
      callback_data: `admin:assign:${studentId}:${page + 1}`,
    });
  if (nav.length) rows.push(nav);
  rows.push([{ text: a.back, callback_data: `admin:student:${studentId}` }]);
  await render(
    chatId,
    messageId,
    `🎯 <b>${a.chooseTask}</b>`,
    inlineKeyboard(rows),
  );
}

async function showAdminReviews(chatId, messageId, page) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    `select vs.id, vs.created_at, s.real_name, t.title_ru, t.title_en from bot_voice_submissions vs
     join bot_students s on s.id = vs.student_id
     left join bot_student_assignments sa on sa.id = vs.student_assignment_id
     left join bot_assignment_templates t on t.id = sa.template_id
     where vs.status = 'pending' order by vs.created_at limit 9 offset $1`,
    [page * 8],
  );
  const rows = result.rows
    .slice(0, 8)
    .map((row) => [
      {
        text: `🎧 ${row.real_name} · ${(lang === "en" ? row.title_en : row.title_ru) || a.practice}`,
        callback_data: `admin:review:${row.id}`,
      },
    ]);
  const nav = [];
  if (page > 0)
    nav.push({ text: "←", callback_data: `admin:reviews:${page - 1}` });
  if (result.rows.length > 8)
    nav.push({ text: "→", callback_data: `admin:reviews:${page + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: a.back, callback_data: "admin:home" }]);
  await render(
    chatId,
    messageId,
    `🎧 <b>${a.review}</b>\n\n${result.rowCount ? a.chooseRecording : a.noRecordings}`,
    inlineKeyboard(rows),
  );
}

async function showAdminReview(chatId, messageId, submissionId, adminId) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    `select vs.*, s.real_name, t.title_ru, t.title_en from bot_voice_submissions vs join bot_students s on s.id = vs.student_id
     left join bot_student_assignments sa on sa.id = vs.student_assignment_id
     left join bot_assignment_templates t on t.id = sa.template_id where vs.id = $1`,
    [submissionId],
  );
  if (!result.rowCount) return showAdminReviews(chatId, messageId, 0);
  const row = result.rows[0];
  await telegram("sendVoice", {
    chat_id: chatId,
    voice: row.telegram_file_id,
    caption: `${row.real_name} · ${(lang === "en" ? row.title_en : row.title_ru) || a.practice}`,
  });
  await setSession(adminId, "admin_feedback", {
    panelMessageId: messageId,
    submissionId,
  });
  await render(
    chatId,
    messageId,
    `✍️ <b>${a.feedbackFor} ${escapeHtml(row.real_name)}</b>\n\n${a.sendComment}`,
    backButton(lang, "admin:reviews:0"),
  );
}

async function showAdminSlots(chatId, messageId) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    `select sl.*, s.real_name from bot_availability_slots sl
     left join bot_lesson_bookings b on b.slot_id = sl.id and b.status <> 'cancelled'
     left join bot_students s on s.id = b.student_id
     where sl.starts_at > now() - interval '1 day' and sl.status <> 'cancelled'
     order by sl.starts_at limit 12`,
  );
  const rows = result.rows.map((row) => [
    {
      text: `${row.status === "available" ? "🟢" : "🔴"} ${formatMoscow(row.starts_at, lang)}${row.real_name ? ` · ${row.real_name}` : ""}`,
      callback_data:
        row.status === "available" ? `admin:slot:${row.id}` : "admin:noop",
    },
  ]);
  rows.push([{ text: `➕ ${a.addSlots}`, callback_data: "admin:slotCreate" }]);
  rows.push([{ text: a.back, callback_data: "admin:home" }]);
  await render(
    chatId,
    messageId,
    `🗓 <b>${a.schedule}</b>\n\n${result.rowCount ? a.cancelHint : a.noSlots}`,
    inlineKeyboard(rows),
  );
}

async function showAdminTasks(chatId, messageId, page) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    "select id, title_ru, title_en, active from bot_assignment_templates order by sort_order, id limit 9 offset $1",
    [page * 8],
  );
  const rows = result.rows
    .slice(0, 8)
    .map((row) => [
      {
        text: `${row.active ? "🟢" : "⚪"} ${lang === "en" ? row.title_en : row.title_ru}`,
        callback_data: `admin:task:${row.id}`,
      },
    ]);
  const nav = [];
  if (page > 0)
    nav.push({ text: "←", callback_data: `admin:tasks:${page - 1}` });
  if (result.rows.length > 8)
    nav.push({ text: "→", callback_data: `admin:tasks:${page + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: a.back, callback_data: "admin:home" }]);
  await render(
    chatId,
    messageId,
    `🎯 <b>${a.library}</b>`,
    inlineKeyboard(rows),
  );
}

async function showAdminTask(chatId, messageId, templateId) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const result = await pool.query(
    "select * from bot_assignment_templates where id = $1",
    [templateId],
  );
  if (!result.rowCount) return showAdminTasks(chatId, messageId, 0);
  const row = result.rows[0];
  await render(
    chatId,
    messageId,
    `🎯 <b>${escapeHtml(lang === "en" ? row.title_en : row.title_ru)}</b>\n\n${escapeHtml(lang === "en" ? row.prompt_en : row.prompt_ru)}\n\n${a.status}: ${row.active ? a.enabled : a.disabled}`,
    inlineKeyboard([
      [
        {
          text: row.active ? `⏸ ${a.turnOff}` : `▶️ ${a.turnOn}`,
          callback_data: `admin:toggle:${row.id}`,
        },
      ],
      [{ text: a.back, callback_data: "admin:tasks:0" }],
    ]),
  );
}

async function handleAdminCallback(data, chatId, messageId, user) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const parts = data.split(":");
  const action = parts[1];
  if (
    [
      "home",
      "students",
      "student",
      "edit",
      "statuses",
      "reviews",
      "slots",
      "tasks",
      "task",
    ].includes(action)
  )
    await clearSession(user.id);
  if (action === "noop") return;
  if (action === "home") return showAdminHome(chatId, messageId);
  if (action === "students")
    return showAdminStudents(chatId, messageId, Number(parts[2]) || 0);
  if (action === "student")
    return showAdminStudent(chatId, messageId, Number(parts[2]));
  if (action === "edit")
    return showAdminEdit(chatId, messageId, Number(parts[2]));
  if (action === "statuses")
    return showAdminStatuses(chatId, messageId, Number(parts[2]));
  if (action === "approve") {
    await pool.query(
      "update bot_students set status = 'active', updated_at = now() where id = $1 and is_admin_profile = false",
      [Number(parts[2])],
    );
    return showAdminStudent(chatId, messageId, Number(parts[2]));
  }
  if (action === "setStatus") {
    const status = parts[3];
    if (["pending", "active", "paused", "archived"].includes(status))
      await pool.query(
        "update bot_students set status = $2, updated_at = now() where id = $1 and is_admin_profile = false",
        [Number(parts[2]), status],
      );
    return showAdminStudent(chatId, messageId, Number(parts[2]));
  }
  if (action === "renew") {
    const code = await uniqueInviteCode();
    await pool.query(
      "update bot_students set invite_code = $2, updated_at = now() where id = $1 and telegram_user_id is null",
      [Number(parts[2]), code],
    );
    return showAdminStudent(chatId, messageId, Number(parts[2]));
  }
  if (action === "field") {
    const studentId = Number(parts[2]);
    const field = parts[3];
    if (!adminStudentFields.has(field))
      return showAdminEdit(chatId, messageId, studentId);
    await setSession(user.id, "admin_field", {
      panelMessageId: messageId,
      studentId,
      field,
    });
    return render(
      chatId,
      messageId,
      `✏️ ${a.newValue}`,
      backButton(lang, `admin:edit:${studentId}`),
    );
  }
  if (action === "assign")
    return showAdminAssignments(
      chatId,
      messageId,
      Number(parts[2]),
      Number(parts[3]) || 0,
    );
  if (action === "assignDo") {
    await pool.query(
      `insert into bot_student_assignments (student_id, template_id, assigned_by) values ($1, $2, 'chris') on conflict (student_id, template_id) do nothing`,
      [Number(parts[2]), Number(parts[3])],
    );
    return showAdminStudent(chatId, messageId, Number(parts[2]));
  }
  if (action === "create") {
    await setSession(user.id, "admin_create_name", {
      panelMessageId: messageId,
    });
    return render(
      chatId,
      messageId,
      `➕ <b>${a.newStudent}</b>\n\n${a.sendName}`,
      backButton(lang, "admin:students:0"),
    );
  }
  if (action === "createSkip") {
    const session = await getSession(user.id);
    return finishAdminCreate(
      chatId,
      messageId,
      user.id,
      session?.payload.realName,
      null,
    );
  }
  if (action === "reviews")
    return showAdminReviews(chatId, messageId, Number(parts[2]) || 0);
  if (action === "review")
    return showAdminReview(chatId, messageId, Number(parts[2]), user.id);
  if (action === "slots") return showAdminSlots(chatId, messageId);
  if (action === "slot")
    return render(
      chatId,
      messageId,
      a.closeSlot,
      inlineKeyboard([
        [
          {
            text: `✅ ${a.closeAction}`,
            callback_data: `admin:cancelSlot:${parts[2]}`,
          },
        ],
        [{ text: a.back, callback_data: "admin:slots" }],
      ]),
    );
  if (action === "cancelSlot") {
    await pool.query(
      "update bot_availability_slots set status = 'cancelled' where id = $1 and status = 'available'",
      [Number(parts[2])],
    );
    return showAdminSlots(chatId, messageId);
  }
  if (action === "slotCreate") {
    await setSession(user.id, "admin_slot_datetime", {
      panelMessageId: messageId,
    });
    return render(
      chatId,
      messageId,
      `➕ <b>${a.newSlots}</b>\n\n${a.moscowDate}:\n<code>25.07.2026 18:30</code>`,
      backButton(lang, "admin:slots"),
    );
  }
  if (action === "duration") {
    await setSession(user.id, "admin_slot_mode", {
      ...(await getSession(user.id)).payload,
      duration: Number(parts[2]),
    });
    return render(
      chatId,
      messageId,
      `${a.lessonMode}:`,
      inlineKeyboard([
        [
          { text: `💻 ${a.online}`, callback_data: "admin:mode:online" },
          { text: `🏫 ${a.offline}`, callback_data: "admin:mode:offline" },
        ],
        [{ text: a.back, callback_data: "admin:slotCreate" }],
      ]),
    );
  }
  if (action === "mode") {
    await setSession(user.id, "admin_slot_repeats", {
      ...(await getSession(user.id)).payload,
      mode: parts[2] === "offline" ? "offline" : "online",
    });
    return render(
      chatId,
      messageId,
      a.repeats,
      inlineKeyboard([
        [1, 4, 8, 12].map((count) => ({
          text: String(count),
          callback_data: `admin:repeats:${count}`,
        })),
        [{ text: a.back, callback_data: "admin:slotCreate" }],
      ]),
    );
  }
  if (action === "repeats") {
    const session = await getSession(user.id);
    const payload = { ...session.payload, repeats: Number(parts[2]) };
    if (payload.mode === "offline") {
      await setSession(user.id, "admin_slot_location", payload);
      return render(
        chatId,
        messageId,
        a.sendAddress,
        backButton(lang, "admin:slots"),
      );
    }
    await createAdminSlots(payload);
    await clearSession(user.id);
    return showAdminSlots(chatId, messageId);
  }
  if (action === "tasks")
    return showAdminTasks(chatId, messageId, Number(parts[2]) || 0);
  if (action === "task")
    return showAdminTask(chatId, messageId, Number(parts[2]));
  if (action === "toggle") {
    await pool.query(
      "update bot_assignment_templates set active = not active where id = $1",
      [Number(parts[2])],
    );
    return showAdminTask(chatId, messageId, Number(parts[2]));
  }
}

const adminStudentFields = new Set([
  "real_name",
  "phone",
  "language",
  "level",
  "goals",
  "weak_points",
  "teacher_notes",
]);

async function handleAdminInput(message, session) {
  const text = message.text?.trim();
  if (!text) return false;
  const chatId = message.chat.id;
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  const messageId = Number(session.payload.panelMessageId) || null;
  if (session.state === "admin_field") {
    const field = session.payload.field;
    if (adminStudentFields.has(field))
      await pool.query(
        `update bot_students set ${field} = $2, updated_at = now() where id = $1 and is_admin_profile = false`,
        [
          Number(session.payload.studentId),
          text === "-" ? null : text.slice(0, 2000),
        ],
      );
    await clearSession(message.from.id);
    await showAdminStudent(
      chatId,
      messageId,
      Number(session.payload.studentId),
    );
    return true;
  }
  if (session.state === "admin_create_name") {
    await setSession(message.from.id, "admin_create_phone", {
      panelMessageId: messageId,
      realName: text.slice(0, 120),
    });
    await render(
      chatId,
      messageId,
      a.sendPhone,
      inlineKeyboard([
        [{ text: a.noPhone, callback_data: "admin:createSkip" }],
        [{ text: a.back, callback_data: "admin:create" }],
      ]),
    );
    return true;
  }
  if (session.state === "admin_create_phone") {
    await finishAdminCreate(
      chatId,
      messageId,
      message.from.id,
      session.payload.realName,
      text.slice(0, 80),
    );
    return true;
  }
  if (session.state === "admin_feedback") {
    const result = await pool.query(
      `update bot_voice_submissions vs set status = 'reviewed', teacher_feedback = $2, reviewed_at = now()
       where vs.id = $1 returning vs.student_assignment_id,
       (select telegram_user_id from bot_students where id = vs.student_id) telegram_user_id,
       (select language from bot_students where id = vs.student_id) student_language`,
      [Number(session.payload.submissionId), text.slice(0, 3000)],
    );
    if (result.rowCount) {
      if (result.rows[0].student_assignment_id)
        await pool.query(
          "update bot_student_assignments set status = 'reviewed' where id = $1",
          [result.rows[0].student_assignment_id],
        );
      if (result.rows[0].telegram_user_id)
        await send(
          result.rows[0].telegram_user_id,
          `✅ <b>${result.rows[0].student_language === "en" ? "Chris reviewed your recording" : "Крис проверил ваше голосовое"}</b>\n\n${escapeHtml(text.slice(0, 3000))}`,
        );
    }
    await clearSession(message.from.id);
    await showAdminReviews(chatId, messageId, 0);
    return true;
  }
  if (session.state === "admin_slot_datetime") {
    const startsAt = parseMoscowDate(text);
    if (!startsAt || startsAt <= new Date()) {
      await render(
        chatId,
        messageId,
        `${a.invalidDate} ${lang === "en" ? "Example" : "Пример"}: <code>25.07.2026 18:30</code>`,
        backButton(lang, "admin:slots"),
      );
      return true;
    }
    await setSession(message.from.id, "admin_slot_duration", {
      panelMessageId: messageId,
      startsAt: startsAt.toISOString(),
    });
    await render(
      chatId,
      messageId,
      `${a.duration}:`,
      inlineKeyboard([
        [30, 45, 60, 90].map((minutes) => ({
          text: `${minutes} ${a.minutes}`,
          callback_data: `admin:duration:${minutes}`,
        })),
        [{ text: a.back, callback_data: "admin:slotCreate" }],
      ]),
    );
    return true;
  }
  if (session.state === "admin_slot_location") {
    await createAdminSlots({
      ...session.payload,
      location: text.slice(0, 300),
    });
    await clearSession(message.from.id);
    await showAdminSlots(chatId, messageId);
    return true;
  }
  return false;
}

async function finishAdminCreate(chatId, messageId, adminId, realName, phone) {
  const lang = await adminLocale(chatId);
  const a = adminCopy[lang];
  if (!realName) return showAdminStudents(chatId, messageId, 0);
  const code = await uniqueInviteCode();
  const result = await pool.query(
    `insert into bot_students (real_name, phone, student_kind, status, invite_code)
     values ($1, $2, 'existing', 'active', $3) returning id`,
    [String(realName).slice(0, 120), phone || null, code],
  );
  await clearSession(adminId);
  await render(
    chatId,
    messageId,
    `✅ <b>${a.created}</b>\n\n${a.code}: <code>${code}</code>`,
    inlineKeyboard([
      [
        {
          text: a.openCard,
          callback_data: `admin:student:${result.rows[0].id}`,
        },
      ],
      [{ text: a.back, callback_data: "admin:students:0" }],
    ]),
  );
}

async function uniqueInviteCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `CHRIS-${randomBytes(3).toString("hex").toUpperCase()}`;
    const exists = await pool.query(
      "select 1 from bot_students where invite_code = $1",
      [code],
    );
    if (!exists.rowCount) return code;
  }
  throw new Error("Could not generate unique invite code");
}

function parseMoscowDate(value) {
  const match = String(value).match(
    /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/,
  );
  if (!match) return null;
  const [, day, month, year, hour, minute] = match.map(Number);
  const calendarCheck = new Date(Date.UTC(year, month - 1, day));
  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59
  )
    return null;
  return new Date(Date.UTC(year, month - 1, day, hour - 3, minute));
}

async function createAdminSlots(payload) {
  const startsAt = new Date(payload.startsAt);
  const duration = Math.min(240, Math.max(15, Number(payload.duration) || 60));
  const repeats = Math.min(12, Math.max(1, Number(payload.repeats) || 1));
  const mode = payload.mode === "offline" ? "offline" : "online";
  const client = await pool.connect();
  try {
    await client.query("begin");
    for (let index = 0; index < repeats; index += 1) {
      const start = new Date(
        startsAt.getTime() + index * 7 * 24 * 60 * 60 * 1000,
      );
      const end = new Date(start.getTime() + duration * 60 * 1000);
      await client.query(
        "insert into bot_availability_slots (starts_at, ends_at, lesson_mode, location) values ($1, $2, $3, $4)",
        [start, end, mode, payload.location || null],
      );
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function notifyAdmins(messages) {
  await Promise.allSettled(
    [...adminIds].map(async (id) => {
      const lang = await adminLocale(id);
      return send(id, messages[lang]);
    }),
  );
}

export async function processUpdate(update) {
  if (update.message) await handleMessage(update.message);
  if (update.callback_query) await handleCallback(update.callback_query);
}

export async function configureBot() {
  await telegram("setMyCommands", { commands: studentCommands.ru });
  await telegram("setMyCommands", {
    scope: { type: "all_private_chats" },
    language_code: "en",
    commands: studentCommands.en,
  });
  await Promise.allSettled(
    [...adminIds].map(async (id) => configureAdminChat(id, await adminLocale(id))),
  );
}

function configureAdminChat(chatId, lang = "ru") {
  return telegram("setMyCommands", {
    scope: { type: "chat", chat_id: chatId },
    commands: adminCommands[lang],
  });
}

async function poll() {
  console.log(`Chris bot started. Admins: ${[...adminIds].join(", ")}`);
  await configureBot();

  while (!stopping) {
    try {
      const updates = await telegram("getUpdates", {
        offset,
        timeout: 45,
        allowed_updates: ["message", "callback_query"],
      });
      for (const update of updates) {
        offset = update.update_id + 1;
        try {
          await processUpdate(update);
        } catch (error) {
          console.error(`Update ${update.update_id} failed:`, error);
          if (update.message?.chat?.id)
            await send(
              update.message.chat.id,
              "Произошла ошибка. Попробуйте ещё раз через минуту.",
            ).catch(() => {});
        }
      }
    } catch (error) {
      console.error("Polling error:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    stopping = true;
    await pool.end();
    process.exit(0);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await poll();
