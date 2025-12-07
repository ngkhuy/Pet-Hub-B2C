import { VetServiceResponseType } from "@/lib/types/vet";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";

type VetServiceMangementActions = {
  setServices: (bookings: VetServiceResponseType[]) => void;
  setDeleteService: (service: VetServiceResponseType | null) => void;
  setEditService: (service: VetServiceResponseType | null) => void;

  setIsOpenEdit: (open: boolean) => void;
  setIsOpenDelete: (open: boolean) => void;
  setIsOpenCreate: (open: boolean) => void;

  addService: (service: VetServiceResponseType) => void;

  updateService: (service: VetServiceResponseType) => void;

  removeService: (serviceId: string) => void;
};

type VetServiceManagementStates = {
  services: VetServiceResponseType[];
  serviceDelete: VetServiceResponseType | null;
  serviceEdit: VetServiceResponseType | null;

  isOpenEdit: boolean;
  isOpenDelete: boolean;
  isOpenCreate: boolean;

  actions: VetServiceMangementActions;
};

const store = create<VetServiceManagementStates>()((set) => ({
  services: [],
  serviceDelete: null,
  serviceEdit: null,

  isOpenEdit: false,
  isOpenDelete: false,
  isOpenCreate: false,

  actions: {
    setServices: (services: VetServiceResponseType[]) =>
      set(() => ({
        services,
      })),

    setDeleteService: (service: VetServiceResponseType | null) =>
      set(() => ({
        serviceDelete: service,
      })),

    setEditService: (service: VetServiceResponseType | null) =>
      set(() => ({
        serviceEdit: service,
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

    addService: (newService: VetServiceResponseType) =>
      set((state) => ({
        services: [...state.services, newService],
      })),

    updateService: (updatedService: VetServiceResponseType) =>
      set((state) => ({
        services: state.services.map((service) =>
          service.id === updatedService.id ? updatedService : service
        ),
      })),

    removeService: (serviceId: string) =>
      set((state) => ({
        services: state.services.filter((service) => service.id !== serviceId),
      })),
  },
}));

export const useVetServiceManagementStore = createSelectors(store);
