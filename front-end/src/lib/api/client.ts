import z from "zod";

import {
  errorResponseSchema,
  MessageResponseSchema,
} from "@/lib/schemas/common";
import { getAccessToken } from "@/lib/stores/auth-store";

export class HttpError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`HTTP Error ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
  }
}

const isClient = typeof window !== "undefined";

export async function apiFetch<TSchema extends z.ZodTypeAny>(
  url: string,
  init: RequestInit,
  schema: TSchema,
  needsAuth: boolean = true
): Promise<z.infer<TSchema>> {
  let headers: HeadersInit = {
    ...(init.headers || {}),
  };

  if (isClient && needsAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
    } else {
      throw new HttpError(401, "Không có token xác thực");
    }
  }

  // make the request
  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });

  // handle non-2xx responses
  if (!res.ok) {
    // const text = await res.text().catch(() => "");
    const response = await res.json().catch(() => "");
    const err = response === "" ? res.text().catch(() => "") : response;
    const parsedErrorResponse = errorResponseSchema.safeParse(err);

    if (parsedErrorResponse.success) {
      throw new HttpError(res.status, parsedErrorResponse.data.detail);
    }

    const parsedMessageResponse = MessageResponseSchema.safeParse(err);
    if (parsedMessageResponse.success) {
      throw new HttpError(res.status, parsedMessageResponse.data.message);
    }

    throw new HttpError(res.status, err || "Unknown error");
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

// function safeJson(text: string) {
//   try {
//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// }
