"use client";

import useSWR from "swr";
import { User, userSchema } from "@/lib/schemas/user";
import userData from "@/MOCK_DATA/USER_MOCK_DATA.json";

const fetchUsers = async () => {
  // PARSE mock data
  return Promise.all(userData.map((v) => userSchema.parseAsync(v)));
};

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    "/users",
    fetchUsers
  );

  return {
    users: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
