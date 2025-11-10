import { ApiError } from "@/lib/http/errors";
import { ENV } from "@/config/env";

export async function request<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
) {
  const url = path.startsWith("http") ? path : `${ENV.API_URL}${path}`;
  const { timeoutMs = 15000, ...rest } = init;

  const headers = new Headers(rest.headers);
  // Set JSON content type by default
  if (
    !headers.has("Content-Type") &&
    rest.body &&
    !(rest.body instanceof FormData)
  )
    headers.set("Content-Type", "application/json");
  // Accept JSON responses by default
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  // Auto stringify JSON body
  const finalBody =
    rest.body &&
    headers.get("Content-Type")?.includes("application/json") &&
    typeof rest.body !== "string" &&
    !(rest.body instanceof Blob)
      ? JSON.stringify(rest.body)
      : rest.body;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      body: finalBody as BodyInit | null | undefined,
      headers,
      signal: ctrl.signal,
      cache: "no-store",
    });

    // 204/205: no content
    if (res.status === 204 || res.status === 205) {
      if (!res.ok) {
        throw new ApiError({
          status: res.status,
          statusText: res.statusText,
          url,
          method: (rest.method ?? "GET").toUpperCase(),
        });
      }
      return undefined as T;
    }

    const ctype = res.headers.get("content-type") || "";
    let data: unknown;

    if (ctype.includes("application/json")) {
      try {
        data = (await res.json()) as T;
      } catch {
        data = await res.text();
      }
    } else if (ctype.startsWith("text/")) {
      data = await res.text();
    } else {
      data = await res.blob();
    }

    if (!res.ok) {
      throw new ApiError({
        status: res.status,
        statusText: res.statusText,
        url,
        method: (rest.method ?? "GET").toUpperCase(),
        detail: data,
      });
    }

    return data as T;
  } finally {
    clearTimeout(t);
  }
}

export const get = <T>(u: string, i?: RequestInit) =>
  request<T>(u, { method: "GET", ...i });
export const post = <T>(u: string, body?: unknown, i?: RequestInit) =>
  request<T>(u, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...i,
  });
