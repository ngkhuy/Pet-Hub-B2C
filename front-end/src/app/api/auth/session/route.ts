import { decrypt } from "@/lib/actions/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { access_token } = await request.json();
  const access_token_payload = await decrypt(access_token);
  if (!access_token_payload) {
    return NextResponse.json(
      { message: "Invalid access token" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({
    message: "Access token was be set in cookies successfully",
    access_token_payload: access_token_payload,
  });
  response.cookies.set({
    name: "access_token",
    value: access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // just send the cookie in same-site requests
    path: "/", // allow access to the token from all paths
    expires: (access_token_payload?.exp ?? 0) * 1000,
  });
  return response;
}
