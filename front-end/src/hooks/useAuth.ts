"use client";
import useSWR, { mutate as globalMutate } from "swr";
import { userSchema, UserType } from "@/lib/schemas/user";
import { request } from "@/lib/http/fetcher";

// Hook đọc user hiện tại
export function useMe() {
  const { data, error, isLoading, mutate } = useSWR<UserType>("/me", {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  return {
    user: data ?? null,
    loading: isLoading,
    error,
    refresh: () => mutate(),
  };
}

// Action đăng nhập/đăng xuất (backend nên set cookie httpOnly)
export async function login(payload: {
  phone_number: string;
  password: string;
}) {
  await request("/auth/login", {
    method: "POST",
    credentials: "include",
    body: payload, // request() của bạn tự JSON.stringify + header
  });
  // Sau khi login thành công, refetch /me
  await globalMutate("/me");
}

export async function logout() {
  await request("/auth/logout", { method: "POST", credentials: "include" });
  await globalMutate("/me", null, { revalidate: false });
}
