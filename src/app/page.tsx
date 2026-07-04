"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CaretDown,
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
type SiteLanguage = "en" | "ru";
type VariantKey =
  | "confidence"
  | "heroNaturally"
  | "improve"
  | "explainIdeas"
  | "friendlyAtmosphere"
  | "realConversation"
  | "moreConfidence";
type VocabKey = "translating" | "confidence" | "conversation";

const modes: ReadingMode[] = ["easy", "standard", "natural"];

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
};

const vocabNotes: Record<VocabKey, string> = {
  translating: "Changing words from one language into another.",
  confidence: "Feeling calm because you know you can try.",
  conversation: "Speaking and listening with another person.",
};

const content = {
  en: {
    statusOn: "English Only Mode: ON",
    statusOff: "English Only Mode: OFF",
    switchEnglish: "Back to English",
    book: "Book",
    heroSuffix: "Without Translating in Your Head",
    heroTextBefore: "Practice",
    heroTextMiddle: "with a native English speaker. Learn to",
    heroTextEnd: "and speak with",
    trial: "Book a Trial Lesson",
    clubCta: "Join Speaking Club",
    quote: "\"Don't translate. Explain.\"",
    quoteCaption: "Chris's teaching philosophy.",
    needHelp: "🇷🇺 Need help?",
    helpFirst: "😊 Are you sure? Let's try to continue in English first.",
    helpSecond: "Switch to Russian",
    problems: [
      "I understand English, but I can't speak.",
      "I translate in my head.",
      "I forget words when I speak.",
      "I'm afraid to make mistakes.",
    ],
    lessonLabel: "In a lesson",
    umbrellaTitle: "Can't think of a word?",
    umbrellaIntro: "Imagine you forgot the word",
    umbrellaWord: "\"umbrella\"",
    youCanSay: "You can say:",
    umbrellaAnswer: "\"It's something you use when it rains.\"",
    styleCards: [
      "Chris encourages you to keep speaking.",
      "Don't stop. Keep talking.",
      "Say the whole sentence.",
      "It's okay if you make mistakes.",
      "The more you speak, the faster you improve.",
    ],
    challengeTitle: "Explain Challenge",
    todayWord: "Today's word",
    showAnswer: "Show Chris's answer",
    aboutTitle: "Chris Matoz",
    facts: [
      "Native English speaker from Africa",
      "English-only lessons",
      "Online individual lessons",
      "Speaking Club host",
    ],
    clubTitleBefore: "More speaking time in a",
    clubPoints: ["Real topics", "Small groups", "Friendly atmosphere", "More speaking time"],
    resultsTitle: "Results",
    results: [
      "Speak without translating every sentence",
      "Explain your thoughts in English",
      "Build confidence",
    ],
    pricesTitle: "Prices",
    prices: [
      ["Trial Lesson", "from ₽___"],
      ["Individual Lesson", "from ₽___"],
      ["Speaking Club", "from ₽___"],
      ["Monthly Package", "from ₽___"],
    ],
    faqTitle: "FAQ",
    faq: [
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
    ],
    finalTitle: "Ready to Start Speaking English for Real?",
    telegram: "Message on Telegram",
    readingMode: "Reading mode",
    modeLabels: { easy: "Easy", standard: "Standard", natural: "Natural" },
    videoReady: "Welcome video ready",
    videoSlot: "10 to 15 second loop slot.",
  },
  ru: {
    statusOn: "English Only Mode: ON",
    statusOff: "English Only Mode: OFF",
    switchEnglish: "Вернуться к английскому",
    book: "Записаться",
    heroSuffix: "без перевода в голове",
    heroTextBefore: "Говорите",
    heroTextMiddle: "с носителем языка. Учитесь",
    heroTextEnd: "и постепенно становитесь",
    trial: "Записаться на пробный урок",
    clubCta: "Присоединиться к Speaking Club",
    quote: "\"Не переводи. Объясняй по-английски.\"",
    quoteCaption: "Так Крис помогает начать думать на языке.",
    needHelp: "🇬🇧 Вернуться к английскому",
    helpFirst: "Русский режим включен. Вернуться к английскому можно в любой момент.",
    helpSecond: "Вернуться к английскому",
    problems: [
      "Понимаю английский, но не получается говорить.",
      "Я перевожу в голове.",
      "Во время разговора забываю слова.",
      "Боюсь ошибиться и замолкаю.",
    ],
    lessonLabel: "На уроке",
    umbrellaTitle: "Забыли нужное слово?",
    umbrellaIntro: "Например, вы не вспомнили слово",
    umbrellaWord: "\"umbrella\"",
    youCanSay: "Можно сказать:",
    umbrellaAnswer: "\"Это вещь, которую берут с собой, когда идет дождь.\"",
    styleCards: [
      "Крис спокойно помогает не останавливаться.",
      "Продолжайте мысль, даже если слово забыто.",
      "Лучше сказать всю фразу простыми словами.",
      "Ошибки не страшны, они часть разговора.",
      "Чем больше говорите, тем быстрее появляется свобода.",
    ],
    challengeTitle: "Задание на объяснение",
    todayWord: "Слово дня",
    showAnswer: "Показать ответ Криса",
    aboutTitle: "Chris Matoz",
    facts: [
      "Носитель английского языка из Африки",
      "Уроки проходят на английском",
      "Индивидуальные занятия онлайн",
      "Ведет Speaking Club",
    ],
    clubTitleBefore: "Больше разговорной практики в",
    clubPoints: ["Живые темы", "Небольшие группы", "Спокойная атмосфера", "Больше времени на речь"],
    resultsTitle: "Результаты",
    results: [
      "Говорить без перевода каждой фразы",
      "Объяснять мысли простым английским",
      "Чувствовать себя увереннее в разговоре",
    ],
    pricesTitle: "Цены",
    prices: [
      ["Пробный урок", "от ₽___"],
      ["Индивидуальный урок", "от ₽___"],
      ["Speaking Club", "от ₽___"],
      ["Пакет на месяц", "от ₽___"],
    ],
    faqTitle: "FAQ",
    faq: [
      [
        "Нужен высокий уровень английского?",
        "Нет. Достаточно базового уровня и готовности пробовать говорить.",
      ],
      [
        "Что если я не знаю слово?",
        "Вы объясняете мысль другими английскими словами, через примеры и ситуации.",
      ],
      [
        "На уроках используется русский?",
        "Нет. Занятия идут на английском, чтобы вы привыкали реагировать без перевода.",
      ],
    ],
    finalTitle: "Готовы заговорить по-настоящему?",
    telegram: "Написать в Telegram",
    readingMode: "Режим чтения",
    modeLabels: { easy: "Легко", standard: "Стандарт", natural: "Живо" },
    videoReady: "Место для welcome video",
    videoSlot: "Готово для ролика 10-15 секунд.",
  },
} as const;

