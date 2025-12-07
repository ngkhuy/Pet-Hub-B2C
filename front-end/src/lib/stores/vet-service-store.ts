import {
  BookingConfirmDialogType,
  FilterServiceType,
  PriceRangeValues,
} from "@/app/(marketing)/service/(booking)/_common/types";
import { VetServiceResponseType } from "@/lib/types/vet";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type VetServiceStoreActions = {
  setIsOpenBookingDialog: (isOpen: boolean) => void;
  setIsOpenConfirmDialog: (isOpen: boolean) => void;

  setServices: (services: VetServiceResponseType[]) => void;
  setFilteredServices: (services: VetServiceResponseType[]) => void;

  setBookingConfirmDialog: (dialog: BookingConfirmDialogType | null) => void;
  setBookingService: (param: string | VetServiceResponseType | null) => void;

  filterServices: (filter: FilterServiceType) => void;
};

type VetServiceStoreStates = {
  services: VetServiceResponseType[];
  filteredServices: VetServiceResponseType[];
  isOpenBooking: boolean;
  isOpenConfirmDialog: boolean;
  bookingConfirmDialog: BookingConfirmDialogType | null;
  bookingService: VetServiceResponseType | null;
  actions: VetServiceStoreActions;
};

const store = create<VetServiceStoreStates>()(
  // devtools(
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

      setIsOpenBookingDialog: (isOpen: boolean) =>
        set(() => ({
          isOpenBooking: isOpen,
        })),

      setServices: (services: VetServiceResponseType[]) =>
        set(() => ({
          services,
        })),

      setFilteredServices: (services: VetServiceResponseType[]) =>
        set(() => ({
          filteredServices: services,
        })),

      setBookingService: (param: string | VetServiceResponseType | null) =>
        set((state) => {
          if (typeof param === "string") {
            const service = state.services.find(
              (service) => service.id === param
            );
            return {
              bookingService: service || null,
            };
          }
          return { bookingService: param };
        }),

      filterServices: (filter: FilterServiceType) =>
        set((state) => {
          const { keyword, priceRange } = filter;
          let filtered = [...state.services];
          if (keyword) {
            filtered = filtered.filter((service) =>
              service.name.toLowerCase().includes(keyword.toLowerCase())
            );
          }

          const [minPrice, maxPrice] = PriceRangeValues[priceRange];
          filtered = filtered.filter(
            (service) =>
              service.base_price >= minPrice && service.base_price <= maxPrice
          );
          return { filteredServices: filtered };
        }),
    },
  })
  // )
);

export const useVetServiceStore = createSelectors(store);
