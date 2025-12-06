import z from "zod";

import { MessageResponseSchema } from "@/lib/schemas/common";
import { apiFetch } from "@/lib/api/client";
import {
  RegisterResponseSchema,
  SlideSessionResponseSchema,
  TokenResponseSchema,
} from "@/lib/schemas/auth";
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
        body: JSON.stringify({ password: body.password, email: body.username }),
        headers: { "Content-Type": "application/json" },
      },
      RegisterResponseSchema,
      false
    );
  },

  async login(body: LoginFormType) {
    const formData = new FormData();
    formData.append("username", body.username);
    formData.append("password", body.password);

    const data = await apiFetch(
      authApiUrl.LOGIN,
      {
        method: "POST",
        body: formData,
        headers: {
          credentials: "include",
        },
      },
      TokenResponseSchema,
      false
    );

    return data;
  },

  async slideSession(access_token: string) {
    return await apiFetch(
      "/api/auth/session",
      {
        method: "POST",
        body: JSON.stringify({
          access_token: access_token,
        }),
        credentials: "include",
      },
      SlideSessionResponseSchema,
      false
    );
  },

  async changePassword(body: ChangePasswordBodyType) {
    return await apiFetch(
      authApiUrl.CHANGE_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      MessageResponseSchema,
      true
    );
  },

  async logout() {
    "use client";
    await apiFetch(
      "/api/auth/logout",
      { method: "POST" },
      MessageResponseSchema,
      false
    );
    await apiFetch(authApiUrl.LOGOUT, { method: "POST" }, z.undefined());
  },

  async refreshToken() {
    return await apiFetch(
      authApiUrl.REFRESH_TOKEN,
      { method: "POST", credentials: "include" },
      TokenResponseSchema,
      false
    );
  },
};
