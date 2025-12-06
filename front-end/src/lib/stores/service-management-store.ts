import { ServiceType } from "@/lib/types/booking";
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

type ServiceManagementStoreActions = {
  // set object
  setServices: (services: ServiceType[]) => void;
  setServiceEdit: (service: ServiceType | null) => void;
  setAlertDialog: (alertDialog: AlertDialogType) => void;
  // modify array
  addService: (service: ServiceType) => void;
  removeService: (serviceId: string) => void;
  editService: (service: ServiceType) => void;
  // boolean flags
  setIsOpenEdit: (isOpen: boolean) => void;
  setIsOpenCreate: (isOpen: boolean) => void;
  setIsOpenAlertDialog: (isOpen: boolean) => void;
};

type ServiceManagementStoreStates = {
  // data
  services: ServiceType[];
  serviceEdit: ServiceType | null;
  alertDialog: AlertDialogType;
  // boolean flags
  isOpenEdit: boolean;
  isOpenCreate: boolean;
  isOpenAlertDialog: boolean;
  // actions
  actions: ServiceManagementStoreActions;
};

const store = create<ServiceManagementStoreStates>((set) => ({
  services: [],
  serviceEdit: null,
  serviceCreate: {
    name: "",
    service_type: "Hotel",
    pet_type: "All",
    price_per_hour: "",
    duration_hours: "",
  },
  signal: 0,
  alertDialog: {
    title: "",
    description: "",
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
    onConfirm: () => {},
  },

  isOpenEdit: false,
  isOpenCreate: false,
  isOpenAlertDialog: false,

  actions: {
    setServices: (services) => set(() => ({ services })),

    setServiceEdit: (serviceEdit) => set(() => ({ serviceEdit })),

    setAlertDialog: (dialog) =>
      set((state) => ({
        alertDialog: {
          ...state.alertDialog,
          ...dialog,
        },
      })),

    setIsOpenEdit: (isOpen) => set(() => ({ isOpenEdit: isOpen })),
    setIsOpenCreate: (isOpen) => set(() => ({ isOpenCreate: isOpen })),
    setIsOpenAlertDialog: (isOpen) =>
      set(() => ({ isOpenAlertDialog: isOpen })),

    addService: (service) =>
      set((state) => ({ services: [...state.services, service] })),

    removeService: (serviceId) =>
      set((state) => ({
        services: state.services.filter((service) => service.id !== serviceId),
      })),

    editService: (editedService) =>
      set((state) => ({
        services: state.services.map((service) =>
          service.id === editedService.id ? editedService : service
        ),
      })),
  },
}));

export const useServiceManagementStore = createSelectors(store);
