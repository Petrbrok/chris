export type BotLanguage = "ru" | "en";

export type BotMenuItem = {
  id: string;
  action: "task" | "progress" | "recordings" | "booking";
  icon: string;
  enabled: boolean;
  label: Record<BotLanguage, string>;
};

export type BotCustomPage = {
  id: string;
  enabled: boolean;
  menuLabel: Record<BotLanguage, string>;
  title: Record<BotLanguage, string>;
  text: Record<BotLanguage, string>;
  linkLabel: Record<BotLanguage, string>;
  linkUrl: string;
};

export type BotContentSettings = {
  version: 1;
  copy: Record<BotLanguage, Record<string, string>>;
  menu: BotMenuItem[];
  pages: BotCustomPage[];
};

export const defaultBotContent: BotContentSettings = {
  version: 1,
  copy: {
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
      noTask:
        "Вы уже выполнили все доступные задания. Крис скоро добавит новые.",
      noRecordings: "У вас пока нет сохранённых голосовых.",
      noSlots: "Свободных окон пока нет. Крис добавит их в календарь.",
      chooseSlot: "Выберите свободное окно. Время указано по Москве:",
      booked: "Запись подтверждена. Крис получил уведомление.",
      slotGone: "Это окно уже занято. Выберите другое.",
      chooseLanguage: "Выберите язык",
      progressSummary:
        "📈 <b>Ваш прогресс</b>\n\nВыполнено заданий: {completed}\nПроверено Крисом: {reviewed}\nГолосовых записей: {recordings}",
      recordingsHeading: "🎧 Ваши последние записи:",
      practiceTitle: "Разговорная практика",
      feedbackLabel: "Комментарий Криса",
      waitingFeedback: "Ожидает проверки Криса",
      onlineMode: "дистанционно",
      offlineMode: "очно",
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
      chooseLanguage: "Choose language",
      progressSummary:
        "📈 <b>Your progress</b>\n\nTasks completed: {completed}\nReviewed by Chris: {reviewed}\nVoice recordings: {recordings}",
      recordingsHeading: "🎧 Your latest recordings:",
      practiceTitle: "Speaking practice",
      feedbackLabel: "Chris's feedback",
      waitingFeedback: "Waiting for Chris's feedback",
      onlineMode: "online",
      offlineMode: "in person",
      back: "← Back",
    },
  },
  menu: [
    {
      id: "task",
      action: "task",
      icon: "🎙",
      enabled: true,
      label: { ru: "Задание", en: "Task" },
    },
    {
      id: "progress",
      action: "progress",
      icon: "📈",
      enabled: true,
      label: { ru: "Мой прогресс", en: "My progress" },
    },
    {
      id: "recordings",
      action: "recordings",
      icon: "🎧",
      enabled: true,
      label: { ru: "Мои голосовые", en: "My recordings" },
    },
    {
      id: "booking",
      action: "booking",
      icon: "🗓",
      enabled: true,
      label: { ru: "Записаться", en: "Book a lesson" },
    },
  ],
  pages: [],
};

const actions = new Set<BotMenuItem["action"]>([
  "task",
  "progress",
  "recordings",
  "booking",
]);

export function normalizeBotContent(value: unknown): BotContentSettings {
  const source = value && typeof value === "object"
    ? value as Partial<BotContentSettings>
    : {};
  const copySource = source.copy && typeof source.copy === "object"
    ? source.copy
    : defaultBotContent.copy;

  const copy = {
    ru: normalizeCopy(copySource.ru, defaultBotContent.copy.ru),
    en: normalizeCopy(copySource.en, defaultBotContent.copy.en),
  };

  const menu = Array.isArray(source.menu)
    ? source.menu
        .slice(0, 12)
        .map((item, index) => normalizeMenuItem(item, index))
        .filter((item): item is BotMenuItem => Boolean(item))
    : structuredClone(defaultBotContent.menu);

  const pages = Array.isArray(source.pages)
    ? source.pages
        .slice(0, 20)
        .map((page, index) => normalizePage(page, index))
    : [];

  return { version: 1, copy, menu, pages };
}

function normalizeCopy(
  value: unknown,
  fallback: Record<string, string>,
): Record<string, string> {
  const source = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  return Object.fromEntries(
    Object.entries(fallback).map(([key, defaultValue]) => [
      key,
      cleanText(source[key], defaultValue, 4000),
    ]),
  );
}

function normalizeMenuItem(value: unknown, index: number): BotMenuItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const action = String(item.action || "");
  if (!actions.has(action as BotMenuItem["action"])) return null;
  const label = item.label && typeof item.label === "object"
    ? item.label as Record<string, unknown>
    : {};
  return {
    id: cleanId(item.id, `${action}-${index}`),
    action: action as BotMenuItem["action"],
    icon: cleanText(item.icon, "", 8),
    enabled: item.enabled !== false,
    label: {
      ru: cleanText(label.ru, defaultLabel(action, "ru"), 64),
      en: cleanText(label.en, defaultLabel(action, "en"), 64),
    },
  };
}

function normalizePage(value: unknown, index: number): BotCustomPage {
  const page = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  return {
    id: cleanId(page.id, `page-${index + 1}`),
    enabled: page.enabled !== false,
    menuLabel: localized(page.menuLabel, "Новый раздел", "New section", 64),
    title: localized(page.title, "Новый раздел", "New section", 120),
    text: localized(page.text, "Добавьте текст.", "Add your text.", 4000),
    linkLabel: localized(page.linkLabel, "Открыть", "Open", 64),
    linkUrl: /^https:\/\//i.test(String(page.linkUrl || ""))
      ? String(page.linkUrl).slice(0, 500)
      : "",
  };
}

function localized(
  value: unknown,
  ru: string,
  en: string,
  max: number,
): Record<BotLanguage, string> {
  const source = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  return {
    ru: cleanText(source.ru, ru, max),
    en: cleanText(source.en, en, max),
  };
}

function cleanText(value: unknown, fallback: string, max: number) {
  const result = String(value ?? "").trim();
  return (result || fallback).slice(0, max);
}

function cleanId(value: unknown, fallback: string) {
  const id = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return id || fallback;
}

function defaultLabel(action: string, lang: BotLanguage) {
  const item = defaultBotContent.menu.find((entry) => entry.action === action);
  return item?.label[lang] || action;
}
