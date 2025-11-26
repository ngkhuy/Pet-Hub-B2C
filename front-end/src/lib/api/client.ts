import z from "zod";

import { errorResponseSchema } from "@/lib/schemas/common";
import { authApiUrl } from "@/lib/data/api-url";
import { TokenResponseSchema } from "@/lib/schemas/auth";

export class HttpError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`HTTP Error ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch<TSchema extends z.ZodTypeAny>(
  url: string,
  init: RequestInit,
  schema: TSchema,
  retry = true
): Promise<z.infer<TSchema>> {
  "use client";
  const headers: HeadersInit = {
    ...(init.headers || {}),
  };
  // set access token header if available
  // const accessToken = await getAccessTokenFromCookie(); // call server function
  // if (accessToken) {
  //   headers = { ...headers, Authorization: `Bearer ${accessToken}` };
  // }
  // make the request
  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
  console.log("refresh token: ", res.headers.getSetCookie());
  // handle 401 Unauthorized by trying to refresh token once
  if (res.status === 401 && retry) {
    const ok = await tryRefreshToken();
    if (ok) {
      return apiFetch(url, init, schema, false);
    }
  }
  // handle non-2xx responses
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const json = safeJson(text);

    const parsedError = errorResponseSchema.safeParse(json);

    if (parsedError.success) {
      throw new HttpError(res.status, parsedError.data.detail);
    }

    throw new HttpError(res.status, text || res.statusText);
  }
  // handle 204 No Content
  if (res.status === 204) {
    return undefined as z.infer<TSchema>;
  }
  // parse and validate response body
  const jsonResponse = await res.json().catch(() => null);
  const result = schema.safeParse(jsonResponse);
  if (!result.success) {
    console.error("❌ Error while parsing RESPONSE:", result.error);
    // return raw json if validation fails
    return jsonResponse as z.infer<TSchema>;
  }
  // return validated data
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
    const res = await fetch(authApiUrl.REFRESH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) return false;
    const json = await res.json();
    const parsed = TokenResponseSchema.safeParse(json);
    if (!parsed.success) return false;
    return true;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return false;
  }
}
