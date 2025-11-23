import { ServiceType, ServiceTypeLabels } from "@/lib/schemas/booking";
import { petTypeLabels } from "@/lib/schemas/pet";

export function SpaServiceCard({ service }: { service: ServiceType }) {
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      {/* Có thể thêm hình ảnh sau nếu schema có image_url */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {service.name}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Dành cho:{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {petTypeLabels[service.pet_type]}
          </span>
        </p>

        <div className="mt-3 text-sm text-gray-700 dark:text-gray-200 space-y-1">
          <p>
            Giá tham khảo:{" "}
            <span className="font-semibold">
              {service.price_per_hour.toLocaleString("vi-VN")}₫ / giờ
            </span>
          </p>
          {service.duration_hours && (
            <p>
              Thời lượng gợi ý:{" "}
              <span className="font-semibold">
                {service.duration_hours} giờ
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs font-medium bg-primary/20 text-primary dark:text-blue-300 dark:bg-blue-900/50 px-2.5 py-1 rounded-full">
            {ServiceTypeLabels[service.service_type]}
          </span>
          <span className="text-xs font-medium bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300 px-2.5 py-1 rounded-full">
            {petTypeLabels[service.pet_type]}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
            Đặt lịch spa
          </button>
        </div>
      </div>
    </article>
  );
}
