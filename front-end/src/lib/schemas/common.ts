import z from "zod";

// Common schemas
export const isoDatetime = z.coerce.date();

// Common field schemas
export const futureDateField = (label: string, message: string) =>
  z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
    },
    { message: `${label} phải là một ngày trong tương lai` }
  );

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
  stringField({ label, min: 3, max: 100 });

export const emailField = () => z.email("Địa chỉ email không hợp lệ").trim();

export const birthDateField = (options?: {
  optional?: boolean;
  minimumAge?: number;
  message?: string;
}) => {
  const { optional = false } = options || { optional: false };

  const minAge = options?.minimumAge ?? 13;
  const errorMessage = options?.message
    ? options.message
    : `Ngày sinh không hợp lệ, phải từ ${minAge} tuổi trở lên`;

  const schema = z.string({ message: "Ngày sinh không hợp lệ" }).refine(
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
        return age - 1 >= minAge;
      }
      return age >= minAge;
    },
    {
      message: errorMessage,
    }
  );

  return schema;
};

export const utcDateField = () =>
  z.string().transform((date) => new Date(date).toISOString());
//Commont search query schema

// booking query schema
export const BookingPaginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export type BookingPaginationQueryType = z.infer<typeof BookingPaginationQuery>;

export const ServicePaginationQuery = BookingPaginationQuery.extend({
  pet_type: z.literal(["Dog", "Cat", "All"]).optional(),
});
export type ServicePaginationQueryType = z.infer<typeof ServicePaginationQuery>;

export const AdminFilterBookingQuery = BookingPaginationQuery.extend({
  start_time_from: utcDateField().optional(),
  start_time_to: utcDateField().optional(),
});
export type AdminFilterBookingQueryType = z.infer<
  typeof AdminFilterBookingQuery
>;

export const AdminFilterBookingQueryByUserId = BookingPaginationQuery.extend({
  user_id: z.string(),
});
export type AdminFilterBookingQueryByUserIdType = z.infer<
  typeof AdminFilterBookingQueryByUserId
>;

// user management query schema
export const UsmPaginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  skip: z.coerce.number().int().min(0).default(0),
});
export type UsmPaginationQueryType = z.infer<typeof UsmPaginationQuery>;

export const PetUsmPaginationQuery = UsmPaginationQuery.extend({
  name: z.string().optional(),
});
export type PetUsmPaginationQueryType = z.infer<typeof PetUsmPaginationQuery>;

// Common response schemas
export const errorResponseSchema = z.object({
  detail: z
    .string()
    .or(z.record(z.any(), z.any()))
    .or(z.array(z.any()))
    .optional(),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const MessageResponseSchema = z.object({
  message: z.string(),
});
