import { VetBookingResponseType } from "@/lib/types/vet";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";

type VetBookingMangementActions = {
  setBookings: (bookings: VetBookingResponseType[]) => void;
  setDeleteBooking: (Booking: VetBookingResponseType | null) => void;
  setEditBooking: (Booking: VetBookingResponseType | null) => void;

  setIsOpenEdit: (open: boolean) => void;
  setIsOpenDelete: (open: boolean) => void;
  setIsOpenCreate: (open: boolean) => void;

  addBooking: (Booking: VetBookingResponseType) => void;

  updateBooking: (Booking: VetBookingResponseType) => void;

  removeBooking: (BookingId: string) => void;
};

type VetBookingManagementStates = {
  bookings: VetBookingResponseType[];
  bookingDelete: VetBookingResponseType | null;
  bookingEdit: VetBookingResponseType | null;

  isOpenEdit: boolean;
  isOpenDelete: boolean;
  isOpenCreate: boolean;

  actions: VetBookingMangementActions;
};

const store = create<VetBookingManagementStates>()((set) => ({
  bookings: [],
  bookingDelete: null,
  bookingEdit: null,

  isOpenEdit: false,
  isOpenDelete: false,
  isOpenCreate: false,

  actions: {
    setBookings: (bookings: VetBookingResponseType[]) =>
      set(() => ({
        bookings,
      })),

    setDeleteBooking: (booking: VetBookingResponseType | null) =>
      set(() => ({
        bookingDelete: booking,
      })),

    setEditBooking: (booking: VetBookingResponseType | null) =>
      set(() => ({
        bookingEdit: booking,
      })),

    setIsOpenEdit: (open: boolean) =>
      set(() => ({
        isOpenEdit: open,
      })),

    setIsOpenDelete: (open: boolean) =>
      set(() => ({
        isOpenDelete: open,
      })),

    setIsOpenCreate: (open: boolean) =>
      set(() => ({
        isOpenCreate: open,
      })),

    addBooking: (newBooking: VetBookingResponseType) =>
      set((state) => ({
        bookings: [...state.bookings, newBooking],
      })),

    updateBooking: (updatedBooking: VetBookingResponseType) =>
      set((state) => ({
        bookings: state.bookings.map((Booking) =>
          Booking.id === updatedBooking.id ? updatedBooking : Booking
        ),
      })),

    removeBooking: (bookingId: string) =>
      set((state) => ({
        bookings: state.bookings.filter((Booking) => Booking.id !== bookingId),
      })),
  },
}));

export const useVetBookingManagementStore = createSelectors(store);
