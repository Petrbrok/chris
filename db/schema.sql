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
