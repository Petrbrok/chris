"use client";

import { useState } from "react";
import type {
  BotContentSettings,
  BotCustomPage,
  BotLanguage,
  BotMenuItem,
} from "@/lib/bot-content";
import type { AdminLang } from "./BotAdmin";

const ui = {
  ru: {
    title: "Настройка помощника",
    note: "Меняйте тексты и кнопки без правок программы. Ученики увидят изменения только после публикации.",
    messages: "Сообщения",
    menu: "Главное меню",
    pages: "Дополнительные разделы",
    save: "Сохранить черновик",
    publish: "Опубликовать",
    restore: "Отменить изменения",
    saved: "Черновик",
    live: "Опубликовано",
    preview: "Предпросмотр",
    russian: "Русский",
    english: "Английский",
    enabled: "Показывать",
    icon: "Значок",
    buttonRu: "Кнопка на русском",
    buttonEn: "Кнопка на английском",
    moveUp: "Выше",
    moveDown: "Ниже",
    addPage: "Добавить раздел",
    deletePage: "Удалить",
    pageMenuRu: "Кнопка раздела на русском",
    pageMenuEn: "Кнопка раздела на английском",
    pageTitleRu: "Заголовок на русском",
    pageTitleEn: "Заголовок на английском",
    pageTextRu: "Текст на русском",
    pageTextEn: "Текст на английском",
    link: "Ссылка — необязательно",
    linkRu: "Текст ссылки на русском",
    linkEn: "Текст ссылки на английском",
    noPages: "Добавьте информационный раздел, ссылку на материалы или новую услугу.",
    changed: "Есть неопубликованные изменения",
    ready: "Всё опубликовано",
  },
  en: {
    title: "Bot setup",
    note: "Edit copy and buttons without changing code. Students only see changes after publishing.",
    messages: "Messages",
    menu: "Main menu",
    pages: "Additional sections",
    save: "Save draft",
    publish: "Publish",
    restore: "Discard changes",
    saved: "Draft",
    live: "Published",
    preview: "Preview",
    russian: "Russian",
    english: "English",
    enabled: "Visible",
    icon: "Icon",
    buttonRu: "Russian button",
    buttonEn: "English button",
    moveUp: "Move up",
    moveDown: "Move down",
    addPage: "Add section",
    deletePage: "Delete",
    pageMenuRu: "Russian menu button",
    pageMenuEn: "English menu button",
    pageTitleRu: "Russian title",
    pageTitleEn: "English title",
    pageTextRu: "Russian text",
    pageTextEn: "English text",
    link: "Link — optional",
    linkRu: "Russian link label",
    linkEn: "English link label",
    noPages: "Add an information section, a resource link, or a new service.",
    changed: "Unpublished changes",
    ready: "Everything is published",
  },
} as const;

const messageNames: Record<string, [string, string]> = {
  welcome: ["Первое приветствие", "First welcome"],
  identify: ["Выбор типа ученика", "Student type choice"],
  existing: ["Кнопка действующего ученика", "Existing student button"],
  newStudent: ["Кнопка нового ученика", "New student button"],
  code: ["Запрос персонального кода", "Personal code request"],
  badCode: ["Ошибка персонального кода", "Personal code error"],
  askName: ["Запрос имени", "Name request"],
  askPhone: ["Запрос телефона", "Phone request"],
  sharePhone: ["Кнопка отправки телефона", "Share phone button"],
  skipPhone: ["Кнопка без телефона", "Skip phone button"],
  pending: ["Заявка отправлена", "Application submitted"],
  linked: ["Профиль привязан", "Profile linked"],
  menu: ["Заголовок главного меню", "Main menu heading"],
  task: ["Название заданий", "Assignments label"],
  progress: ["Название прогресса", "Progress label"],
  recordings: ["Название голосовых", "Recordings label"],
  booking: ["Название записи", "Booking label"],
  language: ["Кнопка языка", "Language button"],
  sendVoice: ["Просьба записать голосовое", "Voice recording request"],
  voiceSaved: ["Голосовое сохранено", "Recording saved"],
  noTask: ["Нет заданий", "No assignments"],
  noRecordings: ["Нет голосовых", "No recordings"],
  noSlots: ["Нет свободных окон", "No available slots"],
  chooseSlot: ["Выбор времени", "Time selection"],
  booked: ["Запись подтверждена", "Booking confirmed"],
  slotGone: ["Время уже занято", "Slot no longer available"],
  chooseLanguage: ["Выбор языка", "Language selection"],
  progressSummary: ["Сводка прогресса", "Progress summary"],
  recordingsHeading: ["Заголовок голосовых", "Recordings heading"],
  practiceTitle: ["Свободная практика", "Free practice title"],
  feedbackLabel: ["Заголовок комментария", "Feedback label"],
  waitingFeedback: ["Ожидание проверки", "Waiting for review"],
  onlineMode: ["Дистанционный урок", "Online lesson"],
  offlineMode: ["Очный урок", "In-person lesson"],
  back: ["Кнопка возврата", "Back button"],
};

