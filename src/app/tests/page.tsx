import type { Metadata } from "next";
import { TestsPage } from "@/components/TestsPage";
import { getSiteContent } from "@/lib/site-overrides";

export const metadata: Metadata = {
  title: "Тесты и подготовка | Chris Matoz",
  description:
    "Определите свой уровень английского, подготовьтесь к IELTS, ЕГЭ, ОГЭ. Тесты и запись в Speaking Club.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ level?: string; club?: string }> }) {
  const params = await searchParams;
  const siteContent = await getSiteContent();
  const clubId = Number(params.club);
  return <TestsPage lang="ru" siteContent={siteContent} initialLevel={params.level} initialClubId={Number.isInteger(clubId) && clubId >= 1 && clubId <= 6 ? clubId : undefined} />;
}
