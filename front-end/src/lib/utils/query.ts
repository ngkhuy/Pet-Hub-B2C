function toQueryString(
  obj: Record<string, string | number | boolean | Date | undefined | null>
): string {
  const params = new URLSearchParams();
  let str: string;
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;

    if (value instanceof Date) {
      str = value.toISOString();
    } else if (typeof value === "boolean") {
      str = value ? "true" : "false";
    } else {
      str = String(value);
    }

    params.append(key, str);
  }

  return params.toString();
}

export const buildQueryURL = (
  path: string,
  query?: Record<string, string | number | boolean | Date | undefined | null>
) => {
  if (!query) return path;
  const qs = toQueryString(query);
  return `${path}?${qs}`;
};
