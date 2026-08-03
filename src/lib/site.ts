export type Lang = "ru" | "en";
export type TestKind = "grammar" | "vocabulary" | "speaking";
export type TestQuestion = {
  id: string;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6;
  q: string;
  options: readonly string[];
  answer: string;
  explain: string;
};

export const theme = {
  accent: "#f3a51d",
  ink: "#172033",
  blue: "#087bd3",
  paper: "#f6f2ea",
  muted: "#42506a",
};

export const contacts = {
  phone: "+7 993 956 1707",
  telegramChannel: "https://t.me/SpokenEnglishwithChris",
  telegramPersonal: "https://t.me/Chrismatoz",
  whatsapp: "https://wa.me/79939561707",
  instagram: "https://instagram.com/Chrismatoz",
  email: "chrismatoz@gmail.com",
  trialUrl: "https://t.me/Chrismatoz",
};

export const seo = {
  ru: {
    title: "Репетитор английского языка онлайн | Chris Matoz",
    description:
      "Разговорный английский с носителем, уроки английского онлайн и Speaking Club с Chris Matoz.",
    path: "/",
  },
  en: {
    title: "Chris Matoz | Spoken English Lessons",
    description:
      "Conversation-focused English lessons with Chris Matoz, a native English speaker from Africa.",
    path: "/en/",
  },
};

