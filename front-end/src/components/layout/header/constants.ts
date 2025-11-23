import { MdDashboard, MdInfo, MdLogout } from "react-icons/md";

export const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8a7H132bj_399bPnmLLlc5Q464hbfKxNMuvPyniBZvENb9Esac17ts9DJuUaL1AwlGWT9no4c8aWd1BUYc8RhqM1DJbLLf38cwWT47k_EOn2Z2wE-p_GPvOoykGDdVZw-SGmm2DE-hR0-q8bbVtUQFe-kIrAzmWoCmtfS7BVEJMEj47Q6ErCIKeUZT5XYRA2_BG8IBHFN5DXYJT79Sh8uxn07MIxhEO5ZoillzRhEFsrm18Ok7ALiJtNreh-UtqnS4KHEs9jYODH4";

export const NAV = {
  home: { link: "/", title: "Trang chủ" },
  service: {
    title: "Các dịch vụ cho thú cưng",
    items: [
      {
        link: "/services/health",
        title: "Sức khỏe",
        description: "Đặt lịch khám, tư vấn, tiêm phòng.",
      },
      {
        link: "/services/hotel",
        title: "Khách sạn",
        description: "Nghỉ dưỡng an toàn, tiện nghi.",
      },
      {
        link: "/services/spa",
        title: "Spa",
        description: "Tắm, cắt tỉa, chăm sóc lông.",
      },
      {
        link: "/adoption",
        title: "Nhận nuôi",
        description: "Kết nối thú cưng cần mái ấm.",
      },
      {
        link: "/donations",
        title: "Quyên góp",
        description: "Hỗ trợ phòng khám & trại cứu hộ.",
      },
    ],
  },
  about: { link: "/about", title: "Về chúng tôi" },
  contact: { link: "/contact", title: "Liên hệ" },
  user: {
    profile: "/account/profile",
    actions: [
      { link: "/account/profile", IconName: MdInfo, title: "Thông tin" },
      { link: "", IconName: MdLogout, title: "Đăng xuất" },
      {
        link: "/admin",
        IconName: MdDashboard,
        title: "Trang quản trị",
      },
    ],
  },
} as const;
