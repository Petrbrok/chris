import { dbUnavailable, query } from "@/lib/db";
import { content } from "@/lib/site";

export type SiteContent = typeof content;

function isSiteContent(value: unknown): value is SiteContent {
  return Boolean(value && typeof value === "object" && "ru" in value && "en" in value);
}

export function mergeSiteContent(value: unknown): SiteContent {
  if (!isSiteContent(value)) return content;
  return mergeRecord(content, value) as SiteContent;
}

function mergeRecord(defaults: unknown, overrides: unknown): unknown {
  if (!defaults || typeof defaults !== "object" || Array.isArray(defaults)) {
    return overrides === undefined ? defaults : overrides;
  }
  const overrideRecord = overrides && typeof overrides === "object" && !Array.isArray(overrides)
    ? overrides as Record<string, unknown>
    : {};
  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => [
      key,
      mergeRecord(defaultValue, overrideRecord[key]),
    ]),
  );
}

export async function getSiteContent() {
  try {
    const result = await query<{ value: unknown }>(
      "select value from site_settings where key = $1 limit 1",
      ["site"],
    );
    const value = result.rows[0]?.value;
    return mergeSiteContent(value);
  } catch (error) {
    if (dbUnavailable(error)) return content;
    throw error;
  }
}
