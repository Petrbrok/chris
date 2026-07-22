"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/site";
import type { SiteContent } from "@/lib/site-overrides";
import BotAdmin from "./BotAdmin";

type TabKey = "bot" | "texts" | "leads" | "tests" | "speaking" | "export";
type LangKey = "ru" | "en";
type Row = Record<string, unknown>;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "bot", label: "Ученики и бот" },
  { key: "texts", label: "Тексты сайта" },
  { key: "leads", label: "Заявки" },
  { key: "tests", label: "Прошли тест" },
  { key: "speaking", label: "Speaking test" },
  { key: "export", label: "Экспорт" },
];

function cloneContent(): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

export default function AdminPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("bot");
  const [lang, setLang] = useState<LangKey>("ru");
  const [siteContent, setSiteContent] = useState<SiteContent>(cloneContent);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const leads = useRows(data, "leads");
  const tests = useRows(data, "test_results");
  const speaking = useRows(data, "speaking_submissions");

  async function login() {
    setBusy(true);
    setStatus("Вход...");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    setBusy(false);
    if (!res.ok) {
      setStatus(body.error || "Ошибка входа");
      return;
    }
    setToken(body.token);
    setStatus("Вход выполнен");
    await loadAll(body.token);
  }

  async function loadAll(authToken = token) {
    if (!authToken) return;
    setBusy(true);
    const [cmsRes, dataRes] = await Promise.all([
      fetch("/api/cms", { headers: { Authorization: `Bearer ${authToken}` } }),
      fetch("/api/admin/data", { headers: { Authorization: `Bearer ${authToken}` } }),
    ]);
    const cmsBody = await cmsRes.json();
    const dataBody = await dataRes.json();
    if (cmsBody.site?.ru && cmsBody.site?.en) setSiteContent(cmsBody.site);
    setData(dataBody);
    setBusy(false);
    setStatus(dataRes.ok ? "Данные обновлены" : dataBody.error || "Ошибка загрузки данных");
  }

  async function saveTexts() {
    setBusy(true);
    setStatus("Сохраняю тексты...");
    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key: "site", value: siteContent }),
    });
    setBusy(false);
    setStatus(res.ok ? "Тексты сохранены" : "Ошибка сохранения");
  }

  if (!token) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#f6f2ea] px-4 text-[#172033]">
        <section className="w-full max-w-sm rounded-[22px] border border-white/70 bg-white/72 p-5 shadow-[0_18px_46px_rgba(31,45,70,0.09)]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#087bd3]">
            Spoken English with Chris
          </p>
          <h1 className="mt-2 text-2xl font-black">Вход</h1>
          <div className="mt-5 grid gap-3">
            <TextField label="Логин" value={username} onChange={setUsername} />
            <TextField label="Пароль" value={password} onChange={setPassword} type="password" />
            <button onClick={login} disabled={busy} className="rounded-lg bg-[#f3a51d] px-5 py-3 text-sm font-black text-[#172033] disabled:opacity-50">
              Войти
            </button>
            {status && <p className="text-sm font-bold text-[#087bd3]">{status}</p>}
          </div>
        </section>
      </main>
    );
  }

  const audioCount = speaking.filter((row) => text(row.audio_url)).length;

  return (
    <main className="min-h-[100dvh] bg-[#f6f2ea] text-[#172033]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#f6f2ea]/90 px-4 py-4 shadow-[0_18px_50px_rgba(31,45,70,0.08)] backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#087bd3]">Spoken English with Chris</p>
            <h1 className="mt-1 text-2xl font-black">Панель владельца</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" target="_blank" className="rounded-lg border border-[#087bd3]/18 bg-white/70 px-4 py-2.5 text-sm font-bold text-[#087bd3] transition hover:border-[#087bd3]">
              Открыть сайт
            </a>
            <button
              type="button"
              onClick={activeTab === "texts" ? saveTexts : () => loadAll()}
              disabled={busy}
              className="rounded-lg bg-[#f3a51d] px-5 py-2.5 text-sm font-extrabold text-[#172033] transition hover:bg-[#e69810] disabled:opacity-50"
            >
              {activeTab === "texts" ? "Сохранить тексты" : "Обновить"}
            </button>
            <button type="button" onClick={() => setToken("")} className="rounded-lg border border-[#172033]/12 bg-white/70 px-4 py-2.5 text-sm font-bold text-[#42506a] transition hover:text-[#172033]">
              Выйти
            </button>
          </div>
        </div>
        {status && <p className="mx-auto mt-3 max-w-[1440px] text-sm font-bold text-[#087bd3]">{status}</p>}
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="grid h-fit gap-2 rounded-lg border border-white/70 bg-white/58 p-2 shadow-sm md:sticky md:top-28">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                activeTab === tab.key ? "bg-[#087bd3] text-white" : "text-[#42506a] hover:bg-white hover:text-[#087bd3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Заявки" value={leads.length} />
            <Metric label="Тесты" value={tests.length} />
            <Metric label="Speaking" value={speaking.length} />
            <Metric label="Голосовые" value={audioCount} />
          </div>

          {activeTab === "bot" && <BotAdmin token={token} />}

          {activeTab === "texts" && (
            <Card title="Редактирование всех текстов">
              <div className="flex w-fit rounded-full bg-[#f6f2ea] p-1 text-sm font-black shadow-sm">
                {(["ru", "en"] as LangKey[]).map((item) => (
                  <button key={item} type="button" onClick={() => setLang(item)} className={`rounded-full px-4 py-2 ${lang === item ? "bg-[#f3a51d]" : ""}`}>
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
              <TextTree value={siteContent[lang]} onChange={(next) => setSiteContent({ ...siteContent, [lang]: next })} />
            </Card>
          )}

          {activeTab === "leads" && <Rows title="Заявки с сайта" empty="Заявок пока нет" rows={leads} kind="lead" />}
          {activeTab === "tests" && <Rows title="Люди, прошедшие тест" empty="Результатов тестов пока нет" rows={tests} kind="test" />}
          {activeTab === "speaking" && <Rows title="Speaking test и голосовые" empty="Speaking-заявок пока нет" rows={speaking} kind="speaking" />}

          {activeTab === "export" && (
            <Card title="CSV export">
              <div className="flex flex-wrap gap-3">
                <ExportLink table="leads">Export leads CSV</ExportLink>
                <ExportLink table="test_results">Export tests CSV</ExportLink>
                <ExportLink table="speaking_submissions">Export speaking CSV</ExportLink>
              </div>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

function useRows(data: Record<string, unknown> | null, key: string) {
  return useMemo(() => {
    const rows = data?.[key];
    return Array.isArray(rows) ? (rows as Row[]) : [];
  }, [data, key]);
}

function Rows({ title, empty, rows, kind }: { title: string; empty: string; rows: Row[]; kind: "lead" | "test" | "speaking" }) {
  return (
    <Card title={title}>
      {rows.length ? rows.map((row) => <PersonCard key={String(row.id ?? JSON.stringify(row))} row={row} kind={kind} />) : <p className="rounded-lg bg-[#f6f2ea] px-4 py-6 text-center font-bold text-[#42506a]">{empty}</p>}
    </Card>
  );
}

function TextTree({ value, onChange }: { value: unknown; onChange: (value: unknown) => void }) {
  if (typeof value === "string") return <TextareaValue value={value} onChange={onChange} />;

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      return <TextareaValue value={value.join("\n")} onChange={(next) => onChange(next.split("\n").filter(Boolean))} />;
    }
    if (value.every((item) => Array.isArray(item))) {
      return <TextareaValue value={(value as string[][]).map((item) => item.join(" | ")).join("\n")} onChange={(next) => onChange(next.split("\n").filter(Boolean).map((line) => line.split(" | ")))} />;
    }
  }

  if (value && typeof value === "object") {
    return (
      <div className="grid gap-4">
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className="grid gap-2 rounded-lg border border-[#172033]/10 bg-[#f6f2ea] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#087bd3]">{key}</p>
            <TextTree value={item} onChange={(next) => onChange({ ...(value as Record<string, unknown>), [key]: next })} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function PersonCard({ row, kind }: { row: Row; kind: "lead" | "test" | "speaking" }) {
  const name = text(row.name) || "Без имени";
  const contact = text(row.contact) || text(row.telegram);
  const audioUrl = text(row.audio_url);

  return (
    <article className="rounded-lg border border-[#172033]/10 bg-[#f6f2ea] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-black">{name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold text-[#42506a]">
            {contact ? <ContactLink value={contact} /> : <span>Контакт не указан</span>}
            {row.created_at ? <span>{formatDate(row.created_at)}</span> : null}
          </div>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-[#087bd3]">
          {kind === "test" ? text(row.kind) || "test" : kind}
        </span>
      </div>
      {kind === "test" && <p className="mt-4 text-sm font-bold text-[#42506a]">Score: <span className="text-[#172033]">{text(row.score) || "не указан"}</span></p>}
      {kind === "speaking" && (
        <div className="mt-4 grid gap-3">
          <p className="text-sm font-bold text-[#42506a]">Тема: <span className="text-[#172033]">{text(row.topic) || "не указана"}</span></p>
          {audioUrl ? <audio controls src={audioUrl} className="w-full" /> : <p className="rounded-lg bg-white/70 px-4 py-3 text-sm font-bold text-[#42506a]">Голосовой файл не загружен</p>}
        </div>
      )}
      {kind === "lead" && text(row.message) && <p className="mt-4 text-sm font-bold text-[#42506a]">{text(row.message)}</p>}
    </article>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/72 p-5 shadow-[0_18px_46px_rgba(31,45,70,0.09)]">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/72 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#087bd3]">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#42506a]">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-[#172033]/12 bg-white px-4 py-3 text-[#172033] outline-none transition focus:border-[#087bd3]" />
    </label>
  );
}

function TextareaValue({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 resize-y rounded-lg border border-[#172033]/12 bg-white px-4 py-3 text-[#172033] outline-none transition focus:border-[#087bd3]" />;
}

function ContactLink({ value }: { value: string }) {
  const href = contactHref(value);
  return href ? <a href={href} target="_blank" className="text-[#087bd3] underline underline-offset-4">{value}</a> : <span>{value}</span>;
}

function ExportLink({ table, children }: { table: string; children: React.ReactNode }) {
  return <a href={`/api/admin/export?table=${table}`} className="rounded-lg border border-[#087bd3]/18 bg-white/70 px-4 py-3 text-sm font-bold text-[#087bd3] transition hover:border-[#087bd3]">{children}</a>;
}

function text(value: unknown) {
  return value == null ? "" : String(value);
}

function contactHref(value: string) {
  if (value.startsWith("@")) return `https://t.me/${value.slice(1)}`;
  if (value.startsWith("+")) return `tel:${value.replace(/[^\d+]/g, "")}`;
  if (value.includes("@")) return `mailto:${value}`;
  if (value.startsWith("http")) return value;
  return "";
}

function formatDate(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("ru-RU");
}
