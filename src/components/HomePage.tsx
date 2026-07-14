"use client";

import { createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CaretDown,
  ChatsCircle,
  CheckCircle,
  EnvelopeSimple,
  InstagramLogo,
  List,
  Microphone,
  PaperPlaneTilt,
  Phone,
  Shuffle,
  TelegramLogo,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  contacts,
  content,
  grammarQuestions,
  Lang,
  navIds,
  speakingTopics,
  TestKind,
  vocabularyQuestions,
} from "@/lib/site";
import type { SiteContent } from "@/lib/site-overrides";

type VocabKey = "translating" | "confidence" | "conversation";

const vocabNotes: Record<VocabKey, string> = {
  translating: "When you build a sentence in Russian first, then change it into English. Chris helps you skip that step.",
  confidence: "Feeling calm because you know you can try.",
  conversation: "Speaking and listening with another person.",
};

const challengeWords = [
  {
    word: "passport",
    answer: "It's an official document you use when you travel abroad.",
    ru: "Это официальный документ для поездок за границу.",
  },
  {
    word: "appointment",
    answer: "It's a planned time to meet someone or visit a place.",
    ru: "Это заранее назначенное время для встречи или визита.",
  },
];

const SiteContentContext = createContext<SiteContent>(content);

function useSiteCopy(lang: Lang) {
  return useContext(SiteContentContext)[lang];
}

