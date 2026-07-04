"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChatsCircle,
  CheckCircle,
  EnvelopeSimple,
  InstagramLogo,
  PlayCircle,
  TelegramLogo,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type ReadingMode = "easy" | "standard" | "natural";

type VariantKey =
  | "confidence"
  | "heroNaturally"
  | "improve"
  | "explainIdeas"
  | "friendlyAtmosphere"
  | "realConversation"
  | "moreConfidence"
  | "nativeSpeakersBetter";

type VocabKey = "translating" | "confidence" | "pronunciation" | "conversation";

const textVariants: Record<VariantKey, Record<ReadingMode, string>> = {
  confidence: {
    easy: "feel sure",
    standard: "confidence",
    natural: "self-assurance",
  },
  heroNaturally: {
    easy: "More Easily",
    standard: "Naturally",
    natural: "Effortlessly",
  },
  improve: {
    easy: "get better",
    standard: "improve",
    natural: "sharpen",
  },
  explainIdeas: {
    easy: "say your ideas with simple words",
    standard: "explain your ideas",
    natural: "express your thoughts clearly",
  },
  friendlyAtmosphere: {
    easy: "kind and easy group",
    standard: "friendly atmosphere",
    natural: "supportive environment",
  },
  realConversation: {
    easy: "real speaking",
    standard: "real conversation",
    natural: "real-life conversation",
  },
  moreConfidence: {
    easy: "feel more sure",
    standard: "more confidence",
    natural: "stronger self-assurance",
  },
  nativeSpeakersBetter: {
    easy: "Understand native speakers more easily",
    standard: "Understand native speakers better",
    natural: "Follow native speakers with more ease",
  },
};

const vocabNotes: Record<VocabKey, string> = {
  translating: "Changing words from one language into another.",
  confidence: "Feeling calm because you know you can try.",
  pronunciation: "The way a word sounds when you say it.",
  conversation: "Speaking and listening with another person.",
};

const modes: ReadingMode[] = ["easy", "standard", "natural"];

const problems = [
  "I understand English, but I can't speak.",
  "I translate in my head.",
  "I forget words when I speak.",
  "I'm afraid to make mistakes.",
];

const teachingStyle = [
  "Chris encourages you to keep speaking.",
  "Don't stop. Keep talking.",
  "Say the whole sentence.",
  "It's okay if you make mistakes.",
  "The more you speak, the faster you improve.",
];

const facts = [
  "Native English speaker from Africa",
  "English-only lessons",
  "Online individual lessons",
  "Speaking Club host",
];

const clubPoints = [
  "Real topics",
  "Small groups",
  "Friendly atmosphere",
  "More speaking time",
];

const resultCards = [
  "Speak without translating every sentence",
  "Explain your thoughts in English",
  "Build confidence",
];

const prices = [
  ["Trial Lesson", "from ₽___"],
  ["Individual Lesson", "from ₽___"],
  ["Speaking Club", "from ₽___"],
  ["Monthly Package", "from ₽___"],
];

const faq = [
  [
    "Do I need a high level of English?",
    "No. You need enough English to try. Chris helps you speak with simple words first.",
  ],
  [
    "What if I don't know a word?",
    "You explain the idea with other English words, examples and situations.",
  ],
  [
    "Do you use Russian in lessons?",
    "No. Lessons stay in English, so your brain learns to react in English.",
  ],
];

const challengeWords = [
  {
    word: "umbrella",
    answer: "It's something you use when it rains.",
  },
  {
    word: "airport",
    answer: "It's a place where people take planes.",
  },
  {
    word: "passport",
    answer: "It's a small document you use to travel to another country.",
  },
  {
    word: "dentist",
    answer: "It's a doctor who helps with your teeth.",
  },
  {
    word: "elevator",
    answer: "It's a small room that takes you up or down in a building.",
  },
];

