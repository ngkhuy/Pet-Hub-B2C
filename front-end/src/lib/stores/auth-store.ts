import { UserRoleType } from "@/lib/types/auth";
import { UserType } from "@/lib/types/user-management";
import { createSelectors } from "@/lib/utils/store-utils";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type AuthStoreActions = {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: UserType | null) => void;
  setAuthenticated: (token: string, payload: TokenPayloadType) => void;
  setUnauthenticated: () => void;
};

type TokenPayloadType = {
  role: UserRoleType | null;
  exp: number | null;
};

type AuthStoreStates = {
  accessToken: string | null;
  tokenPayload: TokenPayloadType;
  isAuthenticated: boolean;
  user: UserType | null;
  actions: AuthStoreActions;
};

const store = create<AuthStoreStates>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        role: null,
        tokenPayload: {
          role: null,
          exp: null,
        },
        actions: {
          setIsAuthenticated: (value: boolean) =>
            set(() => ({ isAuthenticated: value })),
          setUser: (user: UserType | null) => set(() => ({ user })),
          setAuthenticated: (token: string, payload: TokenPayloadType) =>
            set(() => ({
              accessToken: token,
              tokenPayload: payload,
              isAuthenticated: true,
            })),
          setUnauthenticated: () =>
            set(() => ({
              accessToken: null,
              tokenPayload: { role: null, exp: null },
              isAuthenticated: false,
              user: null,
            })),
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          tokenPayload: state.tokenPayload,
          user: state.user,
          accessToken: state.accessToken,
        }),
      }
    )
  )
);

export const useAuthStore = createSelectors(store);

export const getAccessToken = () => {
  const state = store.getState();
  return state.accessToken;
};
