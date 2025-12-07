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
  needsAuth: boolean = true,
  timeoutMs: number | undefined = 30000, // default 30s
  retryCount: number = 3, // số lần retry
  backoffBase: number = 500 // delay base = 0.5s
): Promise<z.infer<TSchema>> {
  // -----------------------------
  // Function thực hiện 1 request
  // -----------------------------
  const makeRequest = async (attempt: number): Promise<Response> => {
    let headers: HeadersInit = {
      ...(init.headers || {}),
    };

    // Attach token
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

    // Timeout controller
    const controller = new AbortController();
    const timeoutId =
      timeoutMs != null
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

    try {
      const res = await fetch(url, {
        ...init,
        headers,
        credentials: "include",
        signal: controller.signal,
      });
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new HttpError(408, "Request timeout");
      }
      throw err;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  // -----------------------------
  // Retry + Exponential Backoff
  // -----------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lastError: any = null;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const res = await makeRequest(attempt);

      // Nếu response OK → return luôn
      if (res.ok) return handleResponse(res, schema);

      // Lỗi 4xx không retry
      if (res.status >= 400 && res.status < 500) {
        throw await handleHTTPError(res);
      }

      // Lỗi 5xx → retry
      lastError = await handleHTTPErrorAsObject(res);
    } catch (err) {
      lastError = err;

      // AbortError hoặc lỗi mạng → retry
      if (err instanceof HttpError && err.status === 408) {
        // timeout → retry
      } else if (err instanceof TypeError) {
        // network error → retry
      } else {
        break; // lỗi khác → không retry
      }
    }

    // Nếu còn retry → chờ backoff
    if (attempt < retryCount) {
      const delay = exponentialBackoff(attempt, backoffBase);
      await sleep(delay);
    }
  }

  // Hết retry → throw lỗi cuối cùng
  throw lastError instanceof HttpError
    ? lastError
    : new HttpError(500, lastError?.message || "Network error");
}

// -------------------------------------------------
// Utils
// -------------------------------------------------

function exponentialBackoff(attempt: number, base: number) {
  const expo = base * Math.pow(2, attempt);
  const jitter = expo * (0.5 + Math.random()); // tránh spike đồng loạt
  return jitter;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleHTTPError(res: Response): Promise<never> {
  const response = await res.json().catch(() => "");
  const err = response === "" ? await res.text().catch(() => "") : response;

  const parsedErr = errorResponseSchema.safeParse(err);
  if (parsedErr.success) {
    const errorData = parsedErr.data.detail;
    if (typeof errorData === "string") {
      throw new HttpError(res.status, errorData);
    } else {
      throw new HttpError(res.status, JSON.stringify(errorData));
    }
  }
  const parsedMsg = MessageResponseSchema.safeParse(err);
  if (parsedMsg.success) {
    throw new HttpError(res.status, parsedMsg.data.message);
  }
  throw new HttpError(res.status, err || "Unknown error");
}

// Dùng cho retry — return object thay vì throw để retry dễ kiểm soát
async function handleHTTPErrorAsObject(res: Response) {
  const response = await res.json().catch(() => "");
  const err = response === "" ? await res.text().catch(() => "") : response;
  return new HttpError(
    res.status,
    err?.detail || err?.message || "Server error"
  );
}

async function handleResponse<TSchema extends z.ZodTypeAny>(
  res: Response,
  schema: TSchema
) {
  if (res.status === 204) return undefined as z.infer<TSchema>;

  const jsonResponse = await res.json().catch(() => null);
  const parsed = schema.safeParse(jsonResponse);

  if (!parsed.success) {
    console.error("❌ Error parsing RESPONSE:", parsed.error);
    return jsonResponse as z.infer<TSchema>;
  }

  return parsed.data;
}