export const content = {
  en: {
    lang: "en",
    brand: "Chris Matoz",
    brandLine: "Spoken English with Chris",
    nav: ["About", "Method", "Speaking Club", "Tests", "Prices", "Contacts"],
    statusOn: "English Only Mode: ON",
    book: "Book",
    trial: "Book a Trial Lesson",
    clubCta: "Join Speaking Club",
    offers: {
      title: "A good way to start",
      trial: "Your first lesson is free",
      testDiscount: "Complete a level test and get 10% off your second lesson",
      referral: "Invite a friend and you both get 10% off",
    },
    quote: "\"Don't translate. Explain.\"",
    quoteCaption: "Chris's teaching philosophy.",
    heroTitle: "Speak English Naturally Without Translating in Your Head",
    heroText:
      "Practice real conversation with a native English speaker. Learn to explain your ideas and speak with more confidence.",
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
    clubTitleBefore: "More speaking time in a friendly atmosphere.",
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
    faqTitle: "Frequently Asked Questions",
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
    contactsTitle: "Contacts",
    testsTitle: "Tests",
    testLabels: {
      grammar: "Grammar Test",
      vocabulary: "Vocabulary Test",
      speaking: "Speaking Test",
    },
    modal: {
      close: "Close",
      next: "Next",
      back: "Back",
      finish: "Finish",
      result: "Result",
      level: "Approximate level",
      recommendations: "Recommendations",
      yourName: "Name",
      yourTelegram: "Telegram",
      submit: "Send to Chris",
      randomTopic: "Random topic",
      recordingReady: "Voice recording interface is prepared for backend upload.",
      speakingNote:
        "Chris will personally listen to your speaking and tell you what to improve.",
    },
  },
  ru: {
    lang: "ru",
    brand: "Chris Matoz",
    brandLine: "Spoken English with Chris",
    nav: ["О Крисе", "Метод", "Speaking Club", "Тесты", "Цены", "Контакты"],
    statusOn: "English Only Mode: ON",
    book: "Записаться",
    trial: "Записаться на пробный урок",
    clubCta: "В Speaking Club",
    offers: {
      title: "Начните с выгодой",
      trial: "Первый урок всегда бесплатно",
      testDiscount: "Пройдите тест и получите скидку 10% на второй урок",
      referral: "Приведите друга и получите по 10% скидки каждый",
    },
    quote: "\"Не переводи. Объясняй.\"",
    quoteCaption: "Так Крис помогает ученикам начать думать по-английски.",
    heroTitle: "Заговорите на английском естественно без перевода в голове",
    heroText:
      "Практикуйтесь с носителем языка, учитесь объяснять мысли по-английски и шаг за шагом говорите свободнее.",
    problems: [
      "Английский понимаю, но говорить сложно",
      "Сначала перевожу фразу в голове",
      "Забываю слова во время разговора",
      "Боюсь ошибиться и замолкаю",
    ],
    lessonLabel: "Как это работает на уроке",
    umbrellaTitle: "Забыли слово?",
    umbrellaIntro: "Например, вы забыли слово",
    umbrellaWord: "\"umbrella\"",
    youCanSay: "Можно сказать проще:",
    umbrellaAnswer: "\"It's something you use when it rains.\"",
    styleCards: [
      "Говорите больше, даже если пока неидеально",
      "Собирайте мысль в полную фразу",
      "Ошибки - нормальная часть разговора",
      "Чем больше практики, тем быстрее появляется свобода",
    ],
    challengeTitle: "Мини-задание",
    todayWord: "Слово дня",
    showAnswer: "Показать пример Криса",
    aboutTitle: "Chris Matoz",
    facts: [
      "Носитель английского языка из Африки",
      "Уроки проходят на английском",
      "Индивидуальные занятия онлайн",
      "Ведет Speaking Club",
    ],
    clubTitleBefore: "Разговорная практика в спокойной группе.",
    clubPoints: ["Живые темы", "Небольшие группы", "Спокойная атмосфера", "Больше времени говорить"],
    resultsTitle: "Что меняется после практики",
    results: [
      "Меньше перевода в голове",
      "Проще объяснять мысли по-английски",
      "Больше уверенности в разговоре",
    ],
    pricesTitle: "Стоимость",
    prices: [
      ["Пробный урок", "от ₽___"],
      ["Индивидуальный урок", "от ₽___"],
      ["Speaking Club", "от ₽___"],
      ["Пакет на месяц", "от ₽___"],
    ],
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      [
        "Нужно ли уже хорошо знать английский?",
        "Нет. Достаточно базового уровня и желания говорить.",
      ],
      [
        "Что делать, если я не знаю слово?",
        "Объяснить мысль другими английскими словами и не останавливаться.",
      ],
      [
        "Можно ли заниматься без русского?",
        "Да. Именно так уходит привычка переводить в голове.",
      ],
    ],
    finalTitle: "Хотите заговорить увереннее?",
    telegram: "Написать в Telegram",
    contactsTitle: "Контакты",
    testsTitle: "Тесты",
    testLabels: {
      grammar: "Грамматика",
      vocabulary: "Лексика",
      speaking: "Разговорный тест",
    },
    modal: {
      close: "Закрыть",
      next: "Дальше",
      back: "Назад",
      finish: "Завершить",
      result: "Результат",
      level: "Примерный уровень",
      recommendations: "Рекомендации",
      yourName: "Имя",
      yourTelegram: "Telegram",
      submit: "Отправить Крису",
      randomTopic: "Случайная тема",
      recordingReady: "Интерфейс записи голоса подготовлен для backend-загрузки.",
      speakingNote:
        "Крис лично послушает вашу речь и подскажет, над чем стоит поработать",
    },
  },
} as const;

export const navIds = ["about", "method", "club", "tests", "prices", "contacts"] as const;

