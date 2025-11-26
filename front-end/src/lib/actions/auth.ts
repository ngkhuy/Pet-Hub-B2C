"use server";

import { HttpError } from "@/lib/api/client";
import { authApiUrl } from "@/lib/data/api-url";
import { TokenResponseSchema } from "@/lib/schemas/auth";
import { LoginFormType, TokenResponseType } from "@/lib/types/auth";
import { cookies } from "next/headers";

const authBasePath = process.env.AUTH_API as string;

export async function login(data: LoginFormType) {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const response = await fetch(`${authBasePath}/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new HttpError(
      response.status,
      "Đang nhập thất bại, vui lòng kiểm tra lại thông tin."
    );
  }

  const parse = await TokenResponseSchema.safeParseAsync(await response.json());

  if (!parse.success) {
    return (parse?.data || {}) as TokenResponseType;
  }

  return parse.data;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
