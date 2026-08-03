import type { Metadata } from "next";
import { SpeakingClubPage } from "@/components/SpeakingClubPage";
import { getSiteContent } from "@/lib/site-overrides";

export const metadata: Metadata = {
  title: "Speaking Club | Chris Matoz",
  description: "Small English speaking groups matched to your level.",
};

export default async function Page() {
  return <SpeakingClubPage lang="en" siteContent={await getSiteContent()} />;
}
