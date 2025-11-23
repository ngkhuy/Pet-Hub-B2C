import z from "zod";

// Common schemas
export const isoDatetime = z.coerce.date();

// Common field schemas
export const stringField = ({
  label,
  min = 8,
  max = 50,
}: {
  label: string;
  min?: number;
  max?: number;
}) =>
  z
    .string(`Không được để trống`)
    .trim()
    .min(min, { error: () => `${label} ít nhất ${min} ký tự` })
    .max(max, { error: () => `${label} tối đa ${max} ký tự` });

export const passwordField = ({ label }: { label: string }) =>
  stringField({ label, min: 8, max: 100 });

export const emailField = () => z.email("Địa chỉ email không hợp lệ").trim();

export const birthDateField = (options?: { optional?: boolean }) => {
  const { optional = false } = options || { optional: false };

  const schema = z.iso.date("Ngày sinh không hợp lệ").refine(
    (date) => {
      if (optional && date === "") return true;

      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    },
    {
      message: "Người dùng phải từ 13 tuổi trở lên",
    }
  );

  return schema;
};

export function getNameAbbreviation(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export const utcDateField = () =>
  z.coerce.date().transform((d) => d.toUTCString());
//Commont search query schema
export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Common response schemas
export const errorResponseSchema = z.object({
  detail: z.string(),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const messageResponseSchema = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof messageResponseSchema>;