export const grammarQuestions: readonly TestQuestion[] = [
  { id: "g1", difficulty: 1, q: "There ___ two books on the table.", options: ["is", "are", "be"], answer: "are", explain: "Use are with a plural noun." },
  { id: "g2", difficulty: 1, q: "She ___ coffee every morning.", options: ["drink", "drinks", "drinking"], answer: "drinks", explain: "Use -s with he, she, or it in Present Simple." },
  { id: "g3", difficulty: 1, q: "We ___ at home yesterday.", options: ["was", "were", "are"], answer: "were", explain: "We takes were in the past." },
  { id: "g4", difficulty: 2, q: "I have lived here ___ 2020.", options: ["for", "since", "from"], answer: "since", explain: "Use since with a starting point." },
  { id: "g5", difficulty: 2, q: "If I ___ time, I will call you.", options: ["will have", "had", "have"], answer: "have", explain: "First conditional uses present after if." },
  { id: "g6", difficulty: 2, q: "This coffee is ___ hot to drink.", options: ["enough", "too", "such"], answer: "too", explain: "Too means more than is possible or desirable." },
  { id: "g7", difficulty: 3, q: "Could you tell me where ___?", options: ["is the station", "the station is", "does the station"], answer: "the station is", explain: "Indirect questions use normal word order." },
  { id: "g8", difficulty: 3, q: "I look forward to ___ you.", options: ["see", "saw", "seeing"], answer: "seeing", explain: "Look forward to is followed by an -ing form." },
  { id: "g9", difficulty: 3, q: "By the time we arrived, the film ___ .", options: ["started", "has started", "had started"], answer: "had started", explain: "Past Perfect marks the earlier past action." },
  { id: "g10", difficulty: 4, q: "I wish I ___ more confident when speaking.", options: ["am", "were", "will be"], answer: "were", explain: "Wish about the present uses a past form." },
  { id: "g11", difficulty: 4, q: "Not only ___ late, but he also forgot the documents.", options: ["he was", "was he", "he is"], answer: "was he", explain: "Negative fronting requires subject-verb inversion." },
  { id: "g12", difficulty: 4, q: "The proposal, ___ was submitted yesterday, needs revision.", options: ["that", "which", "what"], answer: "which", explain: "A non-defining relative clause uses which." },
  { id: "g13", difficulty: 5, q: "Had I known about the delay, I ___ a later train.", options: ["would take", "would have taken", "had taken"], answer: "would have taken", explain: "This is an inverted third conditional." },
  { id: "g14", difficulty: 5, q: "It is essential that every applicant ___ the form personally.", options: ["signs", "signed", "sign"], answer: "sign", explain: "The mandative subjunctive uses the base form." },
  { id: "g15", difficulty: 5, q: "No sooner ___ the meeting than the fire alarm went off.", options: ["we started", "had we started", "we had started"], answer: "had we started", explain: "No sooner triggers inversion with Past Perfect." },
  { id: "g16", difficulty: 6, q: "The evidence is inconclusive, ___ compelling it may initially appear.", options: ["however", "despite", "although"], answer: "however", explain: "However + adjective introduces a concessive clause." },
  { id: "g17", difficulty: 6, q: "Were the policy ___, the consequences would be far-reaching.", options: ["to implement", "implemented", "implementing"], answer: "implemented", explain: "Formal conditional inversion uses were + past participle." },
  { id: "g18", difficulty: 6, q: "She spoke as though she ___ the outcome all along.", options: ["knew", "has known", "had known"], answer: "had known", explain: "Past Perfect expresses an unreal earlier situation." },
];

