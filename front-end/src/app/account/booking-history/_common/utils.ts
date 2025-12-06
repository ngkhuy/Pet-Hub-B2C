import {
  BookingStatusType,
  BookingType,
  ServiceType,
  ServiceTypeType,
} from "@/lib/types/booking";

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

const SERVICE_TYPE_ORDER: Record<ServiceTypeType, number> = {
  Hotel: 2,
  Spa: 1,
};

const BOOKING_STATUS_ORDER: Record<BookingStatusType, number> = {
  Pending: 1,
  Confirmed: 2,
  Completed: 3,
  Cancelled: 4,
  No_show: 5,
};

const BASE_ORDER: SortKey[] = [
  "start_time",
  "created_at",
  "total_price",
  "duration",
  "service_type",
  "status",
];

export function buildPriority(sortBy: SortKey): SortKey[] {
  return [sortBy, ...BASE_ORDER.filter((k) => k !== sortBy)];
}

export function compareByKey(
  key: SortKey,
  a: BookingServiceItem,
  b: BookingServiceItem,
  order: SortOrder = "desc"
): number {
  const compare = (x: number, y: number) => {
    const result = x - y;
    return order === "asc" ? result : -result;
  };

  switch (key) {
    case "created_at": {
      const da = new Date(a.booking.created_at).getTime();
      const db = new Date(b.booking.created_at).getTime();
      return compare(da, db);
    }

    case "start_time": {
      const da = new Date(a.booking.start_time).getTime();
      const db = new Date(b.booking.start_time).getTime();
      return compare(da, db);
    }

    case "total_price": {
      const pa = a.booking.total_price;
      const pb = b.booking.total_price;
      return compare(pa, pb);
    }

    case "duration": {
      const da = a.service.duration_hours ?? 0;
      const db = b.service.duration_hours ?? 0;
      return compare(da, db);
    }

    case "service_type": {
      const ra = SERVICE_TYPE_ORDER[a.service.service_type];
      const rb = SERVICE_TYPE_ORDER[b.service.service_type];
      return compare(ra, rb);
    }

    case "status": {
      const sa = BOOKING_STATUS_ORDER[a.booking.status];
      const sb = BOOKING_STATUS_ORDER[b.booking.status];
      return compare(sa, sb);
    }

    default:
      return 0;
  }
}
