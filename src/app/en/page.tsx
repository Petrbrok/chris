import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { seo } from "@/lib/site";
import { getSiteContent } from "@/lib/site-overrides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: seo.en.title,
  description: seo.en.description,
  alternates: {
    canonical: seo.en.path,
    languages: {
      ru: seo.ru.path,
      en: seo.en.path,
      "x-default": seo.ru.path,
    },
  },
};

export default async function Page() {
  const siteContent = await getSiteContent();
  return <HomePage lang="en" siteContent={siteContent} />;
}
