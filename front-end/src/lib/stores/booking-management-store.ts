import { BookingType, ServiceType } from "@/lib/types/booking";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
// Store for managing the list of users in user management
type AlertDialogType = {
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
};

type BookingManagementStoreActions = {
  // set object
  setBookings: (bookings: BookingType[]) => void;
  setBookingEdit: (booking: BookingType | null) => void;
  setAlertDialog: (alertDialog: AlertDialogType) => void;
  // modify array
  editBooking: (booking: BookingType) => void;
  // boolean flags
  setIsOpenEdit: (isOpen: boolean) => void;
};

type BookingManagementStoreStates = {
  // data
  bookings: BookingType[];
  bookingEdit: BookingType | null;
  alertDialog: AlertDialogType;
  // boolean flags
  isOpenEdit: boolean;
  // actions
  actions: BookingManagementStoreActions;
};

const store = create<BookingManagementStoreStates>((set) => ({
  bookings: [],
  bookingEdit: null,
  alertDialog: {
    title: "",
    description: "",
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
    onConfirm: () => {},
  },
  isOpenEdit: false,

  actions: {
    setBookings: (bookings) => set(() => ({ bookings })),
    setBookingEdit: (booking) => set(() => ({ bookingEdit: booking })),
    setAlertDialog: (alertDialog) => set(() => ({ alertDialog })),
    editBooking: (booking) =>
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === booking.id ? booking : b
        ),
      })),
    setIsOpenEdit: (isOpen) => set(() => ({ isOpenEdit: isOpen })),
  },
}));

export const useBookingManagementStore = createSelectors(store);
