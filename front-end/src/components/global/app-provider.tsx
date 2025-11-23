"use client";

import { sessionToken } from "@/lib/api/client";
import React, { useState } from "react";

type AppProviderProps = {
  children: React.ReactNode;
  initSessionToken?: string;
};

export function AppProvider({
  children,
  initSessionToken = "",
}: AppProviderProps) {
  useState(() => {
    if (window !== undefined) sessionToken.value = initSessionToken;
  });
  return <>{children}</>;
}