export const vocabularyQuestions: readonly TestQuestion[] = [
  { id: "v1", difficulty: 1, q: "Choose the natural phrase.", options: ["do a mistake", "make a mistake", "build mistake"], answer: "make a mistake", explain: "Make a mistake is the natural collocation." },
  { id: "v2", difficulty: 1, q: "In 'keep talking', keep means:", options: ["save", "continue", "hold"], answer: "continue", explain: "Keep + -ing means continue doing something." },
  { id: "v3", difficulty: 1, q: "Choose the best word: Can you ___ what you mean?", options: ["tell", "explain", "speak"], answer: "explain", explain: "Explain what you mean is natural." },
  { id: "v4", difficulty: 2, q: "I need to ___ my appointment to Friday.", options: ["borrow", "translate", "reschedule"], answer: "reschedule", explain: "Reschedule means move to another time." },
  { id: "v5", difficulty: 2, q: "If a task is challenging, it is:", options: ["finished", "difficult but possible", "pointless"], answer: "difficult but possible", explain: "Challenging often describes useful difficulty." },
  { id: "v6", difficulty: 2, q: "Choose the natural sentence.", options: ["I lost the bus.", "I failed the bus.", "I missed the bus."], answer: "I missed the bus.", explain: "Miss the bus is the standard collocation." },
  { id: "v7", difficulty: 3, q: "Her explanation was clear and ___, with no unnecessary detail.", options: ["concise", "scarce", "shallow"], answer: "concise", explain: "Concise means brief but complete." },
  { id: "v8", difficulty: 3, q: "The new schedule is flexible. In this context flexible means:", options: ["easy to change", "hard to understand", "strictly fixed"], answer: "easy to change", explain: "A flexible arrangement can be adjusted." },
  { id: "v9", difficulty: 3, q: "Choose the best collocation: ___ a decision.", options: ["perform", "make", "do"], answer: "make", explain: "English uses make a decision." },
  { id: "v10", difficulty: 4, q: "The manager was reluctant to approve the plan. Reluctant means:", options: ["unwilling or hesitant", "eager", "unable"], answer: "unwilling or hesitant", explain: "Reluctant describes hesitation or unwillingness." },
  { id: "v11", difficulty: 4, q: "His comment was taken out of context. This means it was:", options: ["translated accurately", "separated from information needed to understand it", "repeated loudly"], answer: "separated from information needed to understand it", explain: "Context supplies the surrounding meaning." },
  { id: "v12", difficulty: 4, q: "Choose the natural phrase: The results ___ our expectations.", options: ["exceeded", "overtook", "outgrew"], answer: "exceeded", explain: "Exceed expectations is the standard collocation." },
  { id: "v13", difficulty: 5, q: "The evidence appears compelling, but it is not conclusive. Conclusive means:", options: ["interesting", "decisive and proving something", "carefully hidden"], answer: "decisive and proving something", explain: "Conclusive evidence settles the question." },
  { id: "v14", difficulty: 5, q: "Her answer was deliberately ambiguous. Ambiguous means:", options: ["open to more than one interpretation", "completely false", "highly detailed"], answer: "open to more than one interpretation", explain: "Ambiguous language has multiple possible meanings." },
  { id: "v15", difficulty: 5, q: "Choose the best word: The report seeks to ___ a common misconception.", options: ["dispel", "scatter", "dismissal"], answer: "dispel", explain: "Dispel a misconception means show it is untrue." },
  { id: "v16", difficulty: 6, q: "The policy may inadvertently exacerbate the problem. Exacerbate means:", options: ["make worse", "describe precisely", "solve gradually"], answer: "make worse", explain: "Exacerbate means increase the severity of something." },
  { id: "v17", difficulty: 6, q: "His argument rests on a tenuous assumption. Tenuous means:", options: ["widely accepted", "weak and poorly supported", "highly technical"], answer: "weak and poorly supported", explain: "A tenuous claim has little substance or support." },
  { id: "v18", difficulty: 6, q: "The speaker gave a nuanced account of the dispute. Nuanced means:", options: ["showing subtle distinctions", "deliberately confusing", "strongly biased"], answer: "showing subtle distinctions", explain: "Nuanced thinking recognizes fine differences." },
];

export const speakingTopics = [
  "What’s something you’re proud of?",
  "Tell me about a place you want to visit.",
  "Describe your work without using your job title.",
  "What habit helped you recently?",
  "Tell me about a mistake that taught you something.",
];

export const speakingClubGroups = [
  {
    id: 1,
    level: "A1-A2",
    name: { en: "Speaking Club 1", ru: "Speaking Club 1" },
    subtitle: { en: "Beginner / Elementary", ru: "Начальный / Элементарный" },
    description: {
      en: "For those who are just starting to speak. Simple topics, basic phrases, a calm and supportive atmosphere.",
      ru: "Для тех, кто только начинает говорить. Простые темы, базовые фразы, спокойная и поддерживающая атмосфера.",
    },
  },
  {
    id: 2,
    level: "A2-B1",
    name: { en: "Speaking Club 2", ru: "Speaking Club 2" },
    subtitle: { en: "Pre-Intermediate", ru: "Ниже среднего" },
    description: {
      en: "You can build simple sentences and want to speak more freely. Everyday topics, friendly practice.",
      ru: "Вы строите простые предложения и хотите говорить свободнее. Повседневные темы, дружеская практика.",
    },
  },
  {
    id: 3,
    level: "B1",
    name: { en: "Speaking Club 3", ru: "Speaking Club 3" },
    subtitle: { en: "Intermediate", ru: "Средний" },
    description: {
      en: "You understand most conversations and can express your opinion. Discussions, debates, real-life situations.",
      ru: "Вы понимаете большинство разговоров и можете выражать мнение. Дискуссии, дебаты, жизненные ситуации.",
    },
  },
  {
    id: 4,
    level: "B2",
    name: { en: "Speaking Club 4", ru: "Speaking Club 4" },
    subtitle: { en: "Upper-Intermediate", ru: "Выше среднего" },
    description: {
      en: "You speak with confidence on many topics. Complex discussions, idioms, nuanced opinions.",
      ru: "Вы уверенно говорите на многие темы. Сложные обсуждения, идиомы, тонкие оттенки мнений.",
    },
  },
  {
    id: 5,
    level: "C1",
    name: { en: "Speaking Club 5", ru: "Speaking Club 5" },
    subtitle: { en: "Advanced", ru: "Продвинутый" },
    description: {
      en: "Near-fluent speaking. Abstract topics, professional discussions, spontaneous speech.",
      ru: "Речь, близкая к свободной. Абстрактные темы, профессиональные обсуждения, спонтанная речь.",
    },
  },
  {
    id: 6,
    level: "C2",
    name: { en: "Speaking Club 6", ru: "Speaking Club 6" },
    subtitle: { en: "Proficiency", ru: "Владение в совершенстве" },
    description: {
      en: "Fluent speakers who want to maintain and polish their English at the highest level.",
      ru: "Свободное владение для тех, кто хочет поддерживать и совершенствовать английский на высшем уровне.",
    },
  },
] as const;

