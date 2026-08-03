import type { Metadata } from "next";
import { TestsPage } from "@/components/TestsPage";
import { getSiteContent } from "@/lib/site-overrides";

export const metadata: Metadata = {
  title: "Tests and preparation | Chris Matoz",
  description: "Check your English level and choose the right Speaking Club group.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ level?: string; club?: string }> }) {
  const params = await searchParams;
  const siteContent = await getSiteContent();
  const clubId = Number(params.club);
  return <TestsPage lang="en" siteContent={siteContent} initialLevel={params.level} initialClubId={Number.isInteger(clubId) && clubId >= 1 && clubId <= 6 ? clubId : undefined} />;
}
