import { UserType } from "@/lib/types/user-management";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";

type UserManagementStoreActions = {
  setUsers: (users: UserType[]) => void;
  setUserEdit: (user: UserType | null) => void;
  setIsOpenEdit: (isOpen: boolean) => void;
  setIsOpenCreate: (isOpen: boolean) => void;
};

type UserManagementStoreStates = {
  users: UserType[];
  userEdit: UserType | null;
  isOpenEdit: boolean;
  isOpenCreate: boolean;
  actions: UserManagementStoreActions;
};

const store = create<UserManagementStoreStates>((set) => ({
  users: [],
  userEdit: null,
  isOpenEdit: false,
  isOpenCreate: false,
  actions: {
    setUsers: (users: UserType[]) => set(() => ({ users })),
    setIsOpenCreate: (isOpen: boolean) => set(() => ({ isOpenCreate: isOpen })),
    setIsOpenEdit: (isOpen: boolean) => set(() => ({ isOpenEdit: isOpen })),
    setUserEdit: (user: UserType | null) => set(() => ({ userEdit: user })),
  },
}));

export const useUserManagementStore = createSelectors(store);
