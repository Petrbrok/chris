import { dbUnavailable, query } from "@/lib/db";
import { content } from "@/lib/site";

export type SiteContent = typeof content;

function isSiteContent(value: unknown): value is SiteContent {
  return Boolean(value && typeof value === "object" && "ru" in value && "en" in value);
}

export async function getSiteContent() {
  try {
    const result = await query<{ value: unknown }>(
      "select value from site_settings where key = $1 limit 1",
      ["site"],
    );
    const value = result.rows[0]?.value;
    return isSiteContent(value) ? value : content;
  } catch (error) {
    if (dbUnavailable(error)) return content;
    throw error;
  }
}
