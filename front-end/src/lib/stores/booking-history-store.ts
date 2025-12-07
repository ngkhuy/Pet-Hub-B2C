import { BookingType } from "@/lib/types/booking";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";

type BookingHistoryActions = {
  setBookings: (bookings: BookingType[]) => void;
  setBookingInfoId: (bookingId: string | null) => void;
  setBookingEditId: (bookingId: string | null) => void;
  setBookingCancelId: (bookingId: string | null) => void;

  setIsOpenInfoDialog: (isOpen: boolean) => void;
  setIsOpenEditDialog: (isOpen: boolean) => void;
  setIsOpenCancelDialog: (isOpen: boolean) => void;

  updateBookingInStore: (updatedBooking: BookingType) => void;
  removeBookingFromStore: (bookingId: string) => void;
};

type BookingHistoryStates = {
  bookings: BookingType[];
  bookingInfoId: string | null;
  bookingEditId: string | null;
  bookingCancelId: string | null;

  isOpenInfoDialog: boolean;
  isOpenEditDialog: boolean;
  isOpenCancelDialog: boolean;

  actions: BookingHistoryActions;
};

const store = create<BookingHistoryStates>()((set) => ({
  bookings: [],
  bookingInfoId: null,
  bookingEditId: null,
  bookingCancelId: null,

  isOpenInfoDialog: false,
  isOpenEditDialog: false,
  isOpenCancelDialog: false,

  actions: {
    setBookings: (bookings: BookingType[]) =>
      set(() => ({ bookings: [...bookings] })),

    setBookingInfoId: (bookingId: string | null) =>
      set(() => ({ bookingInfoId: bookingId })),

    setBookingEditId: (bookingId: string | null) =>
      set(() => ({ bookingEditId: bookingId })),

    setBookingCancelId: (bookingId: string | null) =>
      set(() => ({ bookingCancelId: bookingId })),

    setIsOpenInfoDialog: (isOpen: boolean) =>
      set(() => ({ isOpenInfoDialog: isOpen })),

    setIsOpenEditDialog: (isOpen: boolean) =>
      set(() => ({ isOpenEditDialog: isOpen })),

    setIsOpenCancelDialog: (isOpen: boolean) =>
      set(() => ({ isOpenCancelDialog: isOpen })),

    updateBookingInStore: (updatedBooking: BookingType) =>
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === updatedBooking.id ? updatedBooking : b
        ),
      })),

    removeBookingFromStore: (bookingId: string) =>
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== bookingId),
      })),
  },
}));

export const useBookingHistoryStore = createSelectors(store);

export const getBookingById = (bookingId: string) =>
  store.getState().bookings.find((b) => b.id === bookingId);
