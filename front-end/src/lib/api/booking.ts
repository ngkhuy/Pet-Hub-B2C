import { z } from "zod";
import { apiFetch } from "./client";

import {
  bookingSchema,
  adminUpdateBookingResponseSchema,
  userUpdateBookingNotesResponseSchema,
  createBookingResponseSchema,
  BookingListRequest,
  BookingServiceListQuery,
  AdminUpdateBookingRequest,
  UserUpdateBookingNotesRequest,
  BookingAdminFilterQuery,
  CreateBookingRequest,
} from "@/lib/schemas/booking";
import { buildURL } from "@/lib/utils/query";

const BASE_PATH = "/api/booking";
const COMMON_PATH = `${BASE_PATH}/common`;
const CARE_PATH = `${BASE_PATH}/care`;
const HOTEL_PATH = `${BASE_PATH}/hotel`;

export const ENDPOINT = {
  // common endpoints
  COMMON: `${COMMON_PATH}`,
  COMMON_ADMIN: `${COMMON_PATH}/admin`,
  COMMON_USER: `${COMMON_PATH}/user`,
  // care endpoints
  CARE_BOOKINGS: `${CARE_PATH}`,
  CARE_SERVICES: `${CARE_PATH}/services`,
  CARE_ADMIN_FILTER: `${CARE_PATH}/admin/filter`,
  CARE_BOOKING_CREATE: `${CARE_PATH}/create`,
  // hotel endpoints
  HOTEL_BOOKINGS: `${HOTEL_PATH}/hotel`,
  HOTEL_SERVICES: `${HOTEL_PATH}/services`,
  HOTEL_ADMIN_FILTER: `${HOTEL_PATH}/admin/filter`,
  HOTEL_BOOKING_CREATE: `${HOTEL_PATH}/create`,
};

export const bookingApi = {
  listSpa(query: BookingListRequest) {
    const url = buildURL(ENDPOINT.CARE_BOOKINGS, query);
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
