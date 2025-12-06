"use client";

import {
  PetTypeWithNoneSchema,
  PriceRangeSchema,
} from "@/app/(marketing)/service/(booking)/_common/schemas";
import {
  FilterBookingServiceType,
  PetTypeWithNoneLabels,
  PriceRangeLabels,
} from "@/app/(marketing)/service/(booking)/_common/types";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHotelServiceStore } from "@/lib/stores/hotel-service-store";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function HotelSearchSection() {
  const filteredServices = useHotelServiceStore.use.filteredServices();
  const { filterServices } = useHotelServiceStore.use.actions();
  const [search, setSearch] = useState<FilterBookingServiceType>({
    keyword: "",
    petType: "None",
    priceRange: "all",
  });

  useEffect(() => {
    filterServices(search);
  }, [search, filterServices]);

  return (
    <section className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mt-8 p-4 sm:p-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        id="form-filter-services"
      >
        <FieldGroup className="grid grid-cols-2 md:grid-cols-3 justify-center items-center">
          {/* KEYWORD */}
          <Field>
            <FieldLabel>Lọc theo tên</FieldLabel>
            <InputGroup>
              <InputGroupInput
                value={search.keyword}
                onChange={(v) => {
                  setSearch((state) => ({
                    ...state,
                    keyword: v.target.value,
                  }));
                }}
                placeholder="Nhập tên dịch vụ"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {filteredServices.length} kết quả
              </InputGroupAddon>
            </InputGroup>
          </Field>

          {/* PET TYPE */}
          <Field className="space-y-1">
            <FieldLabel>Loại thú cưng</FieldLabel>
            <Select
              value={search.petType}
              onValueChange={(v) =>
                setSearch((state) => ({
                  ...state,
                  petType: v as FilterBookingServiceType["petType"],
                }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn loài thú cưng" />
              </SelectTrigger>
              <SelectContent>
                {PetTypeWithNoneSchema.options.map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {PetTypeWithNoneLabels[pt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* PRICE RANGE */}
          <Field className="space-y-1">
            <FieldLabel>Khoảng giá</FieldLabel>
            <Select
              value={search.priceRange}
              onValueChange={(v) =>
                setSearch((state) => ({
                  ...state,
                  priceRange: v as FilterBookingServiceType["priceRange"],
                }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn khoảng giá" />
              </SelectTrigger>
              <SelectContent>
                {PriceRangeSchema.options.map((pr) => (
                  <SelectItem key={pr} value={pr}>
                    {PriceRangeLabels[pr]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex justify-between items-center ">
            <Button
              type="button"
              variant={"default"}
              onClick={() =>
                setSearch({ keyword: "", petType: "None", priceRange: "all" })
              }
              className="px-6 h-10 rounded-lg text-sm font-semibold"
            >
              Xoá bộ lọc
            </Button>
          </div>
          {/* RESET */}
        </FieldGroup>
      </form>
    </section>
  );
}
