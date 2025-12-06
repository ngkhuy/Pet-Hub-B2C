export const formatVNPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export const formatDate = (params: {
  date: Date | string | undefined;
  type?: "date" | "datetime" | "short-datetime";
}): string => {
  const { date, type = "datetime" } = params;
  if (!date) return "Chưa cập nhật";

  let d: Date;
  const fomatter =
    type === "datetime"
      ? dateTimeFormatter
      : type === "short-datetime"
      ? shortDateTimeFormatter
      : dateFormatter;

  if (typeof date === "string") {
    d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Chưa cập nhật";
  } else if (date instanceof Date) {
    d = date;
  } else {
    return "Chưa cập nhật";
  }

  return fomatter.format(d);
};

const shortDateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const currencyFormat = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return currencyFormatter.format(numAmount);
};
