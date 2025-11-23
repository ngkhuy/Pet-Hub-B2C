"use client";

import { SpaServiceCard } from "@/app/(marketing)/services/spa/_component/service-card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceType } from "@/lib/schemas/booking";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

/* MOCK DATA */
const mockSpaServices: ServiceType[] = [
  {
    id: "1111",
    name: "Spa tắm gội cơ bản",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 120_000,
    duration_hours: 1,
  },
  {
    id: "2222",
    name: "Spa cắt tỉa lông & tạo kiểu",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 180_000,
    duration_hours: 2,
  },
  {
    id: "3333",
    name: "Spa thư giãn cho mèo",
    service_type: "Spa",
    pet_type: "Cat",
    price_per_hour: 150_000,
    duration_hours: 1.5,
  },

  // ⭐ NEW DATA
  {
    id: "4444",
    name: "Tắm dưỡng da cao cấp",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 250_000,
    duration_hours: 1.2,
  },
  {
    id: "5555",
    name: "Massage body thư giãn cho chó",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 300_000,
    duration_hours: 1.5,
  },
  {
    id: "6666",
    name: "Chải lông chống rụng cho mèo",
    service_type: "Spa",
    pet_type: "Cat",
    price_per_hour: 200_000,
    duration_hours: 1,
  },
  {
    id: "7777",
    name: "Cắt móng + vệ sinh tai",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 90_000,
    duration_hours: 0.5,
  },
  {
    id: "8888",
    name: "Tắm khử mùi đặc biệt cho mèo",
    service_type: "Spa",
    pet_type: "Cat",
    price_per_hour: 220_000,
    duration_hours: 1,
  },
  {
    id: "9999",
    name: "Liệu trình spa premium cho chó",
    service_type: "Spa",
    pet_type: "Dog",
    price_per_hour: 550_000,
    duration_hours: 2.5,
  },
  {
    id: "1010",
    name: "Cạo lông và dưỡng lông mèo",
    service_type: "Spa",
    pet_type: "Cat",
    price_per_hour: 320_000,
    duration_hours: 1.7,
  },
];

/* FORM SCHEMA */
const filterSchema = z.object({
  keyword: z.string().optional(),
  petType: z.enum(["Dog", "Cat", "All"]),
  priceRange: z.enum(["all", "under-200", "200-500", "over-500"]),
});
type Filter = z.infer<typeof filterSchema>;

export default function SpaServicesPage() {
  const form = useForm<Filter>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      keyword: "",
      petType: "All",
      priceRange: "all",
    },
  });

  const watchAll = form.watch();

  /* ⭐ FILTER LOGIC */
  const filteredServices = useMemo(() => {
    return mockSpaServices.filter((service) => {
      // Filter keyword
      if (
        watchAll.keyword &&
        !service.name.toLowerCase().includes(watchAll.keyword.toLowerCase())
      ) {
        return false;
      }

      // Filter pet type
      if (watchAll.petType !== "All" && service.pet_type !== watchAll.petType) {
        return false;
      }

      // Filter price
      if (
        watchAll.priceRange === "under-200" &&
        service.price_per_hour >= 200_000
      )
        return false;
      if (
        watchAll.priceRange === "200-500" &&
        (service.price_per_hour < 200_000 || service.price_per_hour > 500_000)
      )
        return false;
      if (
        watchAll.priceRange === "over-500" &&
        service.price_per_hour <= 500_000
      )
        return false;

      return true;
    });
  }, [watchAll]);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="layout-content-container flex flex-col w-full">
        {/* Page Heading */}
        <div className="flex flex-col text-center gap-3 p-4">
          <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            Dịch vụ spa cho thú cưng
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Tìm và đặt lịch tắm, cắt tỉa, chăm sóc thư giãn cho thú cưng của
            bạn.
          </p>
        </div>

        {/* FILTER FORM */}
        <section className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mt-8 p-4 sm:p-6">
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="space-y-6">
              {/* Keyword */}
              <Field className="space-y-1">
                <Label>Từ khoá tìm kiếm</Label>
                <div className="flex items-center h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="flex items-center justify-center px-3 text-gray-500">
                    <span className="material-symbols-outlined text-xl">
                      search
                    </span>
                  </div>

                  <Controller
                    name="keyword"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Nhập tên dịch vụ"
                        className="h-10 border-none bg-transparent"
                      />
                    )}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PET TYPE */}
                <Field className="space-y-1">
                  <Label>Loại thú cưng</Label>
                  <Controller
                    name="petType"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Chọn loài thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">Tất cả</SelectItem>
                          <SelectItem value="Dog">Chó</SelectItem>
                          <SelectItem value="Cat">Mèo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                {/* PRICE RANGE */}
                <Field className="space-y-1">
                  <Label>Khoảng giá</Label>
                  <Controller
                    name="priceRange"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Chọn khoảng giá" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="under-200">
                            Dưới 200.000₫
                          </SelectItem>
                          <SelectItem value="200-500">
                            200.000₫ - 500.000₫
                          </SelectItem>
                          <SelectItem value="over-500">
                            Trên 500.000₫
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              {/* RESET */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => form.reset()}
                  className="px-6 h-10 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Xoá bộ lọc
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* SERVICES LIST */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-4">
            Các dịch vụ spa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <SpaServiceCard key={service.id} service={service} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 px-4">
                Không tìm thấy dịch vụ nào.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
