import {
  HotelBookingCartItemType,
  SpaBookingCartItemType,
} from "@/lib/types/booking";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingCartStoreActions = {
  addSpaToCart: (item: SpaBookingCartItemType) => void;
  removeSpaFromCart: (itemId: string) => void;
  addHotelToCart: (item: HotelBookingCartItemType) => void;
  removeHotelFromCart: (itemId: string) => void;
  clearCart: () => void;
};

type BookingCartStoreStates = {
  spaBookings: SpaBookingCartItemType[];
  hotelBookings: HotelBookingCartItemType[];
  actions: BookingCartStoreActions;
};

const store = create<BookingCartStoreStates>()(
  persist(
    (set) => ({
      spaBookings: [],
      hotelBookings: [],

      actions: {
        addSpaToCart: (item: SpaBookingCartItemType) =>
          set((state) => ({
            spaBookings: [...state.spaBookings, item],
          })),

        removeSpaFromCart: (itemId: string) =>
          set((state) => ({
            spaBookings: state.spaBookings.filter((item) => item.id !== itemId),
          })),

        addHotelToCart: (item: HotelBookingCartItemType) =>
          set((state) => ({
            hotelBookings: [...state.hotelBookings, item],
          })),

        removeHotelFromCart: (itemId: string) =>
          set((state) => ({
            hotelBookings: state.hotelBookings.filter(
              (item) => item.id !== itemId
            ),
          })),

        clearCart: () =>
          set(() => ({
            spaBookings: [],
            hotelBookings: [],
          })),
      },
    }),
    {
      name: "booking-cart-storage",
      partialize: (state) => ({
        spaBookings: state.spaBookings,
        hotelBookings: state.hotelBookings,
      }),
    }
  )
);

export const useBookingCartStore = createSelectors(store);

export const useCountAll = () =>
  store((state) => state.hotelBookings.length + state.spaBookings.length);