const challengeWords = [
  {
    word: { easy: "umbrella", standard: "airport", natural: "passport" },
    answer: {
      easy: "It's something you use when it rains.",
      standard: "It's a place where people take planes.",
      natural: "It's an official document you use when you travel abroad.",
    },
    ru: {
      easy: "Это то, чем пользуются, когда идет дождь.",
      standard: "Это место, где люди садятся на самолеты.",
      natural: "Это официальный документ для поездок за границу.",
    },
  },
  {
    word: { easy: "dentist", standard: "elevator", natural: "appointment" },
    answer: {
      easy: "It's a doctor who helps with your teeth.",
      standard: "It's a small room that takes you up or down in a building.",
      natural: "It's a planned time to meet someone or visit a place.",
    },
    ru: {
      easy: "Это врач, который помогает с зубами.",
      standard: "Это маленькая кабина, которая поднимает или опускает людей в здании.",
      natural: "Это заранее назначенное время для встречи или визита.",
    },
  },
];

function AdaptiveText({
  id,
  mode,
  language,
  ru,
  className,
}: {
  id: VariantKey;
  mode: ReadingMode;
  language: SiteLanguage;
  ru?: string;
  className?: string;
}) {
  const value = language === "ru" && ru ? ru : textVariants[id][mode];

  return (
    <span className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${id}-${mode}-${language}`}
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
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function MotionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.015,
        boxShadow: "0 20px 54px rgba(31,45,70,0.14)",
      }}
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
  onClick,
  href,
  type = "button",
}: {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const motionProps = {
    whileHover: { y: -2, scale: 1.025 },
    whileTap: { y: 0, scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 420, damping: 24 },
    className,
  };

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
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
        className="decoration-[#f3a51d] decoration-2 underline-offset-4 transition hover:text-[#0b2d5c]"
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

function TeachingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f6f2ea]" />
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(11,45,92,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(11,45,92,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.78),rgba(246,242,234,0.62)_38%,rgba(243,165,29,0.1)_62%,rgba(11,45,92,0.08))]" />
      <div className="absolute left-[-8%] top-[12%] h-[34rem] w-[34rem] rotate-[-12deg] rounded-[42%] border border-[#0b2d5c]/10" />
      <div className="absolute right-[-10%] top-[34%] h-[30rem] w-[30rem] rotate-[18deg] rounded-[42%] border border-[#f3a51d]/18" />
      <div className="absolute left-[6%] top-[18%] hidden max-w-[30rem] rotate-[-7deg] items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#0b2d5c]/18 md:flex">
        <span>word</span>
        <span className="h-px w-16 bg-[#f3a51d]/38" />
        <span>explain</span>
        <span className="h-px w-16 bg-[#f3a51d]/38" />
        <span>speak</span>
      </div>
      <div className="absolute bottom-[18%] right-[8%] hidden rotate-[6deg] text-[11px] font-black uppercase tracking-[0.24em] text-[#0b2d5c]/14 lg:block">
        try again / keep talking / full sentence
      </div>
      <div className="absolute bottom-[8%] left-[10%] hidden rotate-[-4deg] text-[11px] font-black uppercase tracking-[0.24em] text-[#d28510]/20 lg:block">
        explain it another way
      </div>
    </div>
  );
}

function ReadingModeBar({
  mode,
  language,
  onChange,
}: {
  mode: ReadingMode;
  language: SiteLanguage;
  onChange: (mode: ReadingMode) => void;
}) {
  const copy = content[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.42 }}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-32px)] max-w-[340px] rounded-[22px] border border-white/55 bg-white/72 p-1.5 shadow-[0_10px_34px_rgba(16,31,61,0.14)] backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sm:bottom-6"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] bg-[linear-gradient(90deg,rgba(255,255,255,0.24),transparent_50%,rgba(255,255,255,0.14))]" />
      <div className="flex flex-col gap-1">
        <div className="px-2 text-center text-[8px] font-semibold uppercase tracking-[0.14em] text-[#18345f] sm:text-[9px]">
          <span aria-hidden="true" className="mr-1">📖</span>
          {copy.readingMode}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {modes.map((item) => (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`relative h-8 rounded-full px-2 text-center text-[10px] font-semibold capitalize transition active:scale-[0.98] sm:text-[11px] ${
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
              <span className="relative block whitespace-nowrap">{copy.modeLabels[item]}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HeroMedia({ videoSrc, language }: { videoSrc?: string; language: SiteLanguage }) {
  const copy = content[language];

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
              <p className="font-bold">{copy.videoReady}</p>
              <p className="text-sm text-white/78">{copy.videoSlot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeedHelp({
  language,
  onRussian,
  onEnglish,
}: {
  language: SiteLanguage;
  onRussian: () => void;
  onEnglish: () => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const copy = content[language];

  if (language === "ru") {
    return (
      <div className="mt-6">
        <MotionButton
          onClick={onEnglish}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-6 py-4 text-base font-black text-white shadow-[0_18px_40px_rgba(11,45,92,0.22)]"
        >
          {copy.needHelp} <ArrowRight size={18} weight="bold" />
        </MotionButton>
      </div>
    );
  }

  const handleClick = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    onRussian();
  };

  return (
    <div className="mt-6">
      <MotionButton
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0b2d5c]/12 bg-white/82 px-6 py-4 text-base font-black text-[#0b2d5c] shadow-[0_14px_34px_rgba(31,45,70,0.12)]"
      >
        {step === 0 ? copy.needHelp : copy.helpSecond}
        <ArrowRight size={18} weight="bold" />
      </MotionButton>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.p
            key="help-first"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.18 }}
            className="mt-3 max-w-md rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold leading-6 text-[#42506a]"
          >
            {copy.helpFirst}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExplainChallenge({
  mode,
  language,
}: {
  mode: ReadingMode;
  language: SiteLanguage;
}) {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const copy = content[language];
  const challenge = challengeWords[challengeIndex];

  useEffect(() => {
    const next = Math.floor(Math.random() * challengeWords.length);
    window.requestAnimationFrame(() => setChallengeIndex(next));
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => setShown(false));
  }, [mode, language, challengeIndex]);

  return (
    <MotionCard className="rounded-[30px] border border-white/70 bg-white/68 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
        {copy.challengeTitle}
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#42506a]">{copy.todayWord}</p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={`${challenge.word[mode]}-${language}`}
              initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(5px)" }}
              transition={{ duration: 0.22 }}
              className="text-5xl font-black tracking-tight text-[#0b2d5c]"
            >
              {challenge.word[mode]}
            </motion.h2>
          </AnimatePresence>
        </div>
        <MotionButton
          onClick={() => setShown((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-5 py-3 font-black text-white"
        >
          {copy.showAnswer}
          <motion.span animate={{ rotate: shown ? 180 : 0 }}>
            <CaretDown size={18} weight="bold" />
          </motion.span>
        </MotionButton>
      </div>
      <AnimatePresence>
        {shown && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: 8, filter: "blur(5px)" }}
            animate={{ opacity: 1, height: "auto", y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, y: -6, filter: "blur(5px)" }}
            transition={{ duration: 0.25 }}
            className="mt-5 overflow-hidden rounded-[22px] bg-[#0b2d5c] p-5 text-2xl font-black leading-snug text-white"
          >
            &quot;{language === "ru" ? challenge.ru[mode] : challenge.answer[mode]}&quot;
          </motion.p>
        )}
      </AnimatePresence>
    </MotionCard>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
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
    <section id={id} className={`relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const [readingMode, setReadingMode] = useState<ReadingMode>("standard");
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>("en");
  const [activeVocab, setActiveVocab] = useState<VocabKey | null>(null);
  const copy = content[siteLanguage];
  const isRussian = siteLanguage === "ru";

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
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-28 text-[#172033]">
      <TeachingBackground />
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
              <span className={`mt-0.5 flex items-center gap-1.5 text-[10px] font-black ${isRussian ? "text-[#8a3a12]" : "text-[#1f7a3c]"}`}>
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: [1, 1.25, 1], opacity: [1, 0.72, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isRussian ? "🟠" : "🟢"}
                </motion.span>
                <span>{isRussian ? copy.statusOff : copy.statusOn}</span>
              </span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            {isRussian && (
              <MotionButton
                onClick={() => setSiteLanguage("en")}
                className="hidden rounded-full border border-[#0b2d5c]/12 bg-white/78 px-4 py-2 text-sm font-black text-[#0b2d5c] shadow-sm sm:inline-flex"
              >
                {copy.switchEnglish}
              </MotionButton>
            )}
            <MotionButton
              href="#contacts"
              className="rounded-full bg-[#f3a51d] px-4 py-2 text-sm font-bold text-[#172033] shadow-[0_10px_24px_rgba(243,165,29,0.28)]"
            >
              {copy.book}
            </MotionButton>
          </div>
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
              {isRussian ? "Говорите по-английски " : "Speak English "}
              <AdaptiveText
                id="heroNaturally"
                mode={readingMode}
                language={siteLanguage}
                ru="естественно"
              />{" "}
              {isRussian ? (
                copy.heroSuffix
              ) : (
                <>
                  Without{" "}
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
                "Практикуйте разговорный английский"
              ) : (
                <>
                  {copy.heroTextBefore}{" "}
                </>
              )}
              {!isRussian && (
                <VocabWord
                  id="conversation"
                  active={activeVocab === "conversation"}
                  onToggle={toggleVocab}
                >
                  <AdaptiveText id="realConversation" mode={readingMode} language={siteLanguage} />
                </VocabWord>
              )}{" "}
              {copy.heroTextMiddle}{" "}
              <AdaptiveText
                id="explainIdeas"
                mode={readingMode}
                language={siteLanguage}
                ru="объяснять мысли по-английски"
              />{" "}
              {copy.heroTextEnd}{" "}
              {isRussian ? (
                "уверенностью"
              ) : (
                <VocabWord
                  id="confidence"
                  active={activeVocab === "confidence"}
                  onToggle={toggleVocab}
                >
                  <AdaptiveText id="moreConfidence" mode={readingMode} language={siteLanguage} />
                </VocabWord>
              )}
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MotionButton
                href="#contacts"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(11,45,92,0.28)]"
              >
                {copy.trial} <ArrowRight size={18} weight="bold" />
              </MotionButton>
              <MotionButton
                href="#club"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#0b2d5c]/18 bg-white/80 px-6 py-4 font-bold text-[#0b2d5c]"
              >
                <ChatsCircle size={20} weight="bold" /> {copy.clubCta}
              </MotionButton>
            </div>
            <MotionCard className="mt-6 max-w-sm rounded-[20px] border-l-4 border-[#f3a51d] bg-white/62 px-5 py-4 shadow-sm">
              <blockquote className="text-xl font-black text-[#0b2d5c]">
                {copy.quote}
              </blockquote>
              <figcaption className="mt-1 text-sm font-semibold text-[#42506a]">
                {copy.quoteCaption}
              </figcaption>
            </MotionCard>
            <NeedHelp
              language={siteLanguage}
              onRussian={() => setSiteLanguage("ru")}
              onEnglish={() => setSiteLanguage("en")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-[28px] bg-[#f3a51d]/75 blur-2xl" />
            <HeroMedia language={siteLanguage} />
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

      <Section className="py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <MotionCard className="rounded-[30px] border border-white/70 bg-white/68 p-6 shadow-[0_18px_46px_rgba(31,45,70,0.09)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d28510]">
              {copy.lessonLabel}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b2d5c] sm:text-4xl">
              {copy.umbrellaTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#42506a]">
              {copy.umbrellaIntro}{" "}
              <span className="font-black text-[#172033]">{copy.umbrellaWord}</span>.
            </p>
            <div className="mt-6 rounded-[22px] bg-[#0b2d5c] p-5 text-white">
              <p className="text-sm font-bold text-[#f3a51d]">{copy.youCanSay}</p>
              <p className="mt-2 text-2xl font-black leading-snug">
                {copy.umbrellaAnswer}
              </p>
            </div>
          </MotionCard>

          <div className="grid gap-3">
            {copy.styleCards.map((prompt) => (
              <MotionCard
                key={prompt}
                className="rounded-[22px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_34px_rgba(31,45,70,0.08)]"
              >
                <p className="text-lg font-black leading-snug text-[#20304b]">
                  {prompt.includes("improve") && !isRussian ? (
                    <>
                      The more you speak, the faster you{" "}
                      <AdaptiveText id="improve" mode={readingMode} language={siteLanguage} />.
                    </>
                  ) : (
                    prompt
                  )}
                </p>
              </MotionCard>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <ExplainChallenge mode={readingMode} language={siteLanguage} />
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
              {copy.aboutTitle}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.facts.map((fact) => (
                <MotionCard
                  key={fact}
                  className="rounded-full bg-white/66 px-4 py-3 font-bold text-[#24334f] shadow-sm"
                >
                  {fact}
                </MotionCard>
              ))}
            </div>
          </div>
          <MotionCard className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#0b2d5c] p-4 shadow-[0_24px_60px_rgba(11,45,92,0.2)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-white">
              <Image
                src="/chris-logo.png"
                alt="Photo or video placeholder for Chris Matoz"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 90vw, 44vw"
              />
            </div>
          </MotionCard>
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
                {copy.clubTitleBefore}{" "}
                <AdaptiveText
                  id="friendlyAtmosphere"
                  mode={readingMode}
                  language={siteLanguage}
                  ru="дружелюбной группе"
                />.
              </h2>
              <MotionButton
                href="#contacts"
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
        <h2 className="max-w-2xl text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
          {copy.resultsTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.results.map((result) => (
            <MotionCard
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
                      <AdaptiveText id="confidence" mode={readingMode} language={siteLanguage} />
                    </VocabWord>
                  </>
                ) : (
                  result
                )}
              </p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section id="prices" className="py-10">
        <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
          {copy.pricesTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {copy.prices.map(([name, price]) => (
            <MotionCard
              key={name}
              className="rounded-[22px] border border-white/70 bg-white/70 p-6 shadow-[0_16px_40px_rgba(31,45,70,0.08)]"
            >
              <h3 className="text-xl font-black text-[#0b2d5c]">{name}</h3>
              <p className="mt-8 text-2xl font-black text-[#172033]">{price}</p>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-5xl">
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
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-[#0b2d5c] sm:text-6xl">
            {copy.finalTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MotionButton
              href="https://example.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b2d5c] px-6 py-4 font-black text-white"
            >
              {copy.trial} <ArrowRight size={18} weight="bold" />
            </MotionButton>
            <MotionButton
              href="https://example.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
            >
              {copy.telegram} <TelegramLogo size={20} weight="bold" />
            </MotionButton>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold text-[#24334f]">
            <MotionButton href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <TelegramLogo size={18} weight="bold" /> Telegram
            </MotionButton>
            <MotionButton href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <WhatsappLogo size={18} weight="bold" /> WhatsApp
            </MotionButton>
            <MotionButton href="https://example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <InstagramLogo size={18} weight="bold" /> Instagram
            </MotionButton>
            <MotionButton href="mailto:hello@example.com" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-4 py-3">
              <EnvelopeSimple size={18} weight="bold" /> Email
            </MotionButton>
          </div>
        </div>
      </Section>

      <ReadingModeBar mode={readingMode} language={siteLanguage} onChange={setReadingMode} />
    </main>
  );
}
