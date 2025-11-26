import {
  BookingSchema,
  CreateBookingFormSchema,
  PetTypeSchema,
  ServiceSchema,
  ServiceTypeSchema,
} from "@/lib/schemas/booking";
import z from "zod";

// enum types****************************************
export type ServiceTypeType = z.infer<typeof ServiceTypeSchema>;

export type PetTypeType = z.infer<typeof PetTypeSchema>;

// object types****************************************
export type ServiceType = z.infer<typeof ServiceSchema>;

export type BookingType = z.infer<typeof BookingSchema>;

// form types****************************************
export type CreateBookingFormType = z.infer<typeof CreateBookingFormSchema>;

// labels****************************************
export const ServiceTypeLabels: Record<ServiceTypeType, string> = {
  Hotel: "Dịch vụ khách sạn",
  Spa: "Dịch vụ spa",
};

export const ServiceLabels: Record<
  keyof z.infer<typeof ServiceSchema>,
  string
> = {
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

export const PetTypeLabels: Record<PetTypeType, string> = {
  Dog: "Chó",
  Cat: "Mèo",
  All: "Tất cả",
};
// body types****************************************

// response types****************************************
