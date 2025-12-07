import z from "zod";
import { apiFetch } from "@/lib/api/client";
import { userManagementApiUrl } from "@/lib/data/api-url";
import { PetUsmPaginationQueryType } from "@/lib/schemas/common";
import {
  OtpPurposeSchema,
  PetSchema,
  UserResponseSchema,
  UserSchema,
} from "@/lib/schemas/user-management";
import {
  EditAccountInfoFormType,
  PetAddFormType,
  PetEditFormType,
  ResetPasswordBodyType,
  UserRole,
} from "@/lib/types/user-management";

export const userManagementApi = {
  async getMe() {
    const result = await apiFetch(
      userManagementApiUrl.ME,
      {
        method: "GET",
      },
      UserResponseSchema
    );

    return {
      ...result,
      day_of_birth: undefined,
      date_of_birth: result.day_of_birth,
    };
  },
  updateAccountInfo(data: EditAccountInfoFormType) {
    return apiFetch(
      userManagementApiUrl.ME,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          date_of_birth: undefined,
          day_of_birth: data.date_of_birth,
        }),
      },
      UserResponseSchema
    );
  },

  sendOtpToResetPassword(email: string) {
    return apiFetch(
      userManagementApiUrl.SEND_OTP_RESET_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify({
          purpose: OtpPurposeSchema.enum["email-verification"],
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
      z.undefined(),
      false
    );
  },

  resetPassword(data: ResetPasswordBodyType) {
    return apiFetch(
      userManagementApiUrl.VERIFY_OTP_RESET_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      },
      z.undefined(),
      false
    );
  },

  getOwnPets(searchQuery?: PetUsmPaginationQueryType) {
    return apiFetch(
      userManagementApiUrl.PETS(searchQuery),
      {
        method: "GET",
      },
      z.array(PetSchema)
    );
  },

  addMyPet(petData: PetAddFormType) {
    return apiFetch(
      userManagementApiUrl.ADD_PET,
      {
        method: "POST",
        body: JSON.stringify(petData),
      },
      PetSchema
    );
  },

  editMyPet(petId: string, petData: PetEditFormType) {
    return apiFetch(
      userManagementApiUrl.PET_BY_PET_ID(petId),
      {
        method: "PATCH",
        body: JSON.stringify({
          name: petData.name || null,
          species: petData.species,
          breed: petData.breed || null,
          // birth: new Date(petData.birth).toISOString(), // backend handle date parsing error
          birth: undefined,
          note: petData.note || null,
        }),
      },
      PetSchema
    );
  },

  deleteMyPet(petId: string) {
    return apiFetch(
      userManagementApiUrl.PET_BY_PET_ID(petId),
      {
        method: "DELETE",
      },
      z.undefined()
    );
  },

  adminGetUsers() {
    return apiFetch(
      userManagementApiUrl.USERS(),
      {
        method: "GET",
      },
      z.array(UserSchema)
    );
  },

  adminEditUserStatus(userId: string, activeStatus: boolean) {
    return apiFetch(
      userManagementApiUrl.USER_EDIT_STATUS(userId, activeStatus),
      {
        method: "PATCH",
        body: JSON.stringify({ active_status: activeStatus }),
      },
      UserSchema
    );
  },
  adminEditUserRole(userId: string, role: UserRole) {
    return apiFetch(
      userManagementApiUrl.USER_EDIT_ROLE(userId, role),
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      },
      UserSchema
    );
  },
};
