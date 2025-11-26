import {
  AdminEditUserFormSchema,
  DisplayUserSchema,
  EditAccountInfoFormSchema,
  OtpPurposeSchema,
  ResetPasswordBodySchema,
  UserRoleSchema,
  UserSchema,
} from "@/lib/schemas/user-management";
import z from "zod";

// enum types*******************************
export type UserRole = z.infer<typeof UserRoleSchema>;

export type OTPPurpose = z.infer<typeof OtpPurposeSchema>;

// object types*****************************
export type UserType = z.infer<typeof UserSchema>;

// labels************************************
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

export const UserLabelsWithActions: Record<
  keyof z.infer<typeof DisplayUserSchema> | "actions",
  string
> = {
  ...UserLabels,
  actions: "Chức năng",
};

// form types********************************
export type AdminEditUserFormType = z.infer<typeof AdminEditUserFormSchema>;

export type EditAccountInfoFormType = z.infer<typeof EditAccountInfoFormSchema>;

// body types********************************
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBodySchema>;
