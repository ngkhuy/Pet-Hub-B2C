import z from "zod";

import { messageResponseSchema } from "@/lib/schemas/common";
import { apiFetch } from "@/lib/api/client";
import {
  RegisterResponseSchema,
  TokenResponseSchema,
} from "@/lib/schemas/auth";
import envConfig from "@/config/config";

import { authApiUrl } from "@/lib/data/api-url";
import {
  ChangePasswordBodyType,
  LoginFormType,
  RegisterBodyType,
} from "@/lib/types/auth";

export const authApi = {
  async register(body: RegisterBodyType) {
    return await apiFetch(
      authApiUrl.SIGNUP,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      },
      RegisterResponseSchema
    );
  },

  async login(body: LoginFormType) {
    const formData = new FormData();
    formData.append("username", body.username);
    formData.append("password", body.password);

    const data = await apiFetch(
      authApiUrl.LOGIN,
      { method: "POST", body: formData },
      TokenResponseSchema,
      false
    );

    return data;
  },

  changePassword(body: ChangePasswordBodyType) {
    return apiFetch(
      authApiUrl.CHANGE_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      },
      messageResponseSchema
    );
  },

  async logout() {
    await Promise.all([
      apiFetch(authApiUrl.LOGOUT, { method: "POST" }, z.undefined()),
    ]);
    localStorage.removeItem(envConfig.USER_STORAGE_KEY);
  },

  logoutFromNextServerToServer: (sessionToken: string) =>
    apiFetch(
      authApiUrl.LOGOUT,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
      z.undefined()
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    apiFetch(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
        signal,
      }
    ),
  slideSessionFromNextServerToServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      "/api/auth/slide-session",
      {},
      { baseUrl: "" }
    ),
};
