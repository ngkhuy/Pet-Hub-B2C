"use client";

import { UserSchema } from "@/lib/schemas/user-management";
import { UserType } from "@/lib/types/user-management";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext<{
  user: UserType | null;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  accessToken: null,
  setAccessToken: () => {},
  setUser: () => {},
  isAuthenticated: false,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUserState] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const isAuthenticated = Boolean(user);
  const setUser = useCallback(
    (user: UserType | null) => {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    [setUserState]
  );

  useEffect(() => {
    async function initUser() {
      const _user = localStorage.getItem("user");
      const parsedUser = await UserSchema.safeParseAsync(
        _user ? JSON.parse(_user) : null
      );
      setUserState(parsedUser.success ? parsedUser.data : null);
    }

    initUser();
  }, [setUserState]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
