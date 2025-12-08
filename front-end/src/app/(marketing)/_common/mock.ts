import petvetImage from "@/assets/images/pet-vet.jpg";
import cutFur from "@/assets/images/cut-fur.jpg";
import { clientUrl } from "@/lib/data/web-url";

export const mockItems = [
  {
    title: "Tắm & Cắt tỉa",
    rating: "5.0 (212)",
    img: cutFur.src,
    path: `${clientUrl.spa_service.path}/123`,
  },
  {
    title: "Trông giữ cuối tuần",
    rating: "4.8 (155)",
    img: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200",
    path: `${clientUrl.hotel_service.path}/123`,
  },
  {
    title: "Khám tổng quát",
    rating: "4.9 (189)",
    img: petvetImage.src,
    path: `${clientUrl.vet_service.path}/123`,
  },

  {
    title: "Tiêm phòng định kỳ",
    rating: "5.0 (301)",
    img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
    path: `${clientUrl.vet_service.path}/1234`,
  },
];
