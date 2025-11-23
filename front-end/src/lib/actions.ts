"use server";

import { cookies } from "next/headers";

export async function logoutServerAction() {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
  cookieStore.delete("session_token");
}

export async function setSessionTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    path: "/",
  });
}

export async function updateSessionTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
}
