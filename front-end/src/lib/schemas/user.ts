// src/lib/schemas/user.ts
import z from "zod";

import { VN_PHONE_REG } from "@/lib/utils/regex";
import {
  birthDateField,
  emailField,
  isoDatetime,
  passwordField,
  stringField,
} from "@/lib/schemas/common";

export const userRoleSchema = z.enum(["admin", "user"]);
export type UserRole = z.infer<typeof userRoleSchema>;

// Enum****************************************
export const otpPurposeSchema = z.enum([
  "reset_password",
  "phone_verification",
  "email_verification",
]);
export type OTPPurpose = z.infer<typeof otpPurposeSchema>;

// User schema****************************************
export const User = z.object({
  id: z.string(),
  full_name: z.string().optional(),
  role: userRoleSchema,
  email: z.string(),
  phone_number: z.string().optional(),
  avt_url: z.string().optional(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
  active_status: z.boolean(),
  created_at: isoDatetime,
  updated_at: isoDatetime,
  bio: z.string().optional(),
  date_of_birth: isoDatetime.optional(),
});
export type UserType = z.infer<typeof User>;

// user display
export const DisplayUser = User.pick({
  id: true,
  full_name: true,
  role: true,
  email: true,
  phone_number: true,
  active_status: true,
  is_email_verified: true,
  is_phone_verified: true,
});

export const UserLabels: Record<keyof z.infer<typeof User>, string> = {
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
  keyof z.infer<typeof DisplayUser> | "actions",
  string
> = {
  ...UserLabels,
  actions: "Chức năng",
};

//Request and Response schema****************************************

// admin edit user
export const AdminEditUserForm = z.object({
  active_status: z.boolean(),
  role: userRoleSchema,
});
export type AdminEditUserFormType = z.infer<typeof AdminEditUserForm>;

// user edit
export const EditUserForm = z.object({
  full_name: stringField({ label: "Họ và tên", min: 0 }).optional(),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || VN_PHONE_REG.test(v), "Số điện thoại không hợp lệ"),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: birthDateField().optional(),
});
// forgot password - send OTP
export const resetPasswordRequestSchema = z.object({
  email: emailField(),
  purpose: otpPurposeSchema,
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// reset password - verify OTP
export const verifyResetPassRequestSchema = z.object({
  otp: stringField({ label: "Mã OTP", min: 6 }),
  email: emailField(),
  new_password: passwordField({ label: "Mật khẩu mới" }),
});
export type VerifyResetPassRequest = z.infer<
  typeof verifyResetPassRequestSchema
>;

// update account information
export const EditAccountInfoForm = z.object({
  full_name: stringField({ label: "Họ và tên", min: 0 }).optional(),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || VN_PHONE_REG.test(v), "Số điện thoại không hợp lệ"),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: birthDateField({ optional: true }),
});
export type EditAccountInfoFormType = z.infer<typeof EditAccountInfoForm>;
