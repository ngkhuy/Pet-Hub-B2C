import { addHours, format } from "date-fns";

export const formatVNPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

/**
 * Format date for display (e.g. "10:00 20/10/2023")
 * Input: UTC Date/String/Number
 * Output: VN Local Time String
 */
export const formatDate = (params: {
  date: Date | string | number | undefined | null;
  type?: "date" | "datetime" | "short-datetime";
  isVietNamTime?: boolean;
}): string => {
  const { date, type = "datetime", isVietNamTime = true } = params;

  if (!date) return "Chưa cập nhật";

  let d: Date;

  if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Chưa cập nhật";
  } else if (date instanceof Date) {
    d = date;
  } else {
    return "Chưa cập nhật";
  }

  const vietnamDate = isVietNamTime ? addHours(d, 7) : d;

  const formatString =
    type === "datetime"
      ? "HH:mm:ss dd/MM/yyyy"
      : type === "short-datetime"
      ? "HH:mm dd/MM/yyyy"
      : "dd/MM/yyyy";

  return format(vietnamDate, formatString);
};

export function getNameAbbreviation(name: string | null | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * Format date for input datetime-local (yyyy-MM-ddThh:mm)
 * Input: UTC Date/String/Number
 * Output: VN Local Time String for Input
 * Example: UTC 03:00 -> VN 10:00 -> "2023-10-10T10:00"
 */
export const formatDateForInput = (
  date: Date | string | number = new Date()
) => {
  const d = new Date(date);
  const vietnamDate = addHours(d, 7);
  // format from date-fns uses local system timezone by default
  return format(vietnamDate, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Format date for backend (UTC ISO string)
 * Input: Local Time Date/String (from input)
 * Output: UTC ISO String
 * Example: Input "2023-10-10T10:00" (VN) -> UTC "2023-10-10T03:00:00.000Z"
 */
export const formatDateForBackend = (date: Date | string) => {
  const d = new Date(date);
  return d.toISOString();
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const currencyFormat = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return currencyFormatter.format(numAmount);
};
