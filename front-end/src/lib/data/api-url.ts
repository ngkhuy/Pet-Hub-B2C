import envConfig from "@/config/config";
import { BookingPaginationQueryType, ServicePaginationQueryType } from "@/lib/schemas/common";
import { buildQueryURL } from "@/lib/utils/query";

// auth endpoints
export const authApiUrl = {
  // public endpoints
  SIGNUP: `${envConfig.AUTH_API}/signup`,
  LOGIN: `${envConfig.AUTH_API}/login`,
  // user endpoints
  LOGOUT: `${envConfig.AUTH_API}/logout`,
  CHANGE_PASSWORD: `${envConfig.AUTH_API}/user/change-password`,
  REFRESH_TOKEN: `${envConfig.AUTH_API}/refresh`,
};

// booking endpoints
const commonBookingBasePath = `${envConfig.BOOKING_API}/common`;
const careBookingBasePath = `${envConfig.BOOKING_API}/care`;
const hotelBookingBasePath = `${envConfig.BOOKING_API}/hotel`;
export const bookingApiUrl = {
  COMMON_BY_BOOKING_ID(bookingId: string) {
    return `${commonBookingBasePath}/${bookingId}`;
  },
  COMMON_ADMIN_BY_BOOKING_ID(bookingId: string) {
    return `${commonBookingBasePath}/admin/${bookingId}`;
  },
  COMMON_USER_BY_BOOKING_ID(bookingId: string) {
    return `${commonBookingBasePath}/user/${bookingId}`;
  },
  COMMON_ADMIN_BY_SERVICE_ID(serviceId: string) {
    return `${commonBookingBasePath}/admin/service/${serviceId}`;
  },
  COMMON_ADMIN_SERVICE_CREATE: `${commonBookingBasePath}/admin/service/create`,
  // care endpoints
  CARE_BOOKINGS(searchQuery: BookingPaginationQueryType) {
    return buildQueryURL(`${careBookingBasePath}`, searchQuery);
  },
  CARE_SERVICES(searchQuery: ServicePaginationQueryType) {
    return buildQueryURL(`${careBookingBasePath}/services`, searchQuery);
  },
  CARE_ADMIN_FILTER: `${careBookingBasePath}/admin/filter`,
  CARE_ADMIN_FILTER_BY_USER_ID(userId: string) {
    return `${careBookingBasePath}/admin/filter/${userId}`;
  },
  CARE_BOOKING_CREATE: `${careBookingBasePath}/create`,
  // hotel endpoints
  HOTEL_BOOKINGS: `${hotelBookingBasePath}`,
  HOTEL_SERVICES: `${hotelBookingBasePath}/services`,
  HOTEL_ADMIN_FILTER: `${hotelBookingBasePath}/admin/filter`,
  HOTEL_ADMIN_FILTER_BY_USER_ID(userId: string) {
    return `${hotelBookingBasePath}/admin/filter/${userId}`;
  },
  HOTEL_BOOKING_CREATE: `${hotelBookingBasePath}/create`,
};

// user management endpoints
const userManagementBasePath = `${envConfig.USER_MANGEMENT_API}/user`;
const adminUserManagementBasePath = `${envConfig.USER_MANGEMENT_API}/admin`;
export const userManagementApiUrl = {
  // client endpoints
  ME: `${userManagementBasePath}/me`,
  ADD_PET: `${userManagementBasePath}/add-pets`,
};
