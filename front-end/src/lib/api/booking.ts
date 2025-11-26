import { z } from "zod";
import { apiFetch } from "./client";

import { buildURL } from "@/lib/utils/query";
import { bookingApiUrl } from "@/lib/data/api-url";

export const bookingApi = {
  listSpa(query: BookingListRequest) {
    const url = buildURL(bookingApiUrl.CARE_SERVICES, query);
    return apiFetch(url, { method: "GET" }, z.array(bookingSchema));
  },

  listHotel(query: BookingListRequest) {
    const url = buildURL(ENDPOINT.HOTEL_BOOKINGS, query);
    return apiFetch(url, { method: "GET" }, z.array(bookingSchema));
  },

  listServices(query: BookingServiceListQuery, serviceType: "care" | "hotel") {
    const url = buildURL(
      serviceType === "care" ? ENDPOINT.CARE_SERVICES : ENDPOINT.HOTEL_SERVICES,
      query
    );
    return apiFetch(url, { method: "GET" }, z.array(bookingSchema));
  },

  getById(bookingId: string) {
    return apiFetch(
      `${ENDPOINT.COMMON}/${bookingId}`,
      { method: "GET" },
      bookingSchema
    );
  },

  cancel(bookingId: string) {
    return apiFetch(
      `${ENDPOINT.COMMON}/${bookingId}`,
      { method: "DELETE" },
      bookingSchema
    );
  },

  // update notes and/or status
  adminUpdate(bookingId: string, body: AdminUpdateBookingRequest) {
    return apiFetch(
      `${ENDPOINT.COMMON_ADMIN}/${bookingId}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      adminUpdateBookingResponseSchema
    );
  },

  userUpdateNotes(bookingId: string, body: UserUpdateBookingNotesRequest) {
    return apiFetch(
      `${ENDPOINT.COMMON_USER}/${bookingId}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      userUpdateBookingNotesResponseSchema
    );
  },

  adminFilter(query: BookingAdminFilterQuery, serviceType: "care" | "hotel") {
    const url = buildURL(
      serviceType === "care"
        ? ENDPOINT.CARE_ADMIN_FILTER
        : ENDPOINT.HOTEL_ADMIN_FILTER,
      query
    );
    return apiFetch(url, { method: "GET" }, z.array(bookingSchema));
  },

  create(body: CreateBookingRequest, serviceType: "care" | "hotel") {
    const url =
      serviceType === "care"
        ? ENDPOINT.CARE_ADMIN_FILTER
        : ENDPOINT.HOTEL_ADMIN_FILTER;
    return apiFetch(
      url,
      { method: "POST", body: JSON.stringify(body) },
      createBookingResponseSchema
    );
  },
};
