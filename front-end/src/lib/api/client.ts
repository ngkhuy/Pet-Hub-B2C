import z from "zod";
import { ENDPOINT as AUTH_ENDPOINT } from "@/lib/api/auth";
import { errorResponseSchema } from "@/lib/schemas/common";
import { TokenResponse } from "@/lib/schemas/auth";
import { UserType } from "@/lib/schemas/user";

export class HttpError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`HTTP Error ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
  }
}

class SessionToken {
  private token: string = "";

  get value() {
    return this.token;
  }

  set value(token: string) {
    if (window === undefined) {
      throw new Error("SessionToken can only be set in a browser environment");
    }

    this.token = token;
  }
}

class UserInfo {
  private info: UserType | null = null;

  get value() {
    return this.info;
  }

  set value(info: UserType | null) {
    if (window === undefined) {
      throw new Error("UserInfo can only be set in a browser environment");
    }

    this.info = info;
  }
}

export const sessionToken = new SessionToken();

export const userInfo = new UserInfo();

export async function apiFetch<TSchema extends z.ZodTypeAny>(
  url: string,
  init: RequestInit,
  schema: TSchema,
  retry = true
): Promise<z.infer<TSchema>> {
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  if (sessionToken.value) {
    headers = { ...headers, Authorization: `Bearer ${sessionToken.value}` };
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (res.status === 401 && retry) {
    const ok = await tryRefreshToken();
    if (ok) {
      return apiFetch(url, init, schema, false);
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const json = safeJson(text);

    const parsedError = errorResponseSchema.safeParse(json);

    if (parsedError.success) {
      throw new HttpError(res.status, parsedError.data.detail);
    }

    throw new HttpError(res.status, text || res.statusText);
  }

  if (res.status === 204) {
    return undefined as z.infer<TSchema>;
  }

  const json = await res.json().catch(() => null);

  const result = schema.safeParse(json);

  if (!result.success) {
    console.error("❌ Zod parse error:", result.error);
    throw new Error("Invalid API response format");
  }

  return result.data;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function tryRefreshToken() {
  try {
    const res = await fetch(AUTH_ENDPOINT.REFRESH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return false;

    const json = await res.json();
    const parsed = TokenResponse.safeParse(json);

    if (!parsed.success) return false;

    sessionToken.value = parsed.data.access_token;

    return true;
  } catch {
    return false;
  }
}
