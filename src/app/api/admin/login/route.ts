import { adminToken } from "@/lib/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "");
  const password = String(body.password || "");

  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "chris123";

  if (username !== expectedUser || password !== expectedPassword) {
    return Response.json({ error: "invalid credentials" }, { status: 401 });
  }

  return Response.json({ token: adminToken() });
}
