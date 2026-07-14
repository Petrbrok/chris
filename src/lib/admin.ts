export function adminToken() {
  return process.env.ADMIN_TOKEN || "chris-admin-token";
}

export function isAuthorized(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return token === adminToken();
}

export function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [keys.join(","), ...rows.map((row) => keys.map((key) => escape(row[key])).join(","))].join("\n");
}
