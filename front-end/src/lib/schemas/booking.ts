import { utcDateField } from "@/lib/schemas/common";
import { z } from "zod";

// Enum****************************************
export const BookingStatus = z.enum([
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
  "No_show",
]);
export type BookingStatusType = z.infer<typeof BookingStatus>;

export const ServiceType = z.enum(["Hotel", "Spa"]);
export type ServiceTypeType = z.infer<typeof ServiceType>;

export const PetType = z.enum(["Dog", "Cat", "All"]);
export type PetTypeType = z.infer<typeof PetType>;

// Service schema****************************************
export const Service = z.object({
  id: z.uuidv4(),
  name: z.string(),
  service_type: ServiceType,
  pet_type: PetType,
  price_per_hour: z.number(),
  duration_hours: z.number().nullable(),
});
export type ServiceType = z.infer<typeof Service>;

export const ServiceLabels: Record<keyof z.infer<typeof Service>, string> = {
  id: "ID",
  name: "Tên dịch vụ",
  service_type: "Loại dịch vụ",
  pet_type: "Loại thú cưng",
  price_per_hour: "Giá theo giờ",
  duration_hours: "Thời lượng (giờ)",
};

export const ServiceLabelsWithActions: Record<
  keyof z.infer<typeof ServiceLabels> | "actions",
  string
> = {
  ...ServiceLabels,
  actions: "Chức năng",
};

export const ServiceTypeLabels: Record<ServiceTypeType, string> = {
  Hotel: "Dịch vụ khách sạn",
  Spa: "Dịch vụ spa",
};

// Core booking schema****************************************
export const Booking = z.object({
  id: z.uuidv4(),
  user_id: z.uuidv4(),
  pet_id: z.uuidv4(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  total_price: z.number(),
  status: BookingStatus,
  notes: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  service: Service,
});
export type BookingType = z.infer<typeof Booking>;

//Request and Response schema****************************************

// Create Booking
export const CreateBookingForm = z.object({
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

export const CreateBookingBody = z.object({
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
export type CreateBookingFormType = z.infer<typeof CreateBookingForm>;
