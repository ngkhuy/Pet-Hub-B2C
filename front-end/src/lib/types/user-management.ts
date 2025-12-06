import {
  AdminCreateUserFormSchema,
  AdminEditUserFormSchema,
  DisplayUserSchema,
  EditAccountInfoFormSchema,
  OtpPurposeSchema,
  PetAddFormSchema,
  PetEditFormSchema,
  PetSchema,
  PetSpeciesSchema,
  ResetPasswordBodySchema,
  UserRoleSchema,
  UserSchema,
} from "@/lib/schemas/user-management";
import z from "zod";

// enum types*******************************
export type UserRole = z.infer<typeof UserRoleSchema>;

export type OTPPurpose = z.infer<typeof OtpPurposeSchema>;

export type PetSpecies = z.infer<typeof PetSpeciesSchema>;

// object types*****************************
export type UserType = z.infer<typeof UserSchema>;

export type PetType = z.infer<typeof PetSchema>;

// labels************************************
export const PetSpeciesLabels: Record<PetSpecies, string> = {
  dog: "Chó",
  cat: "Mèo",
};

export const UserLabels: Record<keyof z.infer<typeof UserSchema>, string> = {
  id: "ID",
  email: "Email",
  phone_number: "Số điện thoại",
  active_status: "Còn hoạt động",
  created_at: "Ngày tạo",
  updated_at: "Ngày cập nhật",
  full_name: "Họ và tên",
  role: "Vai trò",
  avt_url: "Ảnh đại diện",
  is_email_verified: "Xác minh email",
  is_phone_verified: "Xác minh số điện thoại",
  bio: "Tiểu sử",
  date_of_birth: "Ngày sinh",
};

export const UserRolesLabels: Record<UserRole, string> = {
  admin: "Quản trị viên",
  user: "Người dùng",
};

export type BooleanType = {
  true: string;
  false: string;
};

export const UserActiveStatusLabels: Record<keyof BooleanType, string> = {
  true: "Hoạt động",
  false: "Không hoạt động",
};

export const UserLabelsWithActions: Record<
  keyof z.infer<typeof DisplayUserSchema> | "actions",
  string
> = {
  ...UserLabels,
  actions: "Chức năng",
};

// form types********************************
export type AdminEditUserFormType = z.infer<typeof AdminEditUserFormSchema>;

export type AdminCreateUserFormType = z.infer<typeof AdminCreateUserFormSchema>;

export type EditAccountInfoFormType = z.infer<typeof EditAccountInfoFormSchema>;

export type PetAddFormType = z.infer<typeof PetAddFormSchema>;

export type PetEditFormType = z.infer<typeof PetEditFormSchema>;

// body types********************************
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBodySchema>;
