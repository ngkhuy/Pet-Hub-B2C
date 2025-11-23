import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRegex =
  /^\/(login|register|forgot-password(\/.*)?|reset-password(\/.*)?)$/;

const privateRegex = /^\/(account|admin)(\/.*)?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token");

  const hasSessionToken = Boolean(sessionToken?.value);

  if (hasSessionToken && authRegex.test(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!hasSessionToken && privateRegex.test(pathname)) {
    const callback = pathname + request.nextUrl.search;
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", callback);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