export function HomePage({ lang, siteContent = content }: { lang: Lang; siteContent?: SiteContent }) {
  const copy = siteContent[lang];
  const isRussian = lang === "ru";
  const [activeVocab, setActiveVocab] = useState<VocabKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testOpen, setTestOpen] = useState<TestKind | null>(null);

  const toggleVocab = (id: VocabKey) => {
    setActiveVocab((current) => (current === id ? null : id));
  };

  return (
    <SiteContentContext.Provider value={siteContent}>
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-48 text-[#172033] sm:pb-36">
      <TeachingBackground />
      <Header lang={lang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Section id="top" className="pt-24 sm:pt-28">
        <div className="grid min-h-[calc(100dvh-96px)] items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="max-w-[780px] text-5xl font-black leading-[0.98] tracking-tight text-[#087bd3] sm:text-6xl lg:text-7xl">
              {isRussian ? (
                copy.heroTitle
              ) : (
                <>
                  Speak English Naturally Without{" "}
                  <VocabWord
                    id="translating"
                    active={activeVocab === "translating"}
                    onToggle={toggleVocab}
                  >
                    Translating
                  </VocabWord>{" "}
                  in Your Head
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#42506a] sm:text-xl">
              {isRussian ? (
                copy.heroText
              ) : (
                <>
                  Practice{" "}
                  <VocabWord
                    id="conversation"
                    active={activeVocab === "conversation"}
                    onToggle={toggleVocab}
                  >
                    real conversation
                  </VocabWord>{" "}
                  with a native English speaker. Learn to explain your ideas and speak with{" "}
                  <VocabWord
                    id="confidence"
                    active={activeVocab === "confidence"}
                    onToggle={toggleVocab}
                  >
                    more confidence
                  </VocabWord>
                  .
                </>
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MotionButton
                href={contacts.trialUrl}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-bold text-[#172033] shadow-[0_18px_40px_rgba(243,165,29,0.28)]"
              >
                {copy.trial} <ArrowRight size={18} weight="bold" />
              </MotionButton>
              <MotionButton
                href="#club"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#087bd3]/18 bg-white/80 px-6 py-4 font-bold text-[#087bd3]"
              >
                <ChatsCircle size={20} weight="bold" /> {copy.clubCta}
              </MotionButton>
            </div>
            <MotionCard className="mt-6 max-w-sm rounded-[20px] border-l-4 border-[#f3a51d] bg-white/62 px-5 py-4 shadow-sm">
              <blockquote className="text-xl font-black text-[#087bd3]">{copy.quote}</blockquote>
              <figcaption className="mt-1 text-sm font-semibold text-[#42506a]">
                {copy.quoteCaption}
              </figcaption>
            </MotionCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-[28px] bg-[#f3a51d]/75 blur-2xl" />
            <HeroMedia />
          </motion.div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.problems.map((problem, index) => (
            <MotionCard
              key={problem}
              className="rounded-[22px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04 }}
                className="text-lg font-bold leading-snug text-[#1f2c45]"
              >
                {problem}
              </motion.p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section id="method" className="py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <MotionCard className="rounded-[30px] border border-white/70 bg-white/68 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9b5f08]">
              {copy.lessonLabel}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#087bd3] sm:text-4xl">
              {copy.umbrellaTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#42506a]">
              {copy.umbrellaIntro} <span className="font-black text-[#172033]">{copy.umbrellaWord}</span>.
            </p>
            <div className="mt-6 rounded-[22px] bg-[#172033] p-5 text-white">
              <p className="text-sm font-bold text-[#f3a51d]">{copy.youCanSay}</p>
              <p className="mt-2 text-2xl font-black leading-snug">{copy.umbrellaAnswer}</p>
            </div>
          </MotionCard>

          <div className="grid gap-3">
            {copy.styleCards.map((prompt) => (
              <MotionCard
                key={prompt}
                className="rounded-[22px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
              >
                <p className="text-lg font-black leading-snug text-[#20304b]">{prompt}</p>
              </MotionCard>
            ))}
          </div>
        </div>
      </Section>

      <Section id="tests" className="py-10">
        <ExplainChallenge lang={lang} onOpenTest={setTestOpen} />
      </Section>

      <Section id="about" className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
              {copy.aboutTitle}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.facts.map((fact) => (
                <MotionCard
                  key={fact}
                  className="flex min-h-[92px] items-center justify-center rounded-full bg-white/66 px-5 py-4 text-center text-lg font-bold leading-snug text-[#24334f] shadow-sm"
                >
                  {fact}
                </MotionCard>
              ))}
            </div>
          </div>
          <MotionCard className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#172033] p-4 shadow-[0_24px_60px_rgba(23,32,51,0.18)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-white">
              <div className="flex h-full w-full items-center justify-center bg-[#f8f4ed] text-[#087bd3]">
                <Microphone size={72} weight="light" />
              </div>
            </div>
          </MotionCard>
        </div>
      </Section>

      <Section id="club" className="py-10">
        <div className="overflow-hidden rounded-[32px] bg-[#172033] p-6 text-white shadow-[0_30px_90px_rgba(23,32,51,0.2)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f3a51d]">
                Speaking Club
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {copy.clubTitleBefore}
              </h2>
              <MotionButton
                href={contacts.trialUrl}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
              >
                {copy.clubCta} <ArrowRight size={18} weight="bold" />
              </MotionButton>
            </div>
            <div className="grid gap-3">
              {copy.clubPoints.map((point) => (
                <MotionCard
                  key={point}
                  className="flex items-center justify-between rounded-[20px] border border-white/14 bg-white/10 px-5 py-4"
                >
                  <span className="font-bold">{point}</span>
                  <CheckCircle size={22} weight="fill" className="text-[#f3a51d]" />
                </MotionCard>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <h2 className="max-w-2xl text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
          {copy.resultsTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.results.map((result, index) => (
            <MotionCard
              key={result}
              className={[
                "rounded-[22px] border p-5 shadow-[0_16px_40px_rgba(31,45,70,0.08)]",
                index === 0 ? "border-[#087bd3]/18 bg-white/72" : "",
                index === 1 ? "border-[#f3a51d]/28 bg-[#fff9e8]" : "",
                index === 2 ? "border-[#172033]/12 bg-[#eef7ff]" : "",
              ].join(" ")}
            >
              <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#087bd3] text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="font-black leading-7 text-[#20304b]">{result}</p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section id="prices" className="py-10">
        <h2 className="text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
          {copy.pricesTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {copy.prices.map(([name, price], index) => (
            <MotionCard
              key={name}
              className={[
                "rounded-[22px] border p-6 shadow-[0_16px_40px_rgba(31,45,70,0.08)]",
                index === 0 ? "border-[#f3a51d]/30 bg-[#fff8df]" : "",
                index === 1 ? "border-[#087bd3]/18 bg-white/76 md:translate-y-4" : "",
                index === 2 ? "border-[#172033]/12 bg-[#edf7ff]" : "",
                index === 3 ? "border-white/70 bg-white/70 md:translate-y-4" : "",
              ].join(" ")}
            >
              <p className="mb-8 text-xs font-black uppercase tracking-[0.12em] text-[#42506a]">
                {index === 0 ? "Start" : index === 1 ? "1:1" : index === 2 ? "Group" : "Plan"}
              </p>
              <h3 className="text-xl font-black text-[#087bd3]">{name}</h3>
              <p className="mt-8 text-2xl font-black text-[#172033]">{price}</p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
            {copy.faqTitle}
          </h2>
          <div className="grid gap-3">
            {copy.faq.map(([question, answer]) => (
              <FaqItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </Section>

      <Section id="contacts" className="py-12">
        <div className="rounded-[32px] border border-white/80 bg-white/72 p-6 text-center shadow-[0_24px_70px_rgba(31,45,70,0.12)] sm:p-10">
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-[#087bd3] sm:text-6xl">
            {copy.finalTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MotionButton
              href={contacts.trialUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
            >
              {copy.trial} <ArrowRight size={18} weight="bold" />
            </MotionButton>
            <MotionButton
              href={contacts.telegramPersonal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172033] px-6 py-4 font-black text-white"
            >
              {copy.telegram} <TelegramLogo size={20} weight="bold" />
            </MotionButton>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold text-[#24334f]">
            <ContactButton href={`tel:${contacts.phone}`} icon={<Phone size={18} weight="bold" />} label={contacts.phone} />
            <ContactButton href={contacts.telegramChannel} icon={<PaperPlaneTilt size={18} weight="bold" />} label="Telegram Channel" />
            <ContactButton href={contacts.whatsapp} icon={<WhatsappLogo size={18} weight="bold" />} label="WhatsApp" />
            <ContactButton href={contacts.instagram} icon={<InstagramLogo size={18} weight="bold" />} label="Instagram" />
            <ContactButton href={`mailto:${contacts.email}`} icon={<EnvelopeSimple size={18} weight="bold" />} label={contacts.email} />
          </div>
          <Link href="/admin" className="mt-8 inline-block text-xs font-bold text-[#42506a]/45 transition hover:text-[#087bd3]">
            Admin
          </Link>
        </div>
      </Section>

      <TestDock lang={lang} onOpen={setTestOpen} />
      {testOpen && (
        <TestModal key={testOpen} lang={lang} kind={testOpen} onClose={() => setTestOpen(null)} />
      )}
    </main>
    </SiteContentContext.Provider>
  );
}

function Header({
  lang,
  menuOpen,
  setMenuOpen,
}: {
  lang: Lang;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) {
  const copy = useSiteCopy(lang);
  const links = copy.nav.map((label, index) => ({ label, href: `#${navIds[index]}` }));

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-white/55 bg-[#f6f2ea]/86 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3 font-bold text-[#087bd3]">
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
        </a>
        <div className="hidden items-center gap-4 text-sm font-black text-[#087bd3] lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#9b5f08]">
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch lang={lang} />
          <a href={`tel:${contacts.phone}`} className="text-sm font-black text-[#087bd3]">
            {contacts.phone}
          </a>
          <IconLink href={contacts.telegramChannel} label="Telegram channel">
            <PaperPlaneTilt size={18} weight="bold" />
          </IconLink>
          <IconLink href={contacts.telegramPersonal} label="Chris Telegram">
            <TelegramLogo size={18} weight="bold" />
          </IconLink>
          <MotionButton
            href={contacts.trialUrl}
            className="rounded-full bg-[#f3a51d] px-4 py-2 text-sm font-bold text-[#172033] shadow-[0_10px_24px_rgba(243,165,29,0.28)]"
          >
            {copy.book}
          </MotionButton>
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
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <LangSwitch lang={lang} />
              <a href={`tel:${contacts.phone}`}>{contacts.phone}</a>
              <a href={contacts.telegramChannel}>Telegram Channel</a>
              <a href={contacts.telegramPersonal}>Chris Telegram</a>
              <MotionButton
                href={contacts.trialUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#f3a51d] px-5 py-3 text-[#172033]"
              >
                {copy.trial}
              </MotionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestModal({ lang, kind, onClose }: { lang: Lang; kind: TestKind; onClose: () => void }) {
  const copy = useSiteCopy(lang);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [topic, setTopic] = useState(speakingTopics[0]);
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [status, setStatus] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreview, setAudioPreview] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const questions = kind === "grammar" ? grammarQuestions : vocabularyQuestions;
  const isQuiz = kind === "grammar" || kind === "vocabulary";
  const score = useMemo(
    () => questions.filter((question, index) => answers[index] === question.answer).length,
    [answers, questions],
  );
  const level = score >= Math.ceil(questions.length * 0.8) ? "B1-B2" : score >= Math.ceil(questions.length * 0.55) ? "A2-B1" : "A1-A2";

  useEffect(() => {
    window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind, onClose]);

  async function submitLead(source: string, payload: Record<string, unknown>) {
    setStatus("Sending...");
    const endpoint = source === "speaking" ? "/api/speaking" : "/api/test-results";
    const options: RequestInit = { method: "POST" };
    if (source === "speaking") {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => form.append(key, String(value ?? "")));
      if (audioBlob) form.append("audio", audioBlob, "speaking-test.webm");
      options.body = form;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(payload);
    }
    const res = await fetch(endpoint, options);
    setStatus(res.ok ? "Saved" : "Saved locally after backend setup");
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Voice recording is not supported in this browser");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioPreview(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  const activeQuestion = questions[step];
  const canGoNext = !isQuiz || answers[step];

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
          {isQuiz ? (
            <div>
              {!finished ? (
                <>
                  <div className="mb-5 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#f3a51d] transition-all"
                      style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-black text-[#42506a]">
                    {step + 1} / {questions.length}
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-snug text-[#172033]">{activeQuestion.q}</h3>
                  <div className="mt-5 grid gap-3">
                    {activeQuestion.options.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-[18px] border p-4 font-bold transition ${
                          answers[step] === option
                            ? "border-[#f3a51d] bg-white shadow-[0_12px_30px_rgba(243,165,29,0.18)]"
                            : "border-white/80 bg-white/64 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${step}`}
                          checked={answers[step] === option}
                          onChange={() => setAnswers({ ...answers, [step]: option })}
                          className="h-5 w-5 accent-[#f3a51d]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between gap-3">
                    <button
                      type="button"
                      disabled={step === 0}
                      onClick={() => setStep((current) => Math.max(0, current - 1))}
                      className="min-h-11 rounded-full bg-white px-5 font-black disabled:opacity-40"
                    >
                      {copy.modal.back}
                    </button>
                    <button
                      type="button"
                      disabled={!canGoNext}
                      onClick={() => {
                        if (step === questions.length - 1) {
                          setFinished(true);
                          return;
                        }
                        setStep((current) => current + 1);
                      }}
                      className="min-h-11 rounded-full bg-[#f3a51d] px-5 font-black text-[#172033] disabled:opacity-40"
                    >
                      {step === questions.length - 1 ? copy.modal.finish : copy.modal.next}
                    </button>
                  </div>
                </>
              ) : (
                <ResultView
                  lang={lang}
                  kind={kind}
                  score={score}
                  level={level}
                  answers={answers}
                  name={name}
                  setName={setName}
                  contact={telegram}
                  setContact={setTelegram}
                  onSubmit={() => submitLead(kind, { kind, score, name, contact: telegram, payload: { answers } })}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="rounded-[22px] bg-white/70 p-5">
                <label className="text-sm font-black uppercase tracking-[0.12em] text-[#9b5f08]">
                  Topic
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="min-h-12 flex-1 rounded-2xl border border-[#087bd3]/12 bg-white px-4 font-bold"
                  >
                    {speakingTopics.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setTopic(speakingTopics[Math.floor(Math.random() * speakingTopics.length)])}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#f3a51d] px-4 font-black"
                  >
                    <Shuffle size={18} weight="bold" /> {copy.modal.randomTopic}
                  </button>
                </div>
              </div>
              <div className="rounded-[22px] border border-[#f3a51d]/30 bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#172033] text-white">
                    <Microphone size={26} weight="bold" />
                  </span>
                  <div>
                    <p className="font-black text-[#087bd3]">30-60 seconds</p>
                    <p className="text-sm font-semibold text-[#42506a]">{copy.modal.recordingReady}</p>
                  </div>
                </div>
                <p className="mt-5 rounded-2xl bg-[#f6f2ea] p-4 font-bold text-[#172033]">
                  {copy.modal.speakingNote}
                </p>
                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    className="min-h-12 rounded-full bg-[#087bd3] px-5 font-black text-white"
                  >
                    {recording ? "Stop recording" : audioBlob ? "Record again" : "Record voice"}
                  </button>
                  {audioPreview && <audio controls src={audioPreview} className="w-full" />}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 font-black">
                  {copy.modal.yourName}
                  <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4" />
                </label>
                <label className="grid gap-2 font-black">
                  {copy.modal.yourTelegram}
                  <input value={telegram} onChange={(e) => setTelegram(e.target.value)} className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4" />
                </label>
              </div>
              <button
                type="button"
                disabled={!name || !telegram || !audioBlob}
                onClick={() => submitLead("speaking", { name, telegram, topic, note: "Voice recording from speaking test" })}
                className="min-h-12 rounded-full bg-[#f3a51d] px-6 font-black text-[#172033] disabled:opacity-40"
              >
                {copy.modal.submit}
              </button>
            </div>
          )}
          {status && <p className="mt-4 font-bold text-[#42506a]" role="status">{status}</p>}
        </div>
      </motion.div>
    </div>
  );
}

function ResultView({
  lang,
  kind,
  score,
  level,
  answers,
  name,
  setName,
  contact,
  setContact,
  onSubmit,
}: {
  lang: Lang;
  kind: TestKind;
  score: number;
  level: string;
  answers: Record<number, string>;
  name: string;
  setName: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
  onSubmit: () => void;
}) {
  const copy = useSiteCopy(lang);
  const questions = kind === "grammar" ? grammarQuestions : vocabularyQuestions;
  return (
    <div>
      <div className="rounded-[24px] bg-white/75 p-5">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9b5f08]">{copy.modal.result}</p>
        <p className="mt-2 text-5xl font-black text-[#087bd3]">
          {score}/{questions.length}
        </p>
        <p className="mt-2 text-xl font-black">{copy.modal.level}: {level}</p>
        <p className="mt-3 font-semibold text-[#42506a]">
          {kind === "grammar"
            ? "Review the explanations below and try speaking the corrected sentences aloud."
            : "Focus on natural phrases and context, not direct translation."}
        </p>
      </div>
      <div className="mt-5 grid gap-3">
        {questions.map((question, index) => (
          <div key={question.q} className="rounded-[18px] bg-white/70 p-4">
            <p className="font-black">{question.q}</p>
            <p className="mt-2 text-sm font-semibold text-[#42506a]">
              {answers[index] === question.answer ? "Correct" : `Correct: ${question.answer}`}. {question.explain}
            </p>
          </div>
        ))}
      </div>
      <MotionButton
        href={contacts.trialUrl}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
      >
        {copy.trial} <ArrowRight size={18} weight="bold" />
      </MotionButton>
      <div className="mt-5 grid gap-3 rounded-[22px] bg-white/70 p-5 sm:grid-cols-2">
        <label className="grid gap-2 font-black">
          {copy.modal.yourName}
          <input value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4" />
        </label>
        <label className="grid gap-2 font-black">
          {copy.modal.yourTelegram}
          <input value={contact} onChange={(event) => setContact(event.target.value)} className="min-h-12 rounded-2xl border border-[#087bd3]/12 px-4" />
        </label>
        <button
          type="button"
          disabled={!contact}
          onClick={onSubmit}
          className="min-h-12 rounded-full bg-[#f3a51d] px-6 font-black text-[#172033] disabled:opacity-40 sm:col-span-2"
        >
          {copy.modal.submit}
        </button>
      </div>
    </div>
  );
}

function TestDock({ lang, onOpen }: { lang: Lang; onOpen: (kind: TestKind) => void }) {
  const labels = useSiteCopy(lang).testLabels;
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3">
      <div className="flex max-w-[calc(100vw-24px)] gap-1 rounded-full border border-white/50 bg-white/42 p-1.5 shadow-[0_18px_60px_rgba(23,32,51,0.18)] backdrop-blur-2xl">
        {(["grammar", "vocabulary", "speaking"] as TestKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => onOpen(kind)}
            className="min-h-11 rounded-full px-3 text-xs font-black text-[#172033] transition hover:bg-[#f3a51d] focus:outline-none focus:ring-2 focus:ring-[#087bd3] sm:px-5 sm:text-sm"
          >
            {labels[kind]}
          </button>
        ))}
      </div>
    </div>
  );
}

function VocabWord({
  id,
  active,
  onToggle,
  children,
}: {
  id: VocabKey;
  active: boolean;
  onToggle: (id: VocabKey) => void;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="decoration-[#f3a51d] decoration-2 underline-offset-4 transition hover:text-[#087bd3]"
        style={{ textDecorationLine: "underline" }}
      >
        {children}
      </button>
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-3 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[20px] border border-[#f3a51d]/30 bg-white px-4 py-3 text-left font-sans text-sm font-semibold normal-case leading-6 tracking-normal text-[#20304b] shadow-[0_18px_46px_rgba(31,45,70,0.18)]"
          >
            <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.12em] text-[#9b5f08]">
              Simple English
            </span>
            <span className="block">{vocabNotes[id]}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function TeachingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f6f2ea]" />
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(243,165,29,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(243,165,29,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.78),rgba(246,242,234,0.62)_38%,rgba(243,165,29,0.1)_62%,rgba(8,123,211,0.08))]" />
      <div className="absolute left-[-8%] top-[12%] h-[34rem] w-[34rem] rotate-[-12deg] rounded-[42%] border border-[#f3a51d]/20" />
      <div className="absolute right-[-10%] top-[34%] h-[30rem] w-[30rem] rotate-[18deg] rounded-[42%] border border-[#f3a51d]/18" />
    </div>
  );
}

function HeroMedia() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/58 p-3 shadow-[0_28px_80px_rgba(27,43,71,0.16)] backdrop-blur-xl lg:-mt-10 lg:ml-auto lg:max-w-[560px]">
      <div className="relative aspect-[4/4.2] overflow-hidden rounded-[22px] bg-[#f8f4ed]">
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/chris-logo.png"
            alt="Spoken English with Chris"
            width={720}
            height={720}
            className="h-full w-full object-contain p-6"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function ExplainChallenge({ lang, onOpenTest }: { lang: Lang; onOpenTest: (kind: TestKind) => void }) {
  const copy = useSiteCopy(lang);
  const [index, setIndex] = useState(0);
  const challenge = challengeWords[index];
  return (
    <MotionCard className="rounded-[30px] border border-white/70 bg-white/72 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9b5f08]">
        {copy.challengeTitle}
      </p>
      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#087bd3] sm:text-5xl">
            {copy.todayWord}: {challenge.word}
          </h2>
          <p className="mt-4 max-w-2xl text-xl font-bold text-[#42506a]">
            {lang === "ru" ? challenge.ru : challenge.answer}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % challengeWords.length)}
            className="min-h-12 rounded-full bg-white px-5 font-black text-[#087bd3]"
          >
            {copy.showAnswer}
          </button>
          <button
            type="button"
            onClick={() => onOpenTest("speaking")}
            className="min-h-12 rounded-full bg-[#f3a51d] px-5 font-black text-[#172033]"
          >
            {copy.testLabels.speaking}
          </button>
        </div>
      </div>
    </MotionCard>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <MotionCard className="rounded-[20px] border border-white/70 bg-white/66 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-black text-[#20304b]"
      >
        <span>{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <CaretDown size={20} weight="bold" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-7 text-[#42506a]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionCard>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

function MotionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MotionButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, scale: 1.025 }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

function ContactButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <MotionButton href={href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
      {icon} {label}
    </MotionButton>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#087bd3] shadow-sm transition hover:bg-[#f3a51d]"
    >
      {children}
    </a>
  );
}

function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 text-sm font-black shadow-sm">
      <Link className={`rounded-full px-3 py-2 ${lang === "ru" ? "bg-[#f3a51d]" : ""}`} href="/">
        RU
      </Link>
      <Link className={`rounded-full px-3 py-2 ${lang === "en" ? "bg-[#f3a51d]" : ""}`} href="/en/">
        EN
      </Link>
    </div>
  );
}
