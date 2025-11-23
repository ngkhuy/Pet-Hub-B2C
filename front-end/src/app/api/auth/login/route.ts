import { log } from "console";

export async function POST(req: Request) {
  const res = await req.json();
  if (res.email !== "admin@admin.com" || res.password !== "admin123") {
    return Response.json(
      { detail: "Invalid email or password" },
      { status: 401 }
    );
  }
  log(res);
  return Response.json(
    {
      access_token: "dummy_access_token",
      token_type: "bearer",
    },
    {
      headers: {
        "Set-Cookie": "refresh_token=abcd1234; HttpOnly; Path=/; Max-Age=3600",
      },
    }
  );
}
