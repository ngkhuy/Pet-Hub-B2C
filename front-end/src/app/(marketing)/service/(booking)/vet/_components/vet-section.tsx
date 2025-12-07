"use client";

import { PriceRangeSchema } from "@/app/(marketing)/service/(booking)/_common/schemas";
import {
  FilterServiceType,
  PriceRangeLabels,
} from "@/app/(marketing)/service/(booking)/_common/types";
import { ServiceLoadingSkeleton } from "@/app/(marketing)/service/(booking)/_component/loading-service-skeleton";
import { VetServiceCard } from "@/app/(marketing)/service/(booking)/vet/_components/vet-service-card";
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
import { HttpError } from "@/lib/api/client";
import { vetApi } from "@/lib/api/vet";
import { useVetServiceStore } from "@/lib/stores/vet-service-store";
import { toastError } from "@/lib/utils/toast";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function VetSection() {
  const [isFetching, setIsFetching] = useState(false);
  const fiteredServices = useVetServiceStore.use.filteredServices();
  const {
    setServices,
    setFilteredServices,
    setIsOpenBookingDialog,
    setBookingService,
  } = useVetServiceStore.use.actions();

  useEffect(() => {
    let isMounted = true;

    async function fetchVetServices() {
      setIsFetching(true);

      try {
        const data = await vetApi.getServices();

        if (!isMounted) return;

        setServices(data);
        setFilteredServices([...data]);
      } catch (error: unknown) {
        if (isMounted) {
          toastError("Lấy danh sách dịch vụ Thú y thất bại", {
            description: (error as HttpError).detail,
          });
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    fetchVetServices();

    return () => {
      isMounted = false;
    };
  }, [setServices, setFilteredServices]);

  return (
    <section className="mt-12 w-full">
      {isFetching && fiteredServices.length == 0 ? (
        <ServiceLoadingSkeleton />
      ) : fiteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fiteredServices.map((service) => (
            <VetServiceCard
              key={service.id}
              service={service}
              onClickBooking={() => {
                setBookingService(service);
                setIsOpenBookingDialog(true);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 px-4">
          Không tìm thấy dịch vụ nào.
        </p>
      )}
    </section>
  );
}

export function VetSearchSection() {
  const filteredServices = useVetServiceStore.use.filteredServices();
  const { filterServices } = useVetServiceStore.use.actions();
  const [search, setSearch] = useState<FilterServiceType>({
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
        <FieldGroup className="grid grid-cols-2 md:grid-cols-2 justify-center items-center">
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

          {/* PRICE RANGE */}
          <Field className="space-y-1">
            <FieldLabel>Khoảng giá</FieldLabel>
            <Select
              value={search.priceRange}
              onValueChange={(v) =>
                setSearch((state) => ({
                  ...state,
                  priceRange: v as FilterServiceType["priceRange"],
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

          {/* RESET */}
        </FieldGroup>
        <div className="mt-4 ">
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
      </form>
    </section>
  );
}
