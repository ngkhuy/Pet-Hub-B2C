import { apiFetch } from "@/lib/api/client";
import { vetApiUrl } from "@/lib/data/api-url";
import {
  VetBookingResponseSchema,
  VetServiceResponseSchema,
} from "@/lib/schemas/vet";
import {
  AdminVetBookingEditBodyType,
  VetBookingCreateBodyType,
  VetBookingEditBodyType,
  VetBookingQueryType,
  VetServiceCreateBodyType,
  VetServiceEditBodyType,
} from "@/lib/types/vet";
import z from "zod";

export const vetApi = {
  // service for normal users
  getServices() {
    return apiFetch(
      vetApiUrl.VET_SERVICES(),
      {
        method: "GET",
      },
      VetServiceResponseSchema.array()
    );
  },
  // sevice for admin
  adminCreateService(data: VetServiceCreateBodyType) {
    return apiFetch(
      vetApiUrl.VET_ADMIN_SERVICE,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      VetServiceResponseSchema
    );
  },
  adminEditService(serviceId: string, data: VetServiceEditBodyType) {
    return apiFetch(
      vetApiUrl.VET_ADMIN_SERVICE_BY_ID(serviceId),
      {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name ?? null,
          description: data.description ?? null,
          base_price: data.base_price ?? null,
          duration_minutes: data.duration_minutes ?? null,
          follow_up_interval_days: data.follow_up_interval_days ?? null,
          doses_required: data.doses_required ?? null,
          dose_interval_days: data.doses_interval_days ?? null,
        }),
      },
      VetServiceResponseSchema
    );
  },
  adminDeleteService(serviceId: string) {
    return apiFetch(
      vetApiUrl.VET_ADMIN_SERVICE_BY_ID(serviceId),
      {
        method: "DELETE",
      },
      z.undefined()
    );
  },
  // booking for normal users
  getBookings(searchQuery?: VetBookingQueryType) {
    return apiFetch(
      vetApiUrl.VET_BOOKINGS(searchQuery),
      {
        method: "GET",
      },
      VetBookingResponseSchema.array()
    );
  },
  createBooking(data: VetBookingCreateBodyType) {
    return apiFetch(
      vetApiUrl.VET_BOOKINGS(),
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          start_time: new Date(data.start_time!).toISOString(),
          end_time: new Date(data.end_time!).toISOString(),
        }),
      },
      VetBookingResponseSchema
    );
  },
  getBookingById(bookingId: string) {
    return apiFetch(
      vetApiUrl.VET_BOOKING_BY_ID(bookingId),
      {
        method: "GET",
      },
      VetBookingResponseSchema
    );
  },
  editBooking(bookingId: string, data: VetBookingEditBodyType) {
    return apiFetch(
      vetApiUrl.VET_BOOKING_BY_ID(bookingId),
      {
        method: "PATCH",
        body: JSON.stringify({
          start_time: data.start_time
            ? new Date(data.start_time).toISOString()
            : null,
          end_time: data.end_time
            ? new Date(data.end_time).toISOString()
            : null,
          symptoms: data.symptoms ?? null,
          notes: data.notes ?? null,
        }),
      },
      VetBookingResponseSchema
    );
  },
  cancelBooking(bookingId: string) {
    return apiFetch(
      vetApiUrl.VET_BOOKING_CANCEL(bookingId),
      {
        method: "PATCH",
      },
      VetBookingResponseSchema
    );
  },
  // booking for admin
  adminEditBooking(bookingId: string, data: AdminVetBookingEditBodyType) {
    return apiFetch(
      vetApiUrl.VET_ADMIN_BOOKING_BY_ID(bookingId),
      {
        method: "PATCH",
        body: JSON.stringify({
          start_time: data.start_time
            ? new Date(data.start_time).toUTCString()
            : null,
          end_time: data.end_time
            ? new Date(data.end_time).toUTCString()
            : null,
          symptoms: data.symptoms ?? null,
          notes: data.notes ?? null,
          status: data.status ?? null,
        }),
      },
      VetBookingResponseSchema
    );
  },
  adminDeleteBooking(bookingId: string) {
    return apiFetch(
      vetApiUrl.VET_ADMIN_BOOKING_BY_ID(bookingId),
      {
        method: "DELETE",
      },
      z.undefined()
    );
  },
};
