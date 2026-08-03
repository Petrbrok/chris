import type { Metadata } from "next";
import { SpeakingClubPage } from "@/components/SpeakingClubPage";
import { getSiteContent } from "@/lib/site-overrides";

export const metadata: Metadata = {
  title: "Speaking Club | Chris Matoz",
  description:
    "Разговорная практика в небольших группах по уровням от Beginner до Proficiency. Speaking Club с Chris Matoz.",
};

export default async function Page() {
  return <SpeakingClubPage lang="ru" siteContent={await getSiteContent()} />;
}
