import * as z from "zod";

function normalizeParams(
  params: Record<string, string | string[] | undefined>
) {
  const normalized: Record<string, string | undefined> = {};

  for (const key in params) {
    const value = params[key];
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }
  return normalized;
}

export function validateSearchParams<T>(
  schema: z.ZodType<T>,
  searchParams: Record<string, string | string[] | undefined>,
  fallback: T
): T {
  const normalized = normalizeParams(searchParams);
  const result = schema.safeParse(normalized);
  return result.success ? result.data : fallback;
}
