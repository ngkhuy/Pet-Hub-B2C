import { clientUrl } from "@/lib/data/web-url";

export const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8a7H132bj_399bPnmLLlc5Q464hbfKxNMuvPyniBZvENb9Esac17ts9DJuUaL1AwlGWT9no4c8aWd1BUYc8RhqM1DJbLLf38cwWT47k_EOn2Z2wE-p_GPvOoykGDdVZw-SGmm2DE-hR0-q8bbVtUQFe-kIrAzmWoCmtfS7BVEJMEj47Q6ErCIKeUZT5XYRA2_BG8IBHFN5DXYJT79Sh8uxn07MIxhEO5ZoillzRhEFsrm18Ok7ALiJtNreh-UtqnS4KHEs9jYODH4";

export const NAV = {
  home: clientUrl.home,
  service: {
    title: "Các dịch vụ cho thú cưng",
    items: [
      clientUrl.spa_service,
      clientUrl.hotel_service,
      clientUrl.vet_service,
    ],
  },
  about: clientUrl.about,
  contact: clientUrl.contact,
  user: [clientUrl.account_profile, clientUrl.admin, clientUrl.logout],
} as const;
