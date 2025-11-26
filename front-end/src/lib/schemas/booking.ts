import { utcDateField } from "@/lib/schemas/common";
import { z } from "zod";

// enum schemas****************************************
export const BookingStatusSchema = z.enum([
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
  "No_show",
]);

export const ServiceTypeSchema = z.enum(["Hotel", "Spa"]);

export const PetTypeSchema = z.enum(["Dog", "Cat", "All"]);

// object schemas****************************************
export const ServiceSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  service_type: ServiceTypeSchema,
  pet_type: PetTypeSchema,
  price_per_hour: z.number(),
  duration_hours: z.number().nullable(),
});

export const BookingSchema = z.object({
  id: z.uuidv4(),
  user_id: z.uuidv4(),
  pet_id: z.uuidv4(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  total_price: z.number(),
  status: BookingStatusSchema,
  notes: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  service: ServiceSchema.array(),
});

// form schemas****************************************
export const CreateBookingFormSchema = z.object({
  user_id: z.uuidv4("User ID không hợp lệ"),
  pet_id: z.uuidv4("Pet ID không hợp lệ"),
  start_time: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Thời gian bắt đầu không hợp lệ",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Không thể đặt lịch ở mốc thời gian này",
    }),
  service_ids: z
    .array(z.uuidv4())
    .min(1, { message: "Phải chọn ít nhất một dịch vụ" }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

// body schemas****************************************
export const CreateBookingBodySchema = z.object({
  user_id: z.string(),
  pet_id: z.string(),
  start_time: utcDateField(),
  service_ids: z
    .array(z.uuidv4())
    .min(1, { message: "Phải chọn ít nhất một dịch vụ" }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});
