import envConfig from "@/config/config";
import {
  AdminFilterBookingQueryType,
  BookingPaginationQueryType,
  PetUsmPaginationQueryType,
  ServicePaginationQueryType,
  UsmPaginationQueryType,
} from "@/lib/schemas/common";
import { UserRole } from "@/lib/types/user-management";
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
  COMMON_ADMIN_SERVICE: `${commonBookingBasePath}/admin/service`,
  // care endpoints
  CARE_BOOKINGS(searchQuery?: BookingPaginationQueryType) {
    return buildQueryURL(`${careBookingBasePath}/bookings`, searchQuery);
  },
  CARE_SINGLE_BOOKING: `${careBookingBasePath}/booking`,
  CARE_SERVICES(searchQuery?: ServicePaginationQueryType) {
    return buildQueryURL(`${careBookingBasePath}/services`, searchQuery);
  },
  CARE_ADMIN_FILTER(query?: AdminFilterBookingQueryType) {
    return buildQueryURL(`${careBookingBasePath}/admin/filter`, query);
  },
  CARE_ADMIN_FILTER_BY_USER_ID(userId: string) {
    return `${careBookingBasePath}/admin/filter/${userId}`;
  },
  // hotel endpoints
  HOTEL_BOOKINGS(searchQuery?: BookingPaginationQueryType) {
    return buildQueryURL(`${hotelBookingBasePath}/bookings`, searchQuery);
  },
  HOTEL_SERVICES(searchQuery?: ServicePaginationQueryType) {
    return buildQueryURL(`${hotelBookingBasePath}/services`, searchQuery);
  },
  HOTEL_ADMIN_FILTER(query?: AdminFilterBookingQueryType) {
    return buildQueryURL(`${hotelBookingBasePath}/admin/filter`, query);
  },
  HOTEL_ADMIN_FILTER_BY_USER_ID(userId: string) {
    return `${hotelBookingBasePath}/admin/filter/${userId}`;
  },
  HOTEL_SINGLE_BOOKING: `${hotelBookingBasePath}/booking`,
};

// user management endpoints
const userManagementBasePath = `${envConfig.USER_MANGEMENT_API}/user`;
const adminUserManagementBasePath = `${envConfig.USER_MANGEMENT_API}/admin`;
export const userManagementApiUrl = {
  // client endpoints
  ME: `${userManagementBasePath}/me`,
  ADD_PET: `${userManagementBasePath}/add-pets`,
  PETS(searchQuery?: PetUsmPaginationQueryType) {
    return buildQueryURL(`${userManagementBasePath}/pets`, searchQuery);
  },
  PET_BY_PET_ID(petId: string) {
    return `${userManagementBasePath}/pets/${petId}`;
  },
  SEND_OTP: `${userManagementBasePath}/send-otp`,
  VERIFY_OTP: `${userManagementBasePath}/verify-otp`,
  SEND_OTP_RESET_PASSWORD: `${userManagementBasePath}/password/request-otp`,
  VERIFY_OTP_RESET_PASSWORD: `${userManagementBasePath}/password/verify-otp`,
  // admin endpoints
  USERS(searchQuery?: UsmPaginationQueryType) {
    return buildQueryURL(`${adminUserManagementBasePath}/users`, searchQuery);
  },
  USER_BY_USER_ID(userId: string) {
    return `${adminUserManagementBasePath}/users/${userId}`;
  },
  USER_EDIT_ROLE(userId: string, role: UserRole) {
    return buildQueryURL(
      `${adminUserManagementBasePath}/users/${userId}/role`,
      {
        role: role,
      }
    );
  },
  USER_EDIT_STATUS(userId: string, activeStatus: boolean) {
    return buildQueryURL(
      `${adminUserManagementBasePath}/users/${userId}/status`,
      {
        active_status: activeStatus,
      }
    );
  },
};
