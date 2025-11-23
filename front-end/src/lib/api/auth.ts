"use client";

import z from "zod";

import { messageResponseSchema } from "@/lib/schemas/common";
import { apiFetch, sessionToken } from "@/lib/api/client";
import {
  ChangePasswordBodyType,
  LoginFormType,
  RegisterBodyType,
  RegisterResponse,
  TokenResponse,
} from "@/lib/schemas/auth";
import envConfig from "@/config/config";

const BASE_PATH = envConfig.AUTH_API;

export const ENDPOINT = {
  // public endpoints
  SIGNUP: `${BASE_PATH}/signup`,
  LOGIN: `${BASE_PATH}/login`,
  // user endpoints
  LOGOUT: `${BASE_PATH}/logout`,
  CHANGE_PASSWORD: `${BASE_PATH}/user/change-password`,
  REFRESH_TOKEN: `${BASE_PATH}/refresh`,
};

export const authApi = {
  signup(body: RegisterBodyType) {
    return apiFetch(
      ENDPOINT.SIGNUP,
      { method: "POST", body: JSON.stringify(body) },
      RegisterResponse
    );
  },

  async login(body: LoginFormType) {
    const data = await apiFetch(
      ENDPOINT.LOGIN,
      { method: "POST", body: JSON.stringify(body) },
      TokenResponse
    );

    sessionToken.value = data.access_token;

    return data;
  },

  changePassword(body: ChangePasswordBodyType) {
    return apiFetch(
      ENDPOINT.CHANGE_PASSWORD,
      { method: "PATCH", body: JSON.stringify(body) },
      messageResponseSchema
    );
  },

  async logout() {
    await apiFetch(ENDPOINT.LOGOUT, { method: "POST" }, z.undefined());
    sessionToken.value = "";
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
  },
};
