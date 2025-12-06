import { z } from "zod";
import { apiFetch } from "./client";

import { bookingApiUrl } from "@/lib/data/api-url";
import { BookingSchema, ServiceSchema } from "@/lib/schemas/booking";
import {
  ServiceCreateFormType,
  ServiceEditFormType,
  SingleHotelBookingFormType,
  SingleSpaBookingFormType,
} from "@/lib/types/booking";
import { ServicePaginationQueryType } from "@/lib/schemas/common";
import { get } from "http";
import { ca } from "date-fns/locale";

export const bookingApi = {
  createService(data: ServiceCreateFormType) {
    return apiFetch(
      bookingApiUrl.COMMON_ADMIN_SERVICE,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      ServiceSchema
    );
  },

  editService(id: string, data: ServiceEditFormType) {
    return apiFetch(
      bookingApiUrl.COMMON_ADMIN_BY_SERVICE_ID(id),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      ServiceSchema
    );
  },

  getSpaServices(search?: ServicePaginationQueryType) {
    const params = search || { limit: 50, offset: 0 };

    return apiFetch(
      bookingApiUrl.CARE_SERVICES(params),
      {
        method: "GET",
      },
      ServiceSchema.array()
    );
  },

  getHotelServices() {
    return apiFetch(
      bookingApiUrl.HOTEL_SERVICES(),
      {
        method: "GET",
      },
      ServiceSchema.array()
    );
  },

  deleteService(serviceId: string) {
    return apiFetch(
      bookingApiUrl.COMMON_ADMIN_BY_SERVICE_ID(serviceId),
      {
        method: "DELETE",
      },
      z.undefined()
    );
  },

  createSpaSingleBooking(
    userId: string,
    serviceId: string,
    data: SingleSpaBookingFormType
  ) {
    return apiFetch(
      bookingApiUrl.CARE_SINGLE_BOOKING,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          user_id: userId,
          service_ids: [serviceId],
        }),
      },
      BookingSchema
    );
  },

  createHotelSingleBooking(
    userId: string,
    serviceId: string,
    data: SingleHotelBookingFormType
  ) {
    return apiFetch(
      bookingApiUrl.HOTEL_SINGLE_BOOKING,
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          user_id: userId,
          service_id: serviceId,
        }),
      },
      BookingSchema
    );
  },

  getSpaBookingHistory() {
    return apiFetch(
      bookingApiUrl.CARE_BOOKINGS(),
      {
        method: "GET",
      },
      BookingSchema.array()
    );
  },

  getHotelBookingHistory() {
    return apiFetch(
      bookingApiUrl.HOTEL_BOOKINGS(),
      {
        method: "GET",
      },
      BookingSchema.array()
    );
  },

  cancelBooking(bookingId: string) {
    return apiFetch(
      bookingApiUrl.COMMON_BY_BOOKING_ID(bookingId),
      {
        method: "DELETE",
      },
      z.undefined()
    );
  },
  updateBooking(bookingId: string, data: Partial<{ notes: string }>) {
    return apiFetch(
      bookingApiUrl.COMMON_USER_BY_BOOKING_ID(bookingId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      BookingSchema
    );
  },

  adminGetSpaBookings() {
    return apiFetch(
      bookingApiUrl.CARE_ADMIN_FILTER(),
      {
        method: "GET",
      },
      BookingSchema.array()
    );
  },

  adminGetHotelBookings() {
    return apiFetch(
      bookingApiUrl.HOTEL_ADMIN_FILTER(),
      {
        method: "GET",
      },
      BookingSchema.array()
    );
  },

  adminEditBooking(
    bookingId: string = "",
    data: Partial<{ notes: string; status: string }>
  ) {
    return apiFetch(
      bookingApiUrl.COMMON_ADMIN_BY_BOOKING_ID(bookingId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      BookingSchema
    );
  },
};
