"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  GlobeHemisphereWest,
  GraduationCap,
  List,
  PaperPlaneTilt,
  TelegramLogo,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  contacts,
  content,
  getLevelClubId,
  grammarQuestions,
  Lang,
  navLinks,
  speakingClubGroups,
  testCategories,
  TestKind,
  vocabularyQuestions,
} from "@/lib/site";
import { useAdaptiveTest } from "@/lib/use-adaptive-test";
import type { SiteContent } from "@/lib/site-overrides";
import { OfferStrip } from "@/components/OfferStrip";

export function TestsPage({ lang, initialLevel, initialClubId, siteContent = content }: { lang: Lang; initialLevel?: string; initialClubId?: number; siteContent?: SiteContent }) {
  const copy = siteContent[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTest, setActiveTest] = useState<TestKind | null>(null);
  const [detectedLevel, setDetectedLevel] = useState<string | null>(initialLevel ?? null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detectedLevel && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [detectedLevel]);

  const recommendedClub = detectedLevel
    ? speakingClubGroups.find((group) => group.id === (initialClubId ?? getLevelClubId(detectedLevel)))
    : null;

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-24 text-[#172033]">
      <TestsBackground />
      <PageHeader lang={lang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <OfferStrip offers={copy.offers} />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 sm:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Link
            href={lang === "en" ? "/en" : "/"}
            className="inline-flex items-center gap-2 text-sm font-black text-[#087bd3] transition hover:text-[#9b5f08]"
          >
            <ArrowLeft size={16} weight="bold" />
            {lang === "ru" ? "На главную" : "Back to Home"}
          </Link>

          <h1 className="mt-6 max-w-[720px] text-5xl font-black leading-[0.98] tracking-tight text-[#087bd3] sm:text-6xl lg:text-7xl">
            {lang === "ru" ? "Тесты и подготовка" : "Tests & Preparation"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#42506a] sm:text-xl">
            {lang === "ru"
              ? "Пройдите тест, узнайте свой уровень и запишитесь в подходящую группу Speaking Club."
              : "Take a test, discover your level, and join the right Speaking Club group."}
          </p>
        </motion.div>
      </section>

      {/* Detected Level / Recommended Club */}
      {detectedLevel && recommendedClub && (
        <section ref={resultsRef} className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[32px] border-2 border-[#f3a51d]/40 bg-gradient-to-br from-[#fff9e8] to-white p-6 shadow-[0_24px_70px_rgba(243,165,29,0.18)] sm:p-10"
          >
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9b5f08]">
              {lang === "ru" ? "Ваш результат" : "Your Result"}
            </p>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
                  {lang === "ru" ? "Ваш уровень" : "Your Level"}: {detectedLevel}
                </h2>
                <p className="mt-3 text-lg leading-8 text-[#42506a]">
                  {lang === "ru"
                    ? `Мы рекомендуем вам ${recommendedClub.name[lang]} (${recommendedClub.subtitle[lang]})`
                    : `We recommend ${recommendedClub.name[lang]} (${recommendedClub.subtitle[lang]})`}
                </p>
              </div>
              <motion.a
                href={contacts.trialUrl}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-8 py-4 text-lg font-black text-[#172033] shadow-[0_18px_40px_rgba(243,165,29,0.28)]"
              >
                {lang === "ru" ? `Записаться в ${recommendedClub.name[lang]}` : `Join ${recommendedClub.name[lang]}`}
                <ArrowRight size={18} weight="bold" />
              </motion.a>
            </div>

            {/* Sign-up form */}
            <SignUpForm lang={lang} club={recommendedClub} level={detectedLevel} />
          </motion.div>
        </section>
      )}

      {/* Quick Tests Section */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-black tracking-tight text-[#087bd3] sm:text-4xl">
          {lang === "ru" ? "Определите свой уровень" : "Determine Your Level"}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#42506a]">
          {lang === "ru"
            ? "Пройдите один из тестов и мы определим ваш уровень английского."
            : "Take one of our tests and we'll determine your English level."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(["grammar", "vocabulary", "speaking"] as TestKind[]).map((kind, index) => (
            <motion.button
              key={kind}
              type="button"
              onClick={() => {
                if (kind === "speaking") {
                  window.location.assign(`${lang === "en" ? "/en" : "/"}#tests`);
                  return;
                }
                setActiveTest(kind);
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className={[
                "rounded-[22px] border p-6 text-left shadow-[0_14px_34px_rgba(31,45,70,0.08)]",
                index === 0 ? "border-[#f3a51d]/30 bg-[#fff9e8]" : "",
                index === 1 ? "border-[#087bd3]/18 bg-white/76" : "",
                index === 2 ? "border-[#172033]/12 bg-[#edf7ff]" : "",
              ].join(" ")}
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#087bd3] text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="text-xl font-black text-[#172033]">{copy.testLabels[kind]}</h3>
              <p className="mt-2 text-sm leading-6 text-[#42506a]">
                {kind === "grammar"
                  ? (lang === "ru" ? "12 адаптивных вопросов" : "12 adaptive questions")
                  : kind === "vocabulary"
                    ? (lang === "ru" ? "12 адаптивных вопросов" : "12 adaptive questions")
                    : (lang === "ru" ? "Запишите голос и получите обратную связь" : "Record your voice and get feedback")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#087bd3]">
                {lang === "ru" ? "Начать" : "Start"} <ArrowRight size={14} weight="bold" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Exam Preparation */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-black tracking-tight text-[#087bd3] sm:text-4xl">
          {testCategories.exams.title[lang]}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testCategories.exams.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="rounded-[22px] border border-white/70 bg-white/66 p-6 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#087bd3]/10 text-[#087bd3]">
                <BookOpenText size={28} weight="bold" />
              </span>
              <h3 className="text-xl font-black text-[#172033]">{item.name[lang]}</h3>
              <p className="mt-3 leading-7 text-[#42506a]">{item.description[lang]}</p>
              <motion.a
                href={contacts.trialUrl}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f3a51d] px-5 py-3 font-black text-[#172033]"
              >
                {lang === "ru" ? "Записаться" : "Sign Up"} <ArrowRight size={14} weight="bold" />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-black tracking-tight text-[#087bd3] sm:text-4xl">
          {testCategories.goals.title[lang]}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {testCategories.goals.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="overflow-hidden rounded-[28px] border border-white/70 bg-[#172033] p-6 text-white shadow-[0_24px_60px_rgba(23,32,51,0.18)] sm:p-8"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f3a51d]/20 text-[#f3a51d]">
                {item.id === "travel" ? <GlobeHemisphereWest size={28} weight="bold" /> : <GraduationCap size={28} weight="bold" />}
              </span>
              <h3 className="text-2xl font-black">{item.name[lang]}</h3>
              <p className="mt-3 leading-7 text-white/70">{item.description[lang]}</p>
              <motion.a
                href={contacts.trialUrl}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f3a51d] px-6 py-3.5 font-black text-[#172033]"
              >
                {lang === "ru" ? "Записаться на подготовку" : "Start Preparation"} <ArrowRight size={16} weight="bold" />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Level Reference */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-black tracking-tight text-[#087bd3] sm:text-4xl">
          {lang === "ru" ? "Уровни английского" : "English Levels"}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#42506a]">
          {lang === "ru"
            ? "6 уровней владения английским языком по международной шкале CEFR"
            : "6 English proficiency levels according to the CEFR international scale"}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {speakingClubGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-[20px] border border-white/70 bg-white/66 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#087bd3] text-xs font-black text-white">
                  {group.level}
                </span>
                <div>
                  <p className="font-black text-[#172033]">{group.subtitle[lang]}</p>
                  <p className="text-sm text-[#42506a]">{group.name[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Test Modal */}
      <AnimatePresence>
        {activeTest && (
          <TestInlineModal
            lang={lang}
            kind={activeTest}
            onClose={() => setActiveTest(null)}
            onResult={(level) => {
              setDetectedLevel(level);
              setActiveTest(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── Sign-up form ── */
function SignUpForm({ lang, club, level }: { lang: Lang; club: (typeof speakingClubGroups)[number]; level: string }) {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit() {
    setStatus(lang === "ru" ? "Отправка..." : "Sending...");
    try {
      const res = await fetch("/api/speaking-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: telegram,
          level,
          clubId: club.id,
          clubName: club.name[lang],
          source: "tests-page",
        }),
      });
      setStatus(res.ok ? (lang === "ru" ? "Отправлено! Крис свяжется с вами." : "Sent! Chris will contact you.") : (lang === "ru" ? "Не удалось отправить. Попробуйте ещё раз." : "Could not send. Please try again."));
    } catch {
      setStatus(lang === "ru" ? "Нет связи с сервером. Попробуйте ещё раз." : "Server unavailable. Please try again.");
    }
  }

  return (
    <div className="mt-6 grid gap-3 rounded-[22px] bg-white/80 p-5 sm:grid-cols-[1fr_1fr_auto]">
      <label className="grid gap-2 font-black">
        {lang === "ru" ? "Имя" : "Name"}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4"
          placeholder={lang === "ru" ? "Ваше имя" : "Your name"}
        />
      </label>
      <label className="grid gap-2 font-black">
        Telegram
        <input
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4"
          placeholder="@username"
        />
      </label>
      <div className="flex items-end">
        <button
          type="button"
          disabled={!name || !telegram}
          onClick={handleSubmit}
          className="min-h-12 rounded-full bg-[#087bd3] px-6 font-black text-white disabled:opacity-40"
        >
          {lang === "ru" ? "Отправить" : "Send"}
        </button>
      </div>
      {status && <p className="font-bold text-[#42506a] sm:col-span-3" role="status">{status}</p>}
    </div>
  );
}

/* ── Inline test modal (grammar / vocabulary / speaking) ── */
function TestInlineModal({
  lang,
  kind,
  onClose,
  onResult,
}: {
  lang: Lang;
  kind: TestKind;
  onClose: () => void;
  onResult: (level: string) => void;
}) {
  const copy = content[lang];
  const closeRef = useRef<HTMLButtonElement>(null);
  const questions = kind === "grammar" ? grammarQuestions : vocabularyQuestions;
  const isQuiz = kind === "grammar" || kind === "vocabulary";
  const quiz = useAdaptiveTest(questions);

  async function saveFinishedTest(result: NonNullable<ReturnType<typeof quiz.advance>>) {
    await fetch("/api/test-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        score: result.history.filter((answer) => answer.correct).length,
        payload: {
          level: result.level,
          adaptive: true,
          answers: result.history.map((answer) => ({
            questionId: answer.question.id,
            difficulty: answer.question.difficulty,
            selected: answer.selected,
            correct: answer.correct,
          })),
        },
      }),
    }).catch(() => undefined);
  }

  useEffect(() => {
    window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isQuiz) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#172033]/48 p-3 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        className="max-h-[88dvh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-[#f6f2ea] shadow-[0_30px_100px_rgba(23,32,51,0.34)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/70 bg-white/55 p-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9b5f08]">{copy.testsTitle}</p>
            <h2 className="mt-1 text-3xl font-black text-[#087bd3]">{copy.testLabels[kind]}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#087bd3] shadow-sm"
            aria-label={copy.modal.close}
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <div className="max-h-[calc(88dvh-96px)] overflow-auto p-5 sm:p-7">
          {!quiz.finished ? (
            <>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#f3a51d] transition-all"
                  style={{ width: `${((quiz.step + 1) / quiz.total) * 100}%` }}
                />
              </div>
              <p className="text-sm font-black text-[#42506a]">
                {quiz.step + 1} / {quiz.total}
              </p>
              <h3 className="mt-2 text-2xl font-black leading-snug text-[#172033]">{quiz.current.q}</h3>
              <div className="mt-5 grid gap-3">
                {quiz.current.options.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-[18px] border p-4 font-bold transition ${
                      quiz.selected === option
                        ? "border-[#f3a51d] bg-white shadow-[0_12px_30px_rgba(243,165,29,0.18)]"
                        : "border-white/80 bg-white/64 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${quiz.step}`}
                      checked={quiz.selected === option}
                      onChange={() => quiz.setSelected(option)}
                      className="h-5 w-5 accent-[#f3a51d]"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <span />
                <button
                  type="button"
                  disabled={!quiz.selected}
                  onClick={() => {
                    const result = quiz.advance();
                    if (result?.finished) void saveFinishedTest(result);
                  }}
                  className="min-h-11 rounded-full bg-[#f3a51d] px-5 font-black text-[#172033] disabled:opacity-40"
                >
                  {quiz.step === quiz.total - 1 ? copy.modal.finish : copy.modal.next}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="rounded-[24px] bg-white/75 p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9b5f08]">{copy.modal.result}</p>
                <p className="mt-2 text-5xl font-black text-[#087bd3]">
                  {quiz.score}/{quiz.total}
                </p>
                <p className="mt-2 text-xl font-black">{copy.modal.level}: {quiz.level}</p>
              </div>
              <div className="mt-5 grid gap-3">
                {quiz.history.map((answer) => (
                  <div key={answer.question.id} className="rounded-[18px] bg-white/70 p-4">
                    <p className="font-black">{answer.question.q}</p>
                    <p className="mt-2 text-sm font-semibold text-[#42506a]">
                      {answer.correct ? "Correct" : `Correct: ${answer.question.answer}`}. {answer.question.explain}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onResult(quiz.level)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
                >
                  {lang === "ru"
                    ? `Записаться в Speaking Club`
                    : `Join Speaking Club`}{" "}
                  <ArrowRight size={18} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-[#087bd3]/18 bg-white/80 px-6 py-4 font-bold text-[#087bd3]"
                >
                  {copy.modal.close}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Shared components ── */
function TestsBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f6f2ea]" />
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(243,165,29,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(243,165,29,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.78),rgba(246,242,234,0.62)_38%,rgba(243,165,29,0.1)_62%,rgba(8,123,211,0.08))]" />
    </div>
  );
}

function PageHeader({
  lang,
  menuOpen,
  setMenuOpen,
}: {
  lang: Lang;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) {
  const copy = content[lang];
  const links = copy.nav.map((label, index) => {
    const navItem = navLinks[index];
    return {
      label,
      href: navItem.type === "page" ? `${lang === "en" ? "/en" : ""}${navItem.href}` : `/${lang === "en" ? "en" : ""}#${navItem.id}`,
    };
  });

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-white/55 bg-[#f6f2ea]/86 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href={lang === "en" ? "/en" : "/"} className="flex min-w-0 items-center gap-3 font-bold text-[#087bd3]">
          <Image
            src="/chris-logo.png"
            alt="Spoken English with Chris logo"
            width={52}
            height={52}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span>{copy.brand}</span>
            <span className="mt-0.5 text-[10px] font-black text-[#1f7a3c]">{copy.statusOn}</span>
          </span>
        </Link>
        <div className="hidden items-center gap-4 text-sm font-black text-[#087bd3] lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#9b5f08]">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch lang={lang} />
          <a href={`tel:${contacts.phone}`} className="text-sm font-black text-[#087bd3]">
            {contacts.phone}
          </a>
          <a
            href={contacts.telegramChannel}
            aria-label="Telegram channel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#087bd3] shadow-sm transition hover:bg-[#f3a51d]"
          >
            <PaperPlaneTilt size={18} weight="bold" />
          </a>
          <a
            href={contacts.telegramPersonal}
            aria-label="Chris Telegram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#087bd3] shadow-sm transition hover:bg-[#f3a51d]"
          >
            <TelegramLogo size={18} weight="bold" />
          </a>
          <motion.a
            href={contacts.trialUrl}
            whileHover={{ y: -2, scale: 1.025 }}
            whileTap={{ y: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="rounded-full bg-[#f3a51d] px-4 py-2 text-sm font-bold text-[#172033] shadow-[0_10px_24px_rgba(243,165,29,0.28)]"
          >
            {copy.book}
          </motion.a>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#087bd3] shadow-sm lg:hidden"
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/70 bg-[#f6f2ea] lg:hidden"
          >
            <div className="grid gap-3 px-5 py-5 font-black text-[#087bd3]">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <LangSwitch lang={lang} />
              <a href={`tel:${contacts.phone}`}>{contacts.phone}</a>
              <motion.a
                href={contacts.trialUrl}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="inline-flex items-center justify-center rounded-full bg-[#f3a51d] px-5 py-3 text-[#172033]"
              >
                {copy.trial}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 text-sm font-black shadow-sm">
      <Link className={`rounded-full px-3 py-2 ${lang === "ru" ? "bg-[#f3a51d]" : ""}`} href="/tests">
        RU
      </Link>
      <Link className={`rounded-full px-3 py-2 ${lang === "en" ? "bg-[#f3a51d]" : ""}`} href="/en/tests">
        EN
      </Link>
    </div>
  );
}
