export const formatVNPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (params: {
  date: Date | string | undefined;
  type?: "date" | "datetime";
}): string => {
  "use client";
  const { date, type = "datetime" } = params;

  if (!date) return "Chưa cập nhật";

  let d: Date;
  const fomatter = new Intl.DateTimeFormat(
    "vi-VN",
    type === "datetime"
      ? {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      : {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
  );

  if (typeof date === "string") {
    d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Chưa cập nhật";
  } else {
    d = date;
  }

  return fomatter.format(d);
};
