"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  ChatsCircle,
  CheckCircle,
  EnvelopeSimple,
  GlobeHemisphereWest,
  InstagramLogo,
  PlayCircle,
  TelegramLogo,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

type ReadingMode = "easy" | "standard" | "natural";

type VariantKey =
  | "confidence"
  | "heroNaturally"
  | "naturally"
  | "improve"
  | "conversation"
  | "explainIdeas"
  | "friendlyAtmosphere"
  | "realConversation"
  | "moreConfidence"
  | "moreFreelyNaturallyConfidently"
  | "improvePronunciation"
  | "nativeSpeakersBetter";

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
  naturally: {
    easy: "more easily",
    standard: "naturally",
    natural: "effortlessly",
  },
  improve: {
    easy: "get better",
    standard: "improve",
    natural: "sharpen",
  },
  conversation: {
    easy: "speaking with people",
    standard: "conversation",
    natural: "real-life conversation",
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
    easy: "real speaking with people",
    standard: "real conversation",
    natural: "real-life conversation",
  },
  moreConfidence: {
    easy: "feel more sure",
    standard: "more confidence",
    natural: "stronger self-assurance",
  },
  moreFreelyNaturallyConfidently: {
    easy: "more freely, in a normal way and with less fear",
    standard: "more freely, naturally and confidently",
    natural: "with more fluency, ease and self-assurance",
  },
  improvePronunciation: {
    easy: "get better pronunciation",
    standard: "Improve pronunciation",
    natural: "Sharpen pronunciation",
  },
  nativeSpeakersBetter: {
    easy: "Understand native speakers more easily",
    standard: "Understand native speakers better",
    natural: "Follow native speakers with more ease",
  },
};

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
            y: 5,
            filter: "blur(6px)",
            backgroundColor: "rgba(243, 165, 29, 0.42)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            backgroundColor: "rgba(243, 165, 29, 0)",
          }}
          exit={{ opacity: 0, y: -5, filter: "blur(6px)" }}
          transition={{
            opacity: { duration: 0.24, ease: "easeOut" },
            y: { duration: 0.24, ease: "easeOut" },
            filter: { duration: 0.24, ease: "easeOut" },
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

const modes: ReadingMode[] = ["easy", "standard", "natural"];

const problems = [
  "I understand English, but I can't speak.",
  "I translate in my head.",
  "I forget words when I speak.",
  "I'm afraid to make mistakes.",
];

const methodSteps = [
  "No Russian during lessons.",
  "If you don't know a word, explain it in English.",
  "Use examples, situations and simple words.",
  "Speak first, improve step by step.",
];

const facts = [
  "Native English speaker",
  "Conversation-focused lessons",
  "Online lessons",
  "Speaking Club host",
];

const clubPoints = [
  "Real topics",
  "Small groups",
  "Friendly atmosphere",
  "More speaking time",
  "Less fear of mistakes",
];

const coachPrompts = [
  "Can you explain it another way?",
  "Use different words.",
  "Don't worry about mistakes.",
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
    "No. You need enough English to try. Chris helps you use simple words first and grow from there.",
  ],
  [
    "What if I don't know a word?",
    "You explain the idea with other English words. This trains your brain to stay in English.",
  ],
  [
    "Do you use Russian in lessons?",
    "No. Lessons stay in English, so you learn to think and react in English.",
  ],
  [
    "How does Speaking Club work?",
    "You join a small group, discuss real topics and get more speaking time in a calm setting.",
  ],
  [
    "Can I join if I'm shy?",
    "Yes. The group is friendly, structured and focused on helping you speak without pressure.",
  ],
  [
    "How do I book a lesson?",
    "Message Chris through Telegram, WhatsApp, Instagram or email and choose a time.",
  ],
];

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
      transition={{ delay: 0.4, duration: 0.45 }}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-36px)] max-w-[360px] rounded-[24px] border border-white/55 bg-white/68 p-1.5 shadow-[0_12px_42px_rgba(16,31,61,0.16)] backdrop-blur-md supports-[backdrop-filter]:bg-white/58 sm:bottom-6"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[linear-gradient(90deg,rgba(255,255,255,0.28),transparent_52%,rgba(255,255,255,0.16))]" />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <div className="px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#18345f] sm:pr-0 sm:text-[10px]">
          <span aria-hidden="true" className="mr-1">📖</span>
          Reading mode
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1">
          {modes.map((item) => (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`relative h-8 rounded-full px-2 text-xs font-semibold capitalize transition active:scale-[0.98] ${
                mode === item
                  ? "text-white"
                  : "text-[#20324b] hover:bg-white/45"
              }`}
            >
              {mode === item && (
                <motion.span
                  layoutId="reading-mode-pill"
                  className="absolute inset-0 rounded-full bg-[#0b2d5c] shadow-[0_6px_16px_rgba(11,45,92,0.22)]"
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
    <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/58 p-4 shadow-[0_28px_80px_rgba(27,43,71,0.16)] backdrop-blur-xl">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#0b2d5c]">
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
        <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/35 bg-white/18 p-4 text-white backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <PlayCircle size={34} weight="fill" />
            <div>
              <p className="font-bold">Photo or welcome video slot</p>
              <p className="text-sm text-white/78">
                Ready for a 10 to 15 second looping intro.
              </p>
            </div>
          </div>
        </div>
      </div>
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

  useEffect(() => {
    const stored = window.localStorage.getItem("readingMode");
    if (stored === "easy" || stored === "standard" || stored === "natural") {
      window.requestAnimationFrame(() => setReadingMode(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("readingMode", readingMode);
  }, [readingMode]);

  const resultCards = useMemo(
    () => [
      "Speak without translating every sentence",
      "Explain your thoughts in English",
      "Build confidence",
      "Improve pronunciation",
      "Understand native speakers better",
    ],
    [],
  );

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-32 text-[#172033]">
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
            <span>Chris Matoz</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#31415a] md:flex">
            <a href="#method" className="hover:text-[#0b2d5c]">Method</a>
            <a href="#club" className="hover:text-[#0b2d5c]">Speaking Club</a>
            <a href="#prices" className="hover:text-[#0b2d5c]">Prices</a>
            <a href="#contacts" className="hover:text-[#0b2d5c]">Contacts</a>
          </div>
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
            <p className="mb-5 inline-flex rounded-full border border-[#f3a51d]/35 bg-white/72 px-4 py-2 text-sm font-bold text-[#0b2d5c] shadow-sm">
              Native speaker lessons for real speaking
            </p>
            <h1 className="max-w-[780px] text-5xl font-black leading-[0.96] tracking-tight text-[#0b2d5c] sm:text-6xl lg:text-7xl">
              Speak English{" "}
              <AdaptiveText id="heroNaturally" mode={readingMode} /> Without
              Translating in Your Head
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#42506a] sm:text-xl">
              Practice{" "}
              <AdaptiveText id="realConversation" mode={readingMode} /> with a
              native English speaker. Learn to{" "}
              <AdaptiveText id="explainIdeas" mode={readingMode} /> in English
              and speak with{" "}
              <AdaptiveText id="moreConfidence" mode={readingMode} />.
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
            <figure className="mt-6 max-w-sm rounded-[22px] border-l-4 border-[#f3a51d] bg-white/62 px-5 py-4 shadow-sm">
              <blockquote className="text-xl font-black text-[#0b2d5c]">
                &quot;Don&apos;t translate. Explain.&quot;
              </blockquote>
              <figcaption className="mt-1 text-sm font-semibold text-[#42506a]">
                Chris&apos;s teaching philosophy.
              </figcaption>
            </figure>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Native Speaker", "No Russian", "Real Speaking", "Speaking Club"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/80 bg-white/68 px-4 py-2 text-sm font-bold text-[#24334f] shadow-sm"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-[28px] bg-[#f3a51d]/85 blur-2xl" />
            <div className="absolute -right-8 bottom-14 h-36 w-36 rounded-[38px] bg-[#0b2d5c]/20 blur-2xl" />
            <HeroMedia />
          </motion.div>
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[24px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
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
              Imagine you forgot the word <span className="font-black text-[#172033]">&quot;umbrella&quot;</span>.
            </p>
            <div className="mt-6 rounded-[24px] bg-[#0b2d5c] p-5 text-white">
              <p className="text-sm font-bold text-[#f3a51d]">You can say:</p>
              <p className="mt-2 text-2xl font-black leading-snug">
                &quot;It&apos;s something you use when it rains.&quot;
              </p>
            </div>
            <p className="mt-5 text-lg font-bold text-[#20304b]">
              This is how we learn during lessons.
            </p>
          </motion.div>

          <div className="grid gap-3">
            {coachPrompts.map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 rounded-[24px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f3a51d] font-black text-[#172033]">
                  C
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d28510]">
                    Chris would ask
                  </p>
                  <p className="mt-1 text-lg font-black leading-snug text-[#20304b]">
                    &quot;{prompt}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="method" className="py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
              Chris Method
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
              English Through English
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#42506a]">
              Lessons train you to stay in English. You learn to move around a
              missing word, build the idea and keep speaking.
            </p>
          </div>
          <div className="rounded-[30px] border border-white/70 bg-white/64 p-5 shadow-[0_22px_60px_rgba(31,45,70,0.1)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {methodSteps.map((step) => (
                <div key={step} className="rounded-[22px] bg-[#f6f2ea] p-5">
                  <CheckCircle className="mb-4 text-[#f3a51d]" size={26} weight="fill" />
                  <p className="font-bold leading-7 text-[#263450]">
                    {step.includes("improve") ? (
                      <>
                        Speak first,{" "}
                        <AdaptiveText id="improve" mode={readingMode} /> step by
                        step.
                      </>
                    ) : (
                      step
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 rounded-full bg-[#0b2d5c] p-2 text-center text-sm font-black text-white sm:grid-cols-4">
              {["Don't translate", "Explain", "Speak", "Improve"].map((step) => (
                <div key={step} className="rounded-full bg-white/10 px-3 py-3">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[#0b2d5c] p-4 shadow-[0_24px_60px_rgba(11,45,92,0.2)]">
            <div className="relative aspect-[16/12] overflow-hidden rounded-[24px] bg-white">
              <Image
                src="/chris-logo.png"
                alt="Photo or video placeholder for Chris Matoz"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 90vw, 44vw"
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
              Meet Chris Matoz
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#42506a]">
              Hi, I&apos;m a native English speaker from Africa. I help students speak
              English{" "}
              <AdaptiveText
                id="moreFreelyNaturallyConfidently"
                mode={readingMode}
              />{" "}
              through{" "}
              <AdaptiveText id="realConversation" mode={readingMode} />.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {facts.map((fact) => (
                <div
                  key={fact}
                  className="flex items-center gap-3 rounded-full bg-white/66 px-4 py-3 font-bold text-[#24334f] shadow-sm"
                >
                  <GlobeHemisphereWest size={20} weight="bold" className="text-[#d28510]" />
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="club" className="py-16">
        <div className="overflow-hidden rounded-[36px] bg-[#0b2d5c] p-6 text-white shadow-[0_30px_90px_rgba(11,45,92,0.28)] sm:p-10">
          <div className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f3a51d]">
                Speaking Club
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Practice English with other students in a{" "}
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
                  className="flex items-center justify-between rounded-[22px] border border-white/14 bg-white/10 px-5 py-4"
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

      <Section className="py-16">
        <h2 className="max-w-2xl text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
          What changes after real speaking practice
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {resultCards.map((result) => (
            <div
              key={result}
              className="rounded-[24px] border border-white/70 bg-white/66 p-5 shadow-[0_16px_40px_rgba(31,45,70,0.08)]"
            >
              <BookOpenText size={28} weight="duotone" className="mb-5 text-[#d28510]" />
              <p className="font-black leading-7 text-[#20304b]">
                {result === "Build confidence" ? (
                  <>
                    Build <AdaptiveText id="confidence" mode={readingMode} />
                  </>
                ) : result === "Improve pronunciation" ? (
                  <AdaptiveText id="improvePronunciation" mode={readingMode} />
                ) : result === "Understand native speakers better" ? (
                  <AdaptiveText id="nativeSpeakersBetter" mode={readingMode} />
                ) : result}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="prices" className="py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
              Prices
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
              Simple options to start speaking
            </h2>
          </div>
          <p className="max-w-md text-[#42506a]">
            Placeholder prices are ready for client review and can be updated in
            minutes.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {prices.map(([name, price]) => (
            <div
              key={name}
              className="rounded-[26px] border border-white/70 bg-white/70 p-6 shadow-[0_16px_40px_rgba(31,45,70,0.08)]"
            >
              <h3 className="text-xl font-black text-[#0b2d5c]">{name}</h3>
              <p className="mt-8 text-2xl font-black text-[#172033]">{price}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
            Questions students ask before the first lesson
          </h2>
          <div className="grid gap-3">
            {faq.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-[22px] border border-white/70 bg-white/66 px-5 py-4 shadow-sm open:bg-white"
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

      <Section id="contacts" className="py-16">
        <div className="rounded-[36px] border border-white/80 bg-white/72 p-6 text-center shadow-[0_24px_70px_rgba(31,45,70,0.12)] sm:p-10">
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
