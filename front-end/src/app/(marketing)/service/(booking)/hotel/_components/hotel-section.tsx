"use client";

import { ServiceLoadingSkeleton } from "@/app/(marketing)/service/(booking)/_component/loading-service-skeleton";
import { ServiceCard } from "@/app/(marketing)/service/(booking)/_component/service-card";
import { bookingApi } from "@/lib/api/booking";
import { HttpError } from "@/lib/api/client";
import { useHotelServiceStore } from "@/lib/stores/hotel-service-store";
import { toastError } from "@/lib/utils/toast";
import { useEffect, useState } from "react";

export function HotelSection() {
  const [isFetching, setIsFetching] = useState(false);
  const fiteredServices = useHotelServiceStore.use.filteredServices();
  const {
    setServices,
    setFilteredServices,
    setIsOpenBookingDialog,
    setBookingService,
  } = useHotelServiceStore.use.actions();

  useEffect(() => {
    let isMounted = true;

    async function fetchSpaServices() {
      setIsFetching(true);

      try {
        const data = await bookingApi.getHotelServices();

        if (!isMounted) return;

        setServices(data);
        setFilteredServices([...data]);
      } catch (error: unknown) {
        if (isMounted) {
          toastError("Lấy danh sách dịch vụ spa thất bại", {
            description: (error as HttpError).detail,
          });
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    fetchSpaServices();

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
            <ServiceCard
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