function AdaptiveText({
  id,
  mode,
  className,
}: {
  id: VariantKey;
  mode: ReadingMode;
  className?: string;
}) {
  return (
    <span className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${id}-${mode}`}
          initial={{
            opacity: 0,
            filter: "blur(6px)",
            backgroundColor: "rgba(243, 165, 29, 0.42)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            backgroundColor: "rgba(243, 165, 29, 0)",
          }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{
            opacity: { duration: 0.22, ease: "easeOut" },
            filter: { duration: 0.22, ease: "easeOut" },
            backgroundColor: { duration: 0.3, ease: "easeOut" },
          }}
          className="-mx-1 inline-block rounded-lg px-1"
        >
          {textVariants[id][mode]}
        </motion.span>
      </AnimatePresence>
    </span>
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
        className="decoration-[#f3a51d] decoration-2 underline-offset-4 hover:text-[#0b2d5c]"
        style={{ textDecorationLine: "underline" }}
      >
        {children}
      </button>
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl border border-white/80 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-[#20304b] shadow-[0_14px_34px_rgba(31,45,70,0.16)]"
          >
            {vocabNotes[id]}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReadingModeBar({
  mode,
  onChange,
}: {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.42 }}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-46px)] max-w-[304px] rounded-[22px] border border-white/55 bg-white/70 p-1 shadow-[0_10px_34px_rgba(16,31,61,0.14)] backdrop-blur-md supports-[backdrop-filter]:bg-white/58 sm:bottom-6"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] bg-[linear-gradient(90deg,rgba(255,255,255,0.24),transparent_50%,rgba(255,255,255,0.14))]" />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5">
        <div className="px-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#18345f] sm:pr-0 sm:text-[9px]">
          <span aria-hidden="true" className="mr-1">📖</span>
          Reading mode
        </div>
        <div className="grid flex-1 grid-cols-3 gap-0.5">
          {modes.map((item) => (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`relative h-7 rounded-full px-1.5 text-[11px] font-semibold capitalize transition active:scale-[0.98] ${
                mode === item
                  ? "text-white"
                  : "text-[#20324b] hover:bg-white/45"
              }`}
            >
              {mode === item && (
                <motion.span
                  layoutId="reading-mode-pill"
                  className="absolute inset-0 rounded-full bg-[#0b2d5c] shadow-[0_5px_14px_rgba(11,45,92,0.2)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HeroMedia({ videoSrc }: { videoSrc?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/58 p-4 shadow-[0_28px_80px_rgba(27,43,71,0.16)] backdrop-blur-xl">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#0b2d5c]">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster="/chris-logo.png"
          />
        ) : (
          <Image
            src="/chris-logo.png"
            alt="Spoken English with Chris brand mark"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 42vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b2d5c]/74 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-white/35 bg-white/18 p-4 text-white backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <PlayCircle size={32} weight="fill" />
            <div>
              <p className="font-bold">Welcome video ready</p>
              <p className="text-sm text-white/78">10 to 15 second loop slot.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeedHelp() {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setStep((current) => (current === 0 ? 1 : 2))}
        className="rounded-full border border-[#0b2d5c]/12 bg-white/72 px-4 py-2 text-sm font-black text-[#0b2d5c] shadow-sm transition hover:bg-white active:scale-[0.98]"
      >
        🇷🇺 Need help?
      </button>
      <AnimatePresence mode="wait">
        {step > 0 && (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.18 }}
            className="mt-3 max-w-md rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold leading-6 text-[#42506a]"
          >
            {step === 1
              ? "😊 Try to understand it in English first."
              : "Говори по-английски естественно, без перевода в голове."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExplainChallenge() {
  const [challenge, setChallenge] = useState(challengeWords[0]);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const next = challengeWords[Math.floor(Math.random() * challengeWords.length)];
    window.requestAnimationFrame(() => setChallenge(next));
  }, []);

  return (
    <div className="rounded-[30px] border border-white/70 bg-white/68 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
        Explain Challenge
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#42506a]">Today&apos;s word</p>
          <h2 className="text-5xl font-black tracking-tight text-[#0b2d5c]">
            {challenge.word}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShown(true)}
          className="rounded-full bg-[#0b2d5c] px-5 py-3 font-black text-white transition hover:bg-[#123d78] active:scale-[0.98]"
        >
          Show Chris&apos;s answer
        </button>
      </div>
      <AnimatePresence>
        {shown && (
          <motion.p
            initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="mt-5 rounded-[22px] bg-[#0b2d5c] p-5 text-2xl font-black leading-snug text-white"
          >
            &quot;{challenge.answer}&quot;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const [readingMode, setReadingMode] = useState<ReadingMode>("standard");
  const [activeVocab, setActiveVocab] = useState<VocabKey | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("readingMode");
    if (stored === "easy" || stored === "standard" || stored === "natural") {
      window.requestAnimationFrame(() => setReadingMode(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("readingMode", readingMode);
  }, [readingMode]);

  const toggleVocab = (id: VocabKey) => {
    setActiveVocab((current) => (current === id ? null : id));
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-28 text-[#172033]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/55 bg-[#f6f2ea]/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3 font-bold text-[#0b2d5c]">
            <Image
              src="/chris-logo.png"
              alt="Spoken English with Chris logo"
              width={52}
              height={52}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              priority
            />
            <span className="flex flex-col leading-tight">
              <span>Chris Matoz</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-black text-[#1f7a3c]">
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: [1, 1.25, 1], opacity: [1, 0.72, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🟢
                </motion.span>
                <span>English Only Mode: ON</span>
              </span>
            </span>
          </a>
          <a
            href="#contacts"
            className="rounded-full bg-[#f3a51d] px-4 py-2 text-sm font-bold text-[#172033] shadow-[0_10px_24px_rgba(243,165,29,0.28)] transition hover:bg-[#ffb637] active:scale-[0.98]"
          >
            Book
          </a>
        </nav>
      </div>

      <Section id="top" className="pt-24 sm:pt-28">
        <div className="grid min-h-[calc(100dvh-96px)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="max-w-[780px] text-5xl font-black leading-[0.96] tracking-tight text-[#0b2d5c] sm:text-6xl lg:text-7xl">
              Speak English{" "}
              <AdaptiveText id="heroNaturally" mode={readingMode} /> Without{" "}
              <VocabWord
                id="translating"
                active={activeVocab === "translating"}
                onToggle={toggleVocab}
              >
                Translating
              </VocabWord>{" "}
              in Your Head
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#42506a] sm:text-xl">
              Practice{" "}
              <VocabWord
                id="conversation"
                active={activeVocab === "conversation"}
                onToggle={toggleVocab}
              >
                <AdaptiveText id="realConversation" mode={readingMode} />
              </VocabWord>{" "}
              with a native English speaker. Learn to{" "}
              <AdaptiveText id="explainIdeas" mode={readingMode} /> and speak
              with{" "}
              <VocabWord
                id="confidence"
                active={activeVocab === "confidence"}
                onToggle={toggleVocab}
              >
                <AdaptiveText id="moreConfidence" mode={readingMode} />
              </VocabWord>
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contacts"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(11,45,92,0.28)] transition hover:bg-[#123d78] active:scale-[0.98]"
              >
                Book a Trial Lesson <ArrowRight size={18} weight="bold" />
              </a>
              <a
                href="#club"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#0b2d5c]/18 bg-white/80 px-6 py-4 font-bold text-[#0b2d5c] transition hover:bg-white active:scale-[0.98]"
              >
                <ChatsCircle size={20} weight="bold" /> Join Speaking Club
              </a>
            </div>
            <figure className="mt-6 max-w-sm rounded-[20px] border-l-4 border-[#f3a51d] bg-white/62 px-5 py-4 shadow-sm">
              <blockquote className="text-xl font-black text-[#0b2d5c]">
                &quot;Don&apos;t translate. Explain.&quot;
              </blockquote>
              <figcaption className="mt-1 text-sm font-semibold text-[#42506a]">
                Chris&apos;s teaching philosophy.
              </figcaption>
            </figure>
            <NeedHelp />
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
          {problems.map((problem, index) => (
            <motion.div
              key={problem}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              className="rounded-[22px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
            >
              <p className="text-lg font-bold leading-snug text-[#1f2c45]">{problem}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-[30px] border border-white/70 bg-white/68 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8"
          >
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
              In a lesson
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b2d5c] sm:text-4xl">
              Can&apos;t think of a word?
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#42506a]">
              Imagine you forgot the word{" "}
              <span className="font-black text-[#172033]">&quot;umbrella&quot;</span>.
            </p>
            <div className="mt-6 rounded-[22px] bg-[#0b2d5c] p-5 text-white">
              <p className="text-sm font-bold text-[#f3a51d]">You can say:</p>
              <p className="mt-2 text-2xl font-black leading-snug">
                &quot;It&apos;s something you use when it rains.&quot;
              </p>
            </div>
          </motion.div>

          <div className="grid gap-3">
            {teachingStyle.map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[22px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
              >
                <p className="text-lg font-black leading-snug text-[#20304b]">
                  {prompt.includes("improve") ? (
                    <>
                      The more you speak, the faster you{" "}
                      <AdaptiveText id="improve" mode={readingMode} />.
                    </>
                  ) : (
                    prompt
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <ExplainChallenge />
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
              Chris Matoz
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {facts.map((fact) => (
                <div
                  key={fact}
                  className="rounded-full bg-white/66 px-4 py-3 font-bold text-[#24334f] shadow-sm"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#0b2d5c] p-4 shadow-[0_24px_60px_rgba(11,45,92,0.2)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-white">
              <Image
                src="/chris-logo.png"
                alt="Photo or video placeholder for Chris Matoz"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 90vw, 44vw"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="club" className="py-10">
        <div className="overflow-hidden rounded-[32px] bg-[#0b2d5c] p-6 text-white shadow-[0_30px_90px_rgba(11,45,92,0.24)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f3a51d]">
                Speaking Club
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                More speaking time in a{" "}
                <AdaptiveText id="friendlyAtmosphere" mode={readingMode} />.
              </h2>
              <a
                href="#contacts"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033] transition hover:bg-[#ffb637] active:scale-[0.98]"
              >
                Join Speaking Club <ArrowRight size={18} weight="bold" />
              </a>
            </div>
            <div className="grid gap-3">
              {clubPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center justify-between rounded-[20px] border border-white/14 bg-white/10 px-5 py-4"
                >
                  <span className="font-bold">
                    {point === "Friendly atmosphere" ? (
                      <AdaptiveText id="friendlyAtmosphere" mode={readingMode} />
                    ) : (
                      point
                    )}
                  </span>
                  <CheckCircle size={22} weight="fill" className="text-[#f3a51d]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <h2 className="max-w-2xl text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
          Results
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {resultCards.map((result) => (
            <div
              key={result}
              className="rounded-[22px] border border-white/70 bg-white/66 p-5 shadow-[0_16px_40px_rgba(31,45,70,0.08)]"
            >
              <p className="font-black leading-7 text-[#20304b]">
                {result === "Build confidence" ? (
                  <>
                    Build{" "}
                    <VocabWord
                      id="confidence"
                      active={activeVocab === "confidence"}
                      onToggle={toggleVocab}
                    >
                      <AdaptiveText id="confidence" mode={readingMode} />
                    </VocabWord>
                  </>
                ) : (
                  result
                )}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="prices" className="py-10">
        <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
          Prices
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {prices.map(([name, price]) => (
            <div
              key={name}
              className="rounded-[22px] border border-white/70 bg-white/70 p-6 shadow-[0_16px_40px_rgba(31,45,70,0.08)]"
            >
              <h3 className="text-xl font-black text-[#0b2d5c]">{name}</h3>
              <p className="mt-8 text-2xl font-black text-[#172033]">{price}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
            FAQ
          </h2>
          <div className="grid gap-3">
            {faq.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-[20px] border border-white/70 bg-white/66 px-5 py-4 shadow-sm open:bg-white"
              >
                <summary className="cursor-pointer list-none text-lg font-black text-[#20304b]">
                  {question}
                </summary>
                <p className="mt-3 leading-7 text-[#42506a]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contacts" className="py-12">
        <div className="rounded-[32px] border border-white/80 bg-white/72 p-6 text-center shadow-[0_24px_70px_rgba(31,45,70,0.12)] sm:p-10">
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-6xl">
            Ready to Start Speaking English for Real?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://example.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-6 py-4 font-black text-white transition hover:bg-[#123d78] active:scale-[0.98]"
            >
              Book a Trial Lesson <ArrowRight size={18} weight="bold" />
            </a>
            <a
              href="https://example.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033] transition hover:bg-[#ffb637] active:scale-[0.98]"
            >
              Message on Telegram <TelegramLogo size={20} weight="bold" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold text-[#24334f]">
            <a href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <TelegramLogo size={18} weight="bold" /> Telegram
            </a>
            <a href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <WhatsappLogo size={18} weight="bold" /> WhatsApp
            </a>
            <a href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <InstagramLogo size={18} weight="bold" /> Instagram
            </a>
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <EnvelopeSimple size={18} weight="bold" /> Email
            </a>
          </div>
        </div>
      </Section>

      <ReadingModeBar mode={readingMode} onChange={setReadingMode} />
    </main>
  );
}
