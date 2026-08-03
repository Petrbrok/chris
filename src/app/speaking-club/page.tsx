import type { Metadata } from "next";
import { SpeakingClubPage } from "@/components/SpeakingClubPage";

export const metadata: Metadata = {
  title: "Speaking Club | Chris Matoz",
  description:
    "Разговорная практика в небольших группах по уровням от Beginner до Proficiency. Speaking Club с Chris Matoz.",
};

export default function Page() {
  return <SpeakingClubPage lang="ru" />;
}
