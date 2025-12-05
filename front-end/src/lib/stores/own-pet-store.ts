import { PetType } from "@/lib/types/user-management";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type OwnPetStoreActions = {
  setOwnPets: (pets: PetType[]) => void;

  setIsOpenAddDialog: (isOpen: boolean) => void;
  setIsOpenEditDialog: (isOpen: boolean) => void;
  setIsOpenDeleteDialog: (isOpen: boolean) => void;

  addPet: (pet: PetType) => void;
  removePet: (petId: string) => void;
  setEditPet: (petId: string | null) => void;
  setRemovePet: (petId: string | null) => void;
  editPet: (pet: PetType) => void;
  clearPets: () => void;
};

type OwnPetStoreStates = {
  ownPets: PetType[];
  editPet: PetType | null;
  removePet: PetType | null;
  isOpenAddDialog: boolean;
  isOpenEditDialog: boolean;
  isOpenDeleteDialog: boolean;
  actions: OwnPetStoreActions;
};

const store = create<OwnPetStoreStates>()(
  devtools(
    persist(
      (set, get) => ({
        ownPets: [],
        isOpenAddDialog: false,
        isOpenEditDialog: false,
        isOpenDeleteDialog: false,
        editPet: null,
        removePet: null,
        actions: {
          removePet: (petId) =>
            set((state) => ({
              ownPets: state.ownPets.filter((pet) => pet.id !== petId),
            })),
          editPet: (pet) =>
            set((state) => ({
              ownPets: state.ownPets.map((p) => {
                if (p.id === pet.id) {
                  return pet;
                }
                return p;
              }),
            })),
          setEditPet: (petId) =>
            set((state) => ({
              editPet: !petId
                ? null
                : state.ownPets.find((pet) => pet.id === petId),
            })),
          setRemovePet: (petId) =>
            set((state) => ({
              removePet: !petId
                ? null
                : state.ownPets.find((pet) => pet.id === petId),
            })),
          clearPets: () => set(() => ({ ownPets: [] })),
          addPet: (pet) =>
            set((state) => ({ ownPets: [...state.ownPets, pet] })),
          setOwnPets: (pets) => set(() => ({ ownPets: pets })),
          setIsOpenAddDialog: (isOpen) =>
            set(() => ({ isOpenAddDialog: isOpen })),
          setIsOpenEditDialog: (isOpen) =>
            set(() => ({ isOpenEditDialog: isOpen })),
          setIsOpenDeleteDialog: (isOpen) =>
            set(() => ({ isOpenDeleteDialog: isOpen })),
        },
      }),
      {
        name: "own-pet-storage",
        partialize: (state) => ({
          ownPets: state.ownPets,
        }),
      }
    )
  )
);

export const useOwnPetStore = createSelectors(store);

export function getPetById(petId: string) {
  return store.getState().ownPets.find((p) => p.id === petId);
}
