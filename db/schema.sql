create table if not exists admin_users (
  id bigserial primary key,
  username text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists localized_content (
  id bigserial primary key,
  lang text not null check (lang in ('ru', 'en')),
  section text not null,
  key text not null,
  value text not null,
  status text not null default 'published',
  updated_at timestamptz not null default now(),
  unique (lang, section, key)
);

create table if not exists contacts (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists prices (
  id bigserial primary key,
  lang text not null check (lang in ('ru', 'en')),
  title text not null,
  price text not null,
  sort_order integer not null default 0,
  status text not null default 'published'
);

create table if not exists faq_items (
  id bigserial primary key,
  lang text not null check (lang in ('ru', 'en')),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  status text not null default 'published'
);

create table if not exists reviews (
  id bigserial primary key,
  lang text not null check (lang in ('ru', 'en')),
  author text,
  text text not null,
  sort_order integer not null default 0,
  status text not null default 'draft'
);

create table if not exists speaking_club_events (
  id bigserial primary key,
  lang text not null check (lang in ('ru', 'en')),
  title text not null,
  event_date date,
  event_time text,
  topic text,
  description text,
  price text,
  signup_url text,
  status text not null default 'draft'
);

create table if not exists test_questions (
  id bigserial primary key,
  kind text not null check (kind in ('grammar', 'vocabulary')),
  lang text not null default 'en',
  question text not null,
  options jsonb not null,
  answer text not null,
  explanation text not null,
  sort_order integer not null default 0,
  status text not null default 'published'
);

create table if not exists speaking_topics (
  id bigserial primary key,
  lang text not null default 'en',
  topic text not null,
  sort_order integer not null default 0,
  status text not null default 'published'
);

create table if not exists leads (
  id bigserial primary key,
  name text,
  contact text not null,
  message text,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table if not exists test_results (
  id bigserial primary key,
  kind text not null,
  name text,
  contact text,
  score integer,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists speaking_submissions (
  id bigserial primary key,
  name text not null,
  telegram text not null,
  topic text not null,
  audio_url text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists media_records (
  id bigserial primary key,
  title text not null,
  url text not null,
  media_type text not null default 'image',
  storage_mode text not null default 'url',
  created_at timestamptz not null default now()
);

create table if not exists stats_events (
  id bigserial primary key,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists block_visibility (
  block_key text primary key,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Telegram learning bot -----------------------------------------------------

create table if not exists bot_students (
  id bigserial primary key,
  telegram_user_id bigint unique,
  telegram_username text,
  telegram_first_name text,
  real_name text not null,
  phone text,
  student_kind text not null default 'new' check (student_kind in ('new', 'existing')),
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'archived')),
  language text not null default 'ru' check (language in ('ru', 'en')),
  level text,
  goals text,
  weak_points text,
  teacher_notes text,
  invite_code text unique,
  is_admin_profile boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

alter table bot_students add column if not exists is_admin_profile boolean not null default false;

create table if not exists bot_sessions (
  telegram_user_id bigint primary key,
  state text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists bot_assignment_templates (
  id bigserial primary key,
  slug text not null unique,
  category text not null,
  difficulty text not null default 'any',
  title_ru text not null,
  title_en text not null,
  prompt_ru text not null,
  prompt_en text not null,
  banned_words jsonb not null default '[]'::jsonb,
  response_kind text not null default 'voice' check (response_kind in ('voice', 'text')),
  ai_config jsonb not null default '{"enabled": false}'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists bot_student_assignments (
  id bigserial primary key,
  student_id bigint not null references bot_students(id) on delete cascade,
  template_id bigint not null references bot_assignment_templates(id),
  status text not null default 'assigned' check (status in ('assigned', 'submitted', 'reviewed', 'skipped')),
  assigned_by text not null default 'bot',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, template_id)
);

create table if not exists bot_voice_submissions (
  id bigserial primary key,
  student_id bigint not null references bot_students(id) on delete cascade,
  student_assignment_id bigint references bot_student_assignments(id) on delete set null,
  telegram_file_id text not null,
  telegram_file_unique_id text,
  audio_url text,
  duration_seconds integer,
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  teacher_feedback text,
  teacher_audio_file_id text,
  ai_status text not null default 'disabled' check (ai_status in ('disabled', 'queued', 'processing', 'ready', 'failed')),
  ai_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists bot_availability_slots (
  id bigserial primary key,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  lesson_mode text not null check (lesson_mode in ('online', 'offline')),
  location text,
  status text not null default 'available' check (status in ('available', 'booked', 'blocked', 'cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists bot_lesson_bookings (
  id bigserial primary key,
  slot_id bigint not null unique references bot_availability_slots(id) on delete cascade,
  student_id bigint not null references bot_students(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  student_note text,
  created_at timestamptz not null default now()
);

create table if not exists bot_student_events (
  id bigserial primary key,
  student_id bigint not null references bot_students(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists bot_runtime_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists bot_students_status_idx on bot_students(status);
create index if not exists bot_voice_pending_idx on bot_voice_submissions(status, created_at desc);
create index if not exists bot_slots_available_idx on bot_availability_slots(status, starts_at);
create index if not exists bot_events_student_idx on bot_student_events(student_id, created_at desc);

insert into bot_assignment_templates
  (slug, category, difficulty, title_ru, title_en, prompt_ru, prompt_en, banned_words, sort_order)
values
  ('umbrella-no-word', 'explain', 'beginner', 'Объясни без слова', 'Explain without the word', 'Объясни слово umbrella, не используя слова umbrella и rain. Говори 20–40 секунд.', 'Explain umbrella without using the words umbrella or rain. Speak for 20–40 seconds.', '["umbrella", "rain"]', 10),
  ('airport-no-word', 'explain', 'beginner', 'Аэропорт без подсказок', 'Airport without clues', 'Объясни слово airport, не используя plane, fly и travel.', 'Explain airport without using plane, fly, or travel.', '["plane", "fly", "travel"]', 20),
  ('confidence-no-word', 'explain', 'intermediate', 'Что такое уверенность?', 'What is confidence?', 'Объясни слово confidence, не используя confident, sure и brave.', 'Explain confidence without using confident, sure, or brave.', '["confident", "sure", "brave"]', 30),
  ('job-no-title', 'explain', 'any', 'Работа без должности', 'Job without a title', 'Расскажи, чем ты занимаешься, не называя свою профессию или должность.', 'Describe your work without naming your profession or job title.', '[]', 40),
  ('seven-second-weekend', 'reflex', 'beginner', 'Ответ за 7 секунд', 'Seven-second answer', 'Начни отвечать сразу: What did you do last weekend? Не готовь идеальный ответ.', 'Start immediately: What did you do last weekend? Do not prepare a perfect answer.', '[]', 50),
  ('seven-second-choice', 'reflex', 'beginner', 'Быстрый выбор', 'Quick choice', 'Coffee or tea? Выбери и за 30 секунд объясни почему.', 'Coffee or tea? Choose one and explain why for 30 seconds.', '[]', 60),
  ('seven-second-change', 'reflex', 'intermediate', 'Что бы ты изменил?', 'What would you change?', 'Начни ответ за 7 секунд: What is one thing you would change about your city?', 'Start within seven seconds: What is one thing you would change about your city?', '[]', 70),
  ('rescue-forgot-word', 'rescue', 'beginner', 'Забыл слово', 'Forgot a word', 'Ты забыл нужное слово в разговоре. Запиши три английские фразы, которые помогут не замолчать.', 'You forgot a word during a conversation. Record three English phrases that help you keep talking.', '[]', 80),
  ('rescue-did-not-understand', 'rescue', 'beginner', 'Не понял собеседника', 'Did not understand', 'Собеседник говорит слишком быстро. Вежливо останови его и уточни смысл, не переходя на русский.', 'The other person is speaking too quickly. Politely stop them and clarify the meaning in English.', '[]', 90),
  ('rescue-buy-time', 'rescue', 'intermediate', 'Выиграй время', 'Buy some time', 'Ответь на сложный вопрос и естественно используй три фразы, которые дают время подумать.', 'Answer a difficult question and naturally use three phrases that give you time to think.', '[]', 100),
  ('three-ways-late', 'flexibility', 'beginner', 'Одна мысль — три способа', 'One thought, three ways', 'Скажи «Я опоздаю» тремя разными способами: просто, вежливо и уверенно.', 'Say “I will be late” in three ways: simple, polite, and confident.', '[]', 110),
  ('three-ways-disagree', 'flexibility', 'intermediate', 'Не согласись по-разному', 'Disagree three ways', 'Вырази несогласие тремя способами: мягко, нейтрально и прямо.', 'Disagree in three ways: gently, neutrally, and directly.', '[]', 120),
  ('three-ways-help', 'flexibility', 'beginner', 'Попроси о помощи', 'Ask for help', 'Попроси о помощи тремя разными естественными фразами.', 'Ask for help using three different natural phrases.', '[]', 130),
  ('story-photo', 'story', 'any', 'Кадр без фотографии', 'A photo without a photo', 'Опиши фотографию из телефона так, чтобы Крис представил её, не видя изображения.', 'Describe a photo from your phone so Chris can imagine it without seeing it.', '[]', 140),
  ('story-mistake', 'story', 'intermediate', 'Ошибка, которая помогла', 'A useful mistake', 'Расскажи об ошибке, которая научила тебя чему-то полезному. 60–90 секунд.', 'Tell a story about a mistake that taught you something useful. Speak for 60–90 seconds.', '[]', 150),
  ('story-small-win', 'story', 'beginner', 'Маленькая победа', 'A small win', 'Расскажи о небольшой победе этой недели: что произошло и почему это важно.', 'Tell Chris about a small win from this week: what happened and why it matters.', '[]', 160),
  ('opinion-phones', 'opinion', 'intermediate', 'Телефоны за столом', 'Phones at the table', 'Нужно ли запрещать телефоны за столом? Дай мнение, причину и пример.', 'Should phones be banned at the table? Give an opinion, a reason, and an example.', '[]', 170),
  ('opinion-workweek', 'opinion', 'intermediate', 'Четырёхдневная неделя', 'Four-day workweek', 'Четырёхдневная рабочая неделя — хорошая идея? Назови плюс, минус и свой вывод.', 'Is a four-day workweek a good idea? Give one benefit, one drawback, and your conclusion.', '[]', 180),
  ('opinion-travel', 'opinion', 'beginner', 'План или спонтанность', 'Plan or spontaneity', 'Что лучше в путешествии: подробный план или спонтанность? Объясни выбор.', 'What is better when travelling: a detailed plan or spontaneity? Explain your choice.', '[]', 190),
  ('mission-reschedule', 'real_life', 'beginner', 'Перенеси встречу', 'Reschedule a meeting', 'Запиши голосовое коллеге: тебе нужно перенести встречу, предложить новое время и извиниться.', 'Record a voice message to a colleague: reschedule a meeting, suggest a new time, and apologize.', '[]', 200),
  ('mission-return', 'real_life', 'intermediate', 'Верни покупку', 'Return a purchase', 'Объясни продавцу, почему хочешь вернуть покупку, и спокойно попроси решение.', 'Explain to a shop assistant why you want to return a purchase and calmly ask for a solution.', '[]', 210),
  ('mission-recommend', 'real_life', 'beginner', 'Посоветуй фильм', 'Recommend a film', 'Убеди друга посмотреть выбранный тобой фильм, не пересказывая весь сюжет.', 'Convince a friend to watch a film you chose without retelling the whole plot.', '[]', 220),
  ('mission-directions', 'real_life', 'beginner', 'Объясни дорогу', 'Give directions', 'Объясни иностранцу, как дойти от твоего дома до ближайшего магазина.', 'Explain to a visitor how to get from your home to the nearest shop.', '[]', 230),
  ('club-warmup-change', 'club', 'intermediate', 'Разминка Speaking Club', 'Speaking Club warm-up', 'Тема клуба: Change. Назови изменение, которого ты боялся, и что произошло после него.', 'Club topic: Change. Describe a change you were afraid of and what happened afterwards.', '[]', 240),
  ('club-question-maker', 'club', 'any', 'Создай вопросы для клуба', 'Create club questions', 'Придумай три открытых вопроса на тему friendship. На них нельзя ответить yes или no.', 'Create three open questions about friendship. They must not be answerable with yes or no.', '[]', 250),
  ('retell-news', 'summary', 'intermediate', 'Новость своими словами', 'News in your own words', 'Выбери короткую новость и перескажи её своими словами без чтения текста.', 'Choose a short news story and retell it in your own words without reading the text.', '[]', 260),
  ('explain-how-to', 'explain', 'beginner', 'Научи Криса', 'Teach Chris', 'Объясни по-английски, как приготовить простое блюдо или выполнить знакомое действие.', 'Explain in English how to cook a simple dish or complete a familiar task.', '[]', 270),
  ('describe-with-senses', 'description', 'intermediate', 'Пять чувств', 'Five senses', 'Опиши любимое место через звуки, запахи, цвета и ощущения, не называя само место до конца.', 'Describe a favourite place through sounds, smells, colours, and feelings. Do not name it until the end.', '[]', 280),
  ('self-correction', 'reflection', 'any', 'Услышь себя', 'Listen to yourself', 'Расскажи о своём дне 45 секунд, переслушай запись и повтори её яснее и короче.', 'Talk about your day for 45 seconds, listen back, then repeat it more clearly and briefly.', '[]', 290),
  ('simple-english-tech', 'explain', 'intermediate', 'Сложное простыми словами', 'Complex idea, simple English', 'Объясни ребёнку, что такое искусственный интеллект, используя только простые английские слова.', 'Explain artificial intelligence to a child using only simple English words.', '[]', 300)
on conflict (slug) do nothing;