export const testCategories = {
  exams: {
    title: { en: "Exam Preparation", ru: "Подготовка к экзаменам" },
    items: [
      {
        id: "ielts",
        name: { en: "IELTS Preparation", ru: "Подготовка к IELTS" },
        description: {
          en: "Comprehensive preparation for all four IELTS modules: Listening, Reading, Writing, and Speaking.",
          ru: "Комплексная подготовка ко всем четырём модулям IELTS: Listening, Reading, Writing и Speaking.",
        },
      },
      {
        id: "ege",
        name: { en: "ЕГЭ Preparation", ru: "Подготовка к ЕГЭ" },
        description: {
          en: "Preparation for the Unified State Exam in English: grammar, vocabulary, writing, and speaking sections.",
          ru: "Подготовка к ЕГЭ по английскому языку: грамматика, лексика, письмо и устная часть.",
        },
      },
      {
        id: "oge",
        name: { en: "ОГЭ Preparation", ru: "Подготовка к ОГЭ" },
        description: {
          en: "Preparation for the Basic State Exam: reading, listening, grammar, and speaking.",
          ru: "Подготовка к ОГЭ по английскому: чтение, аудирование, грамматика и устная часть.",
        },
      },
    ],
  },
  goals: {
    title: { en: "Your Goals", ru: "Ваши цели" },
    items: [
      {
        id: "travel",
        name: { en: "Traveling Abroad", ru: "К поездке за границу" },
        description: {
          en: "Learn practical English for airports, hotels, restaurants, asking for directions, and everyday situations while traveling.",
          ru: "Практический английский для аэропортов, отелей, ресторанов, ориентирования и повседневных ситуаций в путешествии.",
        },
      },
      {
        id: "study-abroad",
        name: { en: "Studying Abroad", ru: "К учёбе за границу" },
        description: {
          en: "Prepare for academic English: university lectures, essays, presentations, and campus communication.",
          ru: "Подготовка к академическому английскому: лекции, эссе, презентации и общение в университете.",
        },
      },
    ],
  },
} as const;

export function getLevelClubId(level: string): number {
  if (level.includes("C2")) return 6;
  if (level.includes("C1")) return 5;
  if (level.includes("B2")) return 4;
  if (level.includes("B1") && !level.includes("A2")) return 3;
  if (level.includes("A2") || level.includes("B1")) return 2;
  return 1;
}

export const navLinks = [
  { id: "about", type: "anchor" as const },
  { id: "method", type: "anchor" as const },
  { id: "speaking-club", type: "page" as const, href: "/speaking-club" },
  { id: "tests", type: "page" as const, href: "/tests" },
  { id: "prices", type: "anchor" as const },
  { id: "contacts", type: "anchor" as const },
] as const;

export const emptyCms = {
  reviews: [],
  media: [],
  visibility: {},
  draft: false,
};