type EditorTab = "messages" | "menu" | "pages";
type Action = (
  action: string,
  payload?: Record<string, unknown>,
) => Promise<boolean>;

export default function BotContentEditor({
  settings,
  published,
  busy,
  act,
  lang,
}: {
  settings: BotContentSettings;
  published: BotContentSettings;
  busy: boolean;
  act: Action;
  lang: AdminLang;
}) {
  const c = ui[lang];
  const [draft, setDraft] = useState<BotContentSettings>(() =>
    structuredClone(settings),
  );
  const [tab, setTab] = useState<EditorTab>("messages");
  const [messageKey, setMessageKey] = useState("welcome");
  const [previewLang, setPreviewLang] = useState<BotLanguage>(
    lang === "en" ? "en" : "ru",
  );

  const dirty = JSON.stringify(draft) !== JSON.stringify(published);

  function updateCopy(language: BotLanguage, key: string, value: string) {
    setDraft((current) => ({
      ...current,
      copy: {
        ...current.copy,
        [language]: { ...current.copy[language], [key]: value },
      },
    }));
  }

  function updateMenu(index: number, values: Partial<BotMenuItem>) {
    setDraft((current) => ({
      ...current,
      menu: current.menu.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...values } : item,
      ),
    }));
  }

  function moveMenu(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const next = [...current.menu];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, menu: next };
    });
  }

  function addPage() {
    const id = `page-${Date.now().toString(36)}`;
    const page: BotCustomPage = {
      id,
      enabled: true,
      menuLabel: { ru: "Новый раздел", en: "New section" },
      title: { ru: "Новый раздел", en: "New section" },
      text: { ru: "Добавьте текст.", en: "Add your text." },
      linkLabel: { ru: "Открыть", en: "Open" },
      linkUrl: "",
    };
    setDraft((current) => ({ ...current, pages: [...current.pages, page] }));
  }

  function updatePage(index: number, values: Partial<BotCustomPage>) {
    setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, pageIndex) =>
        pageIndex === index ? { ...page, ...values } : page,
      ),
    }));
  }

  const selectedName = messageNames[messageKey]?.[lang === "ru" ? 0 : 1] ||
    messageKey;

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[24px] border border-[#172033]/10 bg-[#fffdf8] shadow-[0_20px_60px_rgba(31,45,70,0.08)]">
        <div className="flex flex-col gap-5 border-b border-[#172033]/8 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-black text-[#172033]">{c.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  dirty
                    ? "bg-[#f3a51d]/18 text-[#8b5707]"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {dirty ? c.changed : c.ready}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526078]">
              {c.note}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => act("restore_bot_settings")}
              className="min-h-11 rounded-xl border border-[#172033]/12 bg-white px-4 text-sm font-black text-[#526078] disabled:opacity-40"
            >
              {c.restore}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => act("save_bot_settings", { settings: draft })}
              className="min-h-11 rounded-xl border border-[#087bd3]/20 bg-[#087bd3]/7 px-4 text-sm font-black text-[#087bd3] disabled:opacity-40"
            >
              {c.save}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => act("publish_bot_settings", { settings: draft })}
              className="min-h-11 rounded-xl bg-[#f3a51d] px-5 text-sm font-black text-[#172033] shadow-[0_8px_22px_rgba(243,165,29,0.25)] disabled:opacity-40"
            >
              {c.publish}
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pt-3">
          {([
            ["messages", c.messages],
            ["menu", c.menu],
            ["pages", c.pages],
          ] as Array<[EditorTab, string]>).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-black ${
                tab === key
                  ? "bg-[#172033] text-white"
                  : "text-[#526078] hover:bg-[#172033]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-[24px] border border-white bg-white/80 p-5 shadow-[0_16px_44px_rgba(31,45,70,0.06)]">
          {tab === "messages" ? (
            <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
              <div className="grid max-h-[620px] content-start gap-1 overflow-y-auto pr-2">
                {Object.keys(draft.copy.ru).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMessageKey(key)}
                    className={`rounded-xl px-3 py-2.5 text-left text-sm font-bold ${
                      messageKey === key
                        ? "bg-[#087bd3] text-white"
                        : "text-[#526078] hover:bg-[#087bd3]/7"
                    }`}
                  >
                    {messageNames[key]?.[lang === "ru" ? 0 : 1] || key}
                  </button>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-black text-[#172033]">
                  {selectedName}
                </h4>
                <div className="mt-4 grid gap-4">
                  <TextArea
                    label={c.russian}
                    value={draft.copy.ru[messageKey] || ""}
                    onChange={(value) => updateCopy("ru", messageKey, value)}
                  />
                  <TextArea
                    label={c.english}
                    value={draft.copy.en[messageKey] || ""}
                    onChange={(value) => updateCopy("en", messageKey, value)}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {tab === "menu" ? (
            <div className="grid gap-3">
              {draft.menu.map((item, index) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-[#172033]/8 bg-[#f8f5ee] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm font-black text-[#172033]">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(event) =>
                          updateMenu(index, { enabled: event.target.checked })
                        }
                        className="size-4 accent-[#087bd3]"
                      />
                      {c.enabled}
                    </label>
                    <div className="flex gap-2">
                      <SmallButton
                        disabled={index === 0}
                        onClick={() => moveMenu(index, -1)}
                      >
                        ↑ {c.moveUp}
                      </SmallButton>
                      <SmallButton
                        disabled={index === draft.menu.length - 1}
                        onClick={() => moveMenu(index, 1)}
                      >
                        ↓ {c.moveDown}
                      </SmallButton>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[90px_1fr_1fr]">
                    <TextInput
                      label={c.icon}
                      value={item.icon}
                      onChange={(value) => updateMenu(index, { icon: value })}
                    />
                    <TextInput
                      label={c.buttonRu}
                      value={item.label.ru}
                      onChange={(value) =>
                        updateMenu(index, {
                          label: { ...item.label, ru: value },
                        })
                      }
                    />
                    <TextInput
                      label={c.buttonEn}
                      value={item.label.en}
                      onChange={(value) =>
                        updateMenu(index, {
                          label: { ...item.label, en: value },
                        })
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {tab === "pages" ? (
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#526078]">
                  {draft.pages.length ? `${draft.pages.length}` : c.noPages}
                </p>
                <button
                  type="button"
                  onClick={addPage}
                  className="rounded-xl bg-[#087bd3] px-4 py-2.5 text-sm font-black text-white"
                >
                  + {c.addPage}
                </button>
              </div>
              {draft.pages.map((page, index) => (
                <article
                  key={page.id}
                  className="grid gap-4 rounded-2xl border border-[#087bd3]/12 bg-[#f7fbff] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={page.enabled}
                        onChange={(event) =>
                          updatePage(index, { enabled: event.target.checked })
                        }
                        className="size-4 accent-[#087bd3]"
                      />
                      {c.enabled}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          pages: current.pages.filter(
                            (_, pageIndex) => pageIndex !== index,
                          ),
                        }))
                      }
                      className="text-xs font-black text-red-700"
                    >
                      {c.deletePage}
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label={c.pageMenuRu}
                      value={page.menuLabel.ru}
                      onChange={(value) =>
                        updatePage(index, {
                          menuLabel: { ...page.menuLabel, ru: value },
                        })
                      }
                    />
                    <TextInput
                      label={c.pageMenuEn}
                      value={page.menuLabel.en}
                      onChange={(value) =>
                        updatePage(index, {
                          menuLabel: { ...page.menuLabel, en: value },
                        })
                      }
                    />
                    <TextInput
                      label={c.pageTitleRu}
                      value={page.title.ru}
                      onChange={(value) =>
                        updatePage(index, {
                          title: { ...page.title, ru: value },
                        })
                      }
                    />
                    <TextInput
                      label={c.pageTitleEn}
                      value={page.title.en}
                      onChange={(value) =>
                        updatePage(index, {
                          title: { ...page.title, en: value },
                        })
                      }
                    />
                    <TextArea
                      label={c.pageTextRu}
                      value={page.text.ru}
                      onChange={(value) =>
                        updatePage(index, {
                          text: { ...page.text, ru: value },
                        })
                      }
                    />
                    <TextArea
                      label={c.pageTextEn}
                      value={page.text.en}
                      onChange={(value) =>
                        updatePage(index, {
                          text: { ...page.text, en: value },
                        })
                      }
                    />
                    <TextInput
                      label={c.link}
                      value={page.linkUrl}
                      onChange={(value) => updatePage(index, { linkUrl: value })}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextInput
                        label={c.linkRu}
                        value={page.linkLabel.ru}
                        onChange={(value) =>
                          updatePage(index, {
                            linkLabel: { ...page.linkLabel, ru: value },
                          })
                        }
                      />
                      <TextInput
                        label={c.linkEn}
                        value={page.linkLabel.en}
                        onChange={(value) =>
                          updatePage(index, {
                            linkLabel: { ...page.linkLabel, en: value },
                          })
                        }
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <BotPreview
          settings={draft}
          language={previewLang}
          onLanguage={setPreviewLang}
          label={c.preview}
        />
      </div>
    </div>
  );
}

function BotPreview({
  settings,
  language,
  onLanguage,
  label,
}: {
  settings: BotContentSettings;
  language: BotLanguage;
  onLanguage: (language: BotLanguage) => void;
  label: string;
}) {
  return (
    <aside className="h-fit xl:sticky xl:top-5">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#526078]">
          {label}
        </p>
        <div className="flex rounded-full bg-[#172033]/7 p-1">
          {(["ru", "en"] as BotLanguage[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onLanguage(item)}
              className={`rounded-full px-3 py-1 text-xs font-black ${
                language === item ? "bg-white text-[#172033] shadow-sm" : "text-[#526078]"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-[32px] border-[7px] border-[#172033] bg-[#dfeaf3] shadow-[0_24px_50px_rgba(23,32,51,0.22)]">
        <div className="flex items-center gap-2 bg-[#087bd3] px-4 py-3 text-white">
          <span className="grid size-9 place-items-center rounded-full bg-[#f3a51d] text-lg">
            C
          </span>
          <div>
            <p className="text-sm font-black">Chris Matoz</p>
            <p className="text-[10px] font-bold text-white/70">Telegram</p>
          </div>
        </div>
        <div className="min-h-[470px] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.8),transparent_35%),linear-gradient(160deg,#dce9f1,#eef3ed)] p-3">
          <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-3 py-2.5 shadow-sm">
            <p className="whitespace-pre-wrap text-sm font-semibold leading-5 text-[#172033]">
              {settings.copy[language].menu}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {settings.menu
              .filter((item) => item.enabled)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white/90 px-2 py-2 text-center text-[11px] font-black text-[#087bd3] shadow-sm"
                >
                  {item.icon} {item.label[language]}
                </div>
              ))}
          </div>
          <div className="mt-1.5 grid gap-1.5">
            {settings.pages
              .filter((page) => page.enabled)
              .map((page) => (
                <div
                  key={page.id}
                  className="rounded-lg bg-white/90 px-2 py-2 text-center text-[11px] font-black text-[#087bd3] shadow-sm"
                >
                  {page.menuLabel[language]}
                </div>
              ))}
            <div className="rounded-lg bg-white/90 px-2 py-2 text-center text-[11px] font-black text-[#087bd3] shadow-sm">
              🌐 {settings.copy[language].language}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const fieldClass =
  "w-full rounded-xl border border-[#172033]/12 bg-white px-3.5 py-3 text-sm font-semibold text-[#172033] outline-none transition focus:border-[#087bd3] focus:ring-2 focus:ring-[#087bd3]/10";

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-black text-[#526078]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-black text-[#526078]">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} min-h-32 resize-y leading-6`}
      />
    </label>
  );
}

function SmallButton({
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
      className="rounded-lg border border-[#172033]/10 bg-white px-2.5 py-1.5 text-xs font-black text-[#526078] disabled:opacity-30"
    >
      {children}
    </button>
  );
}
