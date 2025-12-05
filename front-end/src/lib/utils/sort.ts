import { PetTypeType, ServiceType, ServiceTypeType } from "@/lib/types/booking";

export function scoreString(str: string, keyword: string) {
  const s = str.toLowerCase();
  const k = keyword.toLowerCase();

  // 1. Exact match
  if (s === k) return 10000;

  // 2. Prefix match
  if (s.startsWith(k)) return 9000;

  // 3. Word-start match
  if (s.split(/\s+/).some((w) => w.startsWith(k))) return 8000;

  // 4. Substring match
  if (s.includes(k)) return 7000;

  // 5. Weighted character score (thô)
  let charScore = 0;
  for (const ch of k) {
    if (s.includes(ch)) charScore += 10;
  }

  // 6. Penalty for long strings
  const lengthPenalty = Math.max(0, 200 - s.length);

  return charScore + lengthPenalty;
}

const SERVICE_TYPE_ORDER: Record<ServiceTypeType, number> = {
  Hotel: 0,
  Spa: 1,
};

const PET_TYPE_ORDER: Record<PetTypeType, number> = {
  All: 0,
  Dog: 1,
  Cat: 2,
};

export function compareService(
  a: ServiceType,
  b: ServiceType,
  keyword: string | undefined
) {
  const k = keyword?.trim() ?? "";

  if (k) {
    const scoreA = scoreString(a.name, k);
    const scoreB = scoreString(b.name, k);
    if (scoreA !== scoreB) return scoreB - scoreA;
  }

  if (a.price_per_hour !== b.price_per_hour) {
    return a.price_per_hour - b.price_per_hour;
  }

  const durA = a.duration_hours ?? Number.POSITIVE_INFINITY;
  const durB = b.duration_hours ?? Number.POSITIVE_INFINITY;
  if (durA !== durB) return durA - durB;

  const stA = SERVICE_TYPE_ORDER[a.service_type];
  const stB = SERVICE_TYPE_ORDER[b.service_type];
  if (stA !== stB) return stA - stB;

  const ptA = PET_TYPE_ORDER[a.pet_type];
  const ptB = PET_TYPE_ORDER[b.pet_type];
  if (ptA !== ptB) return ptA - ptB;

  return a.name.localeCompare(b.name);
}
