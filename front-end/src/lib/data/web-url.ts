import { IconType } from "react-icons/lib";
import { MdDashboard, MdInfo, MdLogout } from "react-icons/md";

type WebUrlType = {
  path: string;
  description: string;
  IconName: IconType | null;
  title: string;
};

type ClientUrlKeyType =
  | "home"
  | "login"
  | "register"
  | "logout"
  | "account"
  | "account_profile"
  | "forgot_password"
  | "reset_password"
  | "health_service"
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
    IconName: MdInfo,
    title: "Thông tin cá nhân",
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
  health_service: {
    path: "/services/health",
    title: "Sức khỏe",
    description: "Đặt lịch khám, tư vấn, tiêm phòng.",
    IconName: null,
  },
  hotel_service: {
    path: "/services/hotel",
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

export const adminUrl: { [key: string]: WebUrlType } = {};
