import { IconType } from "react-icons/lib";
import {
  MdCalendarMonth,
  MdDashboard,
  MdDesignServices,
  MdLogout,
  MdOutlineQueryStats,
  MdOutlineSettings,
  MdOutlineStarOutline,
  MdOutlineSupervisorAccount,
  MdPersonOutline,
  MdPets,
  MdStore,
} from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";

export type WebUrlType = {
  path: string;
  description: string;
  IconName: IconType | null;
  title: string;
  subItems?: WebUrlType[];
};

export type ClientUrlKeyType =
  | "home"
  | "login"
  | "register"
  | "logout"
  | "account"
  | "account_profile"
  | "account_pets"
  | "account_settings"
  | "account_booking_history"
  | "account_reviews"
  | "forgot_password"
  | "reset_password"
  | "spa_service"
  | "hotel_service"
  | "contact"
  | "about"
  | "admin";

export const clientUrl: { [key in ClientUrlKeyType]: WebUrlType } = {
  home: {
    path: "/",
    description: "Trang chủ ",
    IconName: null,
    title: "Trang chủ",
  },
  login: {
    path: "/login",
    description: "Trang đăng nhập",
    IconName: null,
    title: "Đăng nhập",
  },
  register: {
    path: "/register",
    description: "Trang đăng ký",
    IconName: null,
    title: "Đăng ký",
  },
  logout: {
    title: "Đăng xuất",
    description: "Đăng xuất khỏi tài khoản",
    IconName: MdLogout,
    path: "",
  },
  account: {
    path: "/account",
    description: "Home Page",
    IconName: null,
    title: "Tài khoản",
  },
  account_profile: {
    path: "/account/profile",
    description: "Trang thông tin cá nhân",
    IconName: MdPersonOutline,
    title: "Thông tin cá nhân",
  },
  account_pets: {
    path: "/account/pets",
    description: "Trang quản lý thú cưng",
    IconName: MdPets,
    title: "Thú cưng của tôi",
  },
  account_booking_history: {
    path: "/account/booking-history",
    description: "Trang quản lý thú cưng",
    IconName: MdCalendarMonth,
    title: "Lịch sử đặt chỗ",
  },
  account_reviews: {
    path: "/account/reviews",
    description: "Trang quản lý thú cưng",
    IconName: MdOutlineStarOutline,
    title: "Đánh giá",
  },

  account_settings: {
    path: "/account/settings",
    description: "Trang cài đặt tài khoản",
    IconName: MdOutlineSettings,
    title: "Cài đặt tài khoản",
  },
  forgot_password: {
    path: "/forgot-password",
    description: "Trang quên mật khẩu",
    IconName: null,
    title: "Quên mật khẩu",
  },
  reset_password: {
    path: "/reset-password",
    description: "Trang đặt lại mật khẩu",
    IconName: null,
    title: "Đặt lại mật khẩu",
  },
  spa_service: {
    path: "/service/spa",
    title: "Spa",
    description: "Dịch vụ chăm sóc và làm đẹp cho thú cưng.",
    IconName: null,
  },
  hotel_service: {
    path: "/service/hotel",
    title: "Khách sạn",
    description: "Nghỉ dưỡng an toàn, tiện nghi.",
    IconName: null,
  },
  contact: {
    path: "/contact",
    title: "Liên hệ",
    description: "Thông tin liên hệ với chúng tôi.",
    IconName: null,
  },
  about: {
    path: "/about",
    title: "Về chúng tôi",
    description: "Tìm hiểu về sứ mệnh và đội ngũ của chúng tôi.",
    IconName: null,
  },
  admin: {
    IconName: MdDashboard,
    title: "Trang quản trị",
    description: "Truy cập trang quản trị hệ thống.",
    path: "/admin",
  },
} as const;

export type AdminUrlKeyType =
  | "dashboard"
  | "userManagement"
  | "serviceManagement"
  | "shopInfoManagement"
  | "bookingManagement";

export const adminUrl: { [key in AdminUrlKeyType]: WebUrlType } = {
  dashboard: {
    title: "Tổng quan",
    path: "/admin",
    IconName: MdOutlineQueryStats,
    description: "Trang tổng quan quản trị",
  },
  userManagement: {
    title: "Quản lí người dùng",
    path: "/admin/user-management",
    IconName: MdOutlineSupervisorAccount,
    description: "Quản lý người dùng hệ thống",
  },
  serviceManagement: {
    title: "Quản lí dịch vụ",
    path: "/admin/service-management",
    IconName: MdDesignServices,
    description: "Quản lý các dịch vụ cung cấp",
  },
  bookingManagement: {
    title: "Quản lí đặt dịch vụ",
    path: "/admin/booking-management",
    IconName: AiOutlineSchedule,
    description: "Quản lý các dịch vụ đã được đặt",
  },
  shopInfoManagement: {
    title: "Thông tin shop",
    path: "/admin/shop-info-management",
    IconName: MdStore,
    description: "Quản lý thông tin cửa hàng",
  },
} as const;
