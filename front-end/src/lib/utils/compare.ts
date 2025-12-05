export function isDifferent<T extends Record<string, unknown>>(
  original: T,
  current: T
): boolean {
  return Object.entries(current).some(([key, value]) => current[key] !== value);
}
