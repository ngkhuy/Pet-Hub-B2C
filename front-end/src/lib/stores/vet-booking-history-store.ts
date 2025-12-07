import { FilterKeyType } from "@/app/account/vet-booking-history/_common/utils";
import { VetBookingResponseType } from "@/lib/types/vet";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Filter = {
  filters: Record<keyof FilterKeyType, string>;
  sortOrder: "desc" | "asc";
};

type BookingHistoryActions = {
  setBookings: (bookings: VetBookingResponseType[]) => void;
  setFilteredBookings: (bookings: VetBookingResponseType[]) => void;
  setBookingInfo: (booking: VetBookingResponseType) => void;
  setBookingEdit: (booking: VetBookingResponseType) => void;
  setBookingCancel: (booking?: VetBookingResponseType | null) => void;

  setIsOpenInfoDialog: (isOpen: boolean) => void;
  setIsOpenEditDialog: (isOpen: boolean) => void;
  setIsOpenCancelDialog: (isOpen: boolean) => void;

  updateBookingInStore: (updatedBooking: VetBookingResponseType) => void;
  removeBookingFromStore: (bookingId: string) => void;
};

type BookingHistoryStates = {
  filteredBookings: VetBookingResponseType[];
  bookings: VetBookingResponseType[];
  bookingInfo: VetBookingResponseType | null;
  bookingEdit: VetBookingResponseType | null;
  bookingCancel: VetBookingResponseType | null;

  isOpenInfoDialog: boolean;
  isOpenEditDialog: boolean;
  isOpenCancelDialog: boolean;

  actions: BookingHistoryActions;
};

const store = create<BookingHistoryStates>()(
  devtools((set) => ({
    bookings: [],
    filteredBookings: [],
    bookingInfo: null,
    bookingEdit: null,
    bookingCancel: null,

    isOpenInfoDialog: false,
    isOpenEditDialog: false,
    isOpenCancelDialog: false,

    actions: {
      setBookings: (bookings: VetBookingResponseType[]) =>
        set(() => ({ bookings: [...bookings] })),

      setFilteredBookings: (bookings: VetBookingResponseType[]) =>
        set(() => ({ filteredBookings: [...bookings] })),

      setBookingInfo: (booking: VetBookingResponseType | null) =>
        set(() => ({ bookingInfo: booking })),

      setBookingEdit: (booking: VetBookingResponseType | null) =>
        set(() => ({ bookingEdit: booking })),

      setBookingCancel: (booking: VetBookingResponseType | null) =>
        set(() => {
          if (!booking) return { bookingCancel: null };
          return { bookingCancel: booking };
        }),

      setIsOpenInfoDialog: (isOpen: boolean) =>
        set(() => ({ isOpenInfoDialog: isOpen })),

      setIsOpenEditDialog: (isOpen: boolean) =>
        set(() => ({ isOpenEditDialog: isOpen })),

      setIsOpenCancelDialog: (isOpen: boolean) =>
        set(() => ({ isOpenCancelDialog: isOpen })),

      updateBookingInStore: (updatedBooking: VetBookingResponseType) =>
        set((state) => {
          return {
            bookings: state.bookings.map((b) =>
              b.id === updatedBooking.id ? updatedBooking : b
            ),
            filteredBookings: state.filteredBookings.map((b) =>
              b.id === updatedBooking.id ? updatedBooking : b
            ),
          };
        }),

      removeBookingFromStore: (bookingId: string) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== bookingId),
        })),
    },
  }))
);

export const useVetBookingHistoryStore = createSelectors(store);

export const getBookingById = (bookingId: string) =>
  store.getState().bookings.find((b) => b.id === bookingId);
