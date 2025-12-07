import {
  BookingConfirmDialogType,
  FilterBookingServiceType,
  PriceRangeValues,
} from "@/app/(marketing)/service/(booking)/_common/types";
import { ServiceType } from "@/lib/types/booking";
import { compareService } from "@/lib/utils/sort";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type HotelServiceStoreActions = {
  setIsOpenBookingDialog: (isOpen: boolean) => void;
  setIsOpenConfirmDialog: (isOpen: boolean) => void;

  setServices: (services: ServiceType[]) => void;
  setFilteredServices: (services: ServiceType[]) => void;

  setBookingConfirmDialog: (dialog: BookingConfirmDialogType | null) => void;
  setBookingService: (param: string | ServiceType | null) => void;

  filterServices: (filter: FilterBookingServiceType) => void;
};

type HotelServiceStoreStates = {
  services: ServiceType[];
  filteredServices: ServiceType[];
  isOpenBooking: boolean;
  isOpenConfirmDialog: boolean;
  bookingConfirmDialog: BookingConfirmDialogType | null;
  bookingService: ServiceType | null;
  actions: HotelServiceStoreActions;
};

const store = create<HotelServiceStoreStates>()(
  //   devtools(
  (set) => ({
    services: [],
    filteredServices: [],
    bookingService: null,
    bookingConfirmDialog: null,
    isOpenBooking: false,
    isOpenConfirmDialog: false,

    actions: {
      setBookingConfirmDialog: (dialog: BookingConfirmDialogType | null) =>
        set(() => ({
          bookingConfirmDialog: dialog,
        })),

      setIsOpenConfirmDialog: (isOpen: boolean) =>
        set(() => ({
          isOpenConfirmDialog: isOpen,
        })),

      setServices: (services: ServiceType[]) =>
        set(() => ({ services: services })),

      setFilteredServices: (services: ServiceType[]) =>
        set(() => ({ filteredServices: services })),

      setIsOpenBookingDialog: (isOpen: boolean) =>
        set(() => ({ isOpenBooking: isOpen })),

      setBookingService: (param: string | ServiceType | null) =>
        set((state) => {
          if (param === null) {
            return { bookingService: null };
          }
          if (typeof param === "string") {
            const service = state.services.find(
              (service) => service.id === param
            );
            return { bookingService: service || null };
          }
          return { bookingService: param };
        }),

      filterServices: (filter: FilterBookingServiceType) =>
        set((state) => ({
          filteredServices: state.services
            .filter((service) => {
              return (
                // filter by keyword
                (!filter.keyword ||
                  service.name
                    .toLowerCase()
                    .includes(filter.keyword.toLowerCase())) &&
                // filter by pet type
                (filter.petType === "None" ||
                  service.pet_type === filter.petType) &&
                // filter by price range
                PriceRangeValues[filter.priceRange][0] <=
                  service.price_per_hour &&
                service.price_per_hour <= PriceRangeValues[filter.priceRange][1]
              );
            })
            .sort((a, b) => compareService(a, b, filter.keyword)),
        })),
    },
  })
  // )
);

export const useHotelServiceStore = createSelectors(store);
