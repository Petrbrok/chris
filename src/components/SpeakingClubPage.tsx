"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  List,
  PaperPlaneTilt,
  TelegramLogo,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  contacts,
  Lang,
  speakingClubGroups,
  navLinks,
} from "@/lib/site";
import { content } from "@/lib/site";
import type { SiteContent } from "@/lib/site-overrides";
import { OfferStrip } from "@/components/OfferStrip";

export function SpeakingClubPage({ lang, siteContent = content }: { lang: Lang; siteContent?: SiteContent }) {
  const copy = siteContent[lang];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#f6f2ea] pb-24 text-[#172033]">
      <SpeakingClubBackground />
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
            Speaking Club
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#42506a] sm:text-xl">
            {lang === "ru"
              ? "Разговорная практика в небольших группах, разделённых по уровню. Найдите свою группу и начните говорить уверенно."
              : "Speaking practice in small groups divided by level. Find your group and start speaking with confidence."}
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {speakingClubGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={[
                "relative overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_50px_rgba(31,45,70,0.1)]",
                index === 0 ? "border-[#f3a51d]/30 bg-[#fff9e8]" : "",
                index === 1 ? "border-[#087bd3]/18 bg-white/76" : "",
                index === 2 ? "border-[#172033]/12 bg-[#edf7ff]" : "",
                index === 3 ? "border-[#f3a51d]/25 bg-[#fffcf0]" : "",
                index === 4 ? "border-[#087bd3]/16 bg-white/70" : "",
                index === 5 ? "border-[#172033]/10 bg-[#f0f8ff]" : "",
              ].join(" ")}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#087bd3] text-sm font-black text-white">
                  {group.id}
                </span>
                <span className="rounded-full bg-[#172033]/8 px-3 py-1.5 text-xs font-black tracking-wider text-[#172033]">
                  {group.level}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#087bd3]">
                {group.name[lang]}
              </h2>
              <p className="mt-1 text-sm font-bold text-[#9b5f08]">
                {group.subtitle[lang]}
              </p>
              <p className="mt-4 leading-7 text-[#42506a]">
                {group.description[lang]}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#20304b]">
                  <CheckCircle size={18} weight="fill" className="text-[#f3a51d]" />
                  {lang === "ru" ? "Небольшие группы" : "Small groups"}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#20304b]">
                  <CheckCircle size={18} weight="fill" className="text-[#f3a51d]" />
                  {lang === "ru" ? "Разговорная практика" : "Speaking practice"}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#20304b]">
                  <CheckCircle size={18} weight="fill" className="text-[#f3a51d]" />
                  {lang === "ru" ? "Дружеская атмосфера" : "Friendly atmosphere"}
                </div>
              </div>
              <motion.a
                href={`${lang === "en" ? "/en" : ""}/tests?level=${encodeURIComponent(group.level)}&club=${group.id}`}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f3a51d] px-5 py-3.5 font-black text-[#172033] shadow-[0_12px_30px_rgba(243,165,29,0.22)]"
              >
                {lang === "ru" ? "Записаться" : "Sign Up"} <ArrowRight size={16} weight="bold" />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[32px] bg-[#172033] p-6 text-white shadow-[0_30px_90px_rgba(23,32,51,0.2)] sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f3a51d]">
                {lang === "ru" ? "Не знаете свой уровень?" : "Not sure about your level?"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {lang === "ru"
                  ? "Пройдите тест и узнайте, какая группа подходит вам"
                  : "Take a test and find your perfect group"}
              </h2>
              <p className="mt-4 leading-7 text-white/70">
                {lang === "ru"
                  ? "Пройдите тест по грамматике или лексике. Мы определим ваш уровень и подберём подходящую группу Speaking Club."
                  : "Take a grammar or vocabulary test. We'll determine your level and match you with the right Speaking Club group."}
              </p>
              <motion.a
                href={lang === "en" ? "/en/tests" : "/tests"}
                whileHover={{ y: -2, scale: 1.025 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f3a51d] px-6 py-4 font-black text-[#172033]"
              >
                {lang === "ru" ? "Пройти тест" : "Take a Test"} <ArrowRight size={16} weight="bold" />
              </motion.a>
            </div>
            <div className="grid gap-3">
              {(lang === "ru" ? copy.clubPoints : content.en.clubPoints).map((point) => (
                <div
                  key={point}
                  className="flex items-center justify-between rounded-[20px] border border-white/14 bg-white/10 px-5 py-4"
                >
                  <span className="font-bold">{point}</span>
                  <CheckCircle size={22} weight="fill" className="text-[#f3a51d]" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function SpeakingClubBackground() {
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
      <Link className={`rounded-full px-3 py-2 ${lang === "ru" ? "bg-[#f3a51d]" : ""}`} href="/speaking-club">
        RU
      </Link>
      <Link className={`rounded-full px-3 py-2 ${lang === "en" ? "bg-[#f3a51d]" : ""}`} href="/en/speaking-club">
        EN
      </Link>
    </div>
  );
}
