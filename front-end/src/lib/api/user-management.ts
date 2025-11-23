import envConfig from "@/config/config";
import { apiFetch } from "@/lib/api/client";
import { EditAccountInfoFormType, User } from "@/lib/schemas/user";

const BASE_PATH = envConfig.USER_MANGEMENT_API;

export const ENDPOINT = {
  ME: `${BASE_PATH}/me`,
};

export const userManagementApi = {
  getMe() {
    return apiFetch(
      ENDPOINT.ME,
      {
        method: "GET",
      },
      User
    );
  },
  updateAccountInfo(data: EditAccountInfoFormType) {
    return apiFetch(
      ENDPOINT.ME,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      User
    );
  },
};
