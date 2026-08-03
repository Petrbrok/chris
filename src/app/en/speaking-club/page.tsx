import type { Metadata } from "next";
import { SpeakingClubPage } from "@/components/SpeakingClubPage";

export const metadata: Metadata = {
  title: "Speaking Club | Chris Matoz",
  description: "Small English speaking groups matched to your level.",
};

export default function Page() {
  return <SpeakingClubPage lang="en" />;
}
