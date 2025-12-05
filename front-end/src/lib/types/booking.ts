import {
  BookingEditFormSchema,
  BookingSchema,
  BookingStatusSchema,
  DisplayBookingSchema,
  HotelBookingCartItemSchema,
  PetTypeSchema,
  ServiceCreateFormSchema,
  ServiceEditFormSchema,
  ServiceSchema,
  ServiceTypeSchema,
  SingleHotelBookingFormSchema,
  SingleSpaBookingFormSchema,
  SpaBookingCartItemSchema,
} from "@/lib/schemas/booking";
import z from "zod";

// labels****************************************
export const BookingLabels: Record<keyof BookingType, string> = {
  id: "ID",
  created_at: "Ngày tạo",
  updated_at: "Ngày cập nhật",
  start_time: "Thời gian bắt đầu",
  end_time: "Thời gian kết thúc",
  total_price: "Tổng giá tiền",
  status: "Trạng thái",
  notes: "Ghi chú",
  services: "Dịch vụ",
  pet_id: "thú cưng",
  user_id: " khách hàng",
};

export const BookingLabelsWithActions: Record<
  keyof z.infer<typeof DisplayBookingSchema> | "actions",
  string
> = {
  ...BookingLabels,
  actions: "Chức năng",
};

// enum types****************************************
export type ServiceTypeType = z.infer<typeof ServiceTypeSchema>;

export type PetTypeType = z.infer<typeof PetTypeSchema>;

export type BookingStatusType = z.infer<typeof BookingStatusSchema>;

// object types****************************************
export type ServiceType = z.infer<typeof ServiceSchema>;

export type BookingType = z.infer<typeof BookingSchema>;

export type SpaBookingCartItemType = z.infer<typeof SpaBookingCartItemSchema>;

export type HotelBookingCartItemType = z.infer<
  typeof HotelBookingCartItemSchema
>;

// form types****************************************
export type SingleHotelBookingFormType = z.infer<
  typeof SingleHotelBookingFormSchema
>;

export type SingleSpaBookingFormType = z.infer<
  typeof SingleSpaBookingFormSchema
>;

export type BookingEditFormType = z.infer<typeof BookingEditFormSchema>;

export type ServiceCreateFormType = z.infer<typeof ServiceCreateFormSchema>;

export type ServiceEditFormType = z.infer<typeof ServiceEditFormSchema>;

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
  All: "Chó và mèo",
};

export const BookingStatusLabels: Record<BookingStatusType, string> = {
  Pending: "Đang chờ xử lý",
  Confirmed: "Đã xác nhận",
  Completed: "Đã hoàn thành",
  Cancelled: "Đã hủy",
  No_show: "Không hiện",
};
// body types****************************************

// response types****************************************
