import { utcDateField } from "@/lib/schemas/common";
import { PetSchema } from "@/lib/schemas/user-management";
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
  services: ServiceSchema.array(),
});

export const DisplayBookingSchema = BookingSchema.pick({
  id: true,
  start_time: true,
  end_time: true,
  total_price: true,
  status: true,
  created_at: true,
  updated_at: true,
});

export const SpaBookingCartItemSchema = z.object({
  id: z.uuidv4(),
  service: ServiceSchema,
  pet: PetSchema,
  start_time: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Thời gian bắt đầu không hợp lệ",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Không thể đặt lịch ở mốc thời gian này",
    }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

export const HotelBookingCartItemSchema = z.object({
  id: z.uuidv4(),
  service: ServiceSchema,
  pet: PetSchema,
  hotel_hours: z.number(),
  start_time: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Thời gian bắt đầu không hợp lệ",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Không thể đặt lịch ở mốc thời gian này",
    }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

// form schemas****************************************
export const SingleHotelBookingFormSchema = z.object({
  pet_id: z.uuidv4("Chọn bất kỳ thú cưng nào"),
  hotel_hours: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Số giờ phải là một số lớn hơn 0" }
  ),
  start_time: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Thời gian bắt đầu không hợp lệ",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Không thể đặt lịch ở mốc thời gian này",
    }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

export const SingleSpaBookingFormSchema = z.object({
  pet_id: z.uuidv4("Chọn bất kỳ thú cưng nào"),
  start_time: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Thời gian bắt đầu không hợp lệ",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Không thể đặt lịch ở mốc thời gian này",
    }),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

export const BookingEditFormSchema = z.object({
  status: BookingStatusSchema,
  notes: z
    .string()
    .trim()
    .max(500, { message: "Ghi chú tối đa 500 ký tự" })
    .optional(),
});

export const ServiceCreateFormSchema = z.object({
  name: z.string().min(1, { message: "Tên dịch vụ không được để trống" }),
  service_type: ServiceTypeSchema,
  pet_type: PetTypeSchema,
  price_per_hour: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num);
      },
      { message: "Giá phải là một số" }
    )
    .refine(
      (val) => {
        const num = Number(val);
        return num >= 0;
      },
      { message: "Giá phải lớn hơn hoặc bằng 0" }
    ),
  duration_hours: z
    .string()
    .optional()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num);
      },
      { message: "Giá phải là một số" }
    )
    .refine(
      (val) => {
        const num = Number(val);
        return num >= 0;
      },
      { message: "Giá phải lớn hơn hoặc bằng 0" }
    ),
});

export const ServiceEditFormSchema = ServiceCreateFormSchema.partial();

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
