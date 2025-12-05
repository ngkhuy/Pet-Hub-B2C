import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({
    message: "Logged out from next server successfully",
  });

  response.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}
