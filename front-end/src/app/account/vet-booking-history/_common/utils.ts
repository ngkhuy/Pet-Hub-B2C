import {
  BookingStatusType,
  BookingType,
  ServiceType,
  ServiceTypeType,
} from "@/lib/types/booking";
import z from "zod";

export type BookingServiceItem = {
  booking: BookingType;
  service: ServiceType;
};

export type SortKey =
  | "start_time"
  | "created_at"
  | "total_price"
  | "duration"
  | "service_type"
  | "status";

export type SortOrder = "asc" | "desc";

export type BookingHistoryProps = {
  bookings: BookingType[];
  onCancelBooking?: (bookingId: string) => Promise<void> | void;
  onUpdateNotes?: (bookingId: string, notes: string) => Promise<void> | void;
};

// ==== SORT UTILS (multi-key with weight) ========================

export const FilterKeysSchema = z.enum([
  "start_time",
  "end_time",
  "created_at",
  "upadated_at",
  "pet_id",
  "id",
  "status",
]);
export type FilterKeyType = z.infer<typeof FilterKeysSchema>;

const BASE_ORDER: FilterKeyType[] = [
  "status",
  "start_time",
  "end_time",
  "created_at",
  "upadated_at",
  "pet_id",
  "id",
];
