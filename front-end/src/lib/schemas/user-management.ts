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

// enum schemas********************************
export const UserRoleSchema = z.enum(["admin", "user"]);

export const OtpPurposeSchema = z.enum([
  "reset_password",
  "phone_verification",
  "email_verification",
]);

// object schemas********************************
export const UserSchema = z.object({
  id: z.string(),
  full_name: z.string().optional(),
  role: UserRoleSchema,
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

export const DisplayUserSchema = UserSchema.pick({
  id: true,
  full_name: true,
  role: true,
  email: true,
  phone_number: true,
  active_status: true,
  is_email_verified: true,
  is_phone_verified: true,
});

// form schemas********************************
export const EditUserFormSchema = z.object({
  full_name: stringField({ label: "Họ và tên", min: 0 }).optional(),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || VN_PHONE_REG.test(v), "Số điện thoại không hợp lệ"),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: birthDateField().optional(),
});

export const AdminEditUserFormSchema = z.object({
  active_status: z.boolean(),
  role: UserRoleSchema,
});

export const EditAccountInfoFormSchema = z.object({
  full_name: stringField({ label: "Họ và tên", min: 0 }).optional(),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || VN_PHONE_REG.test(v), "Số điện thoại không hợp lệ"),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: birthDateField({ optional: true }),
});

// body schemas********************************
export const ResetPasswordBodySchema = z.object({
  otp: stringField({ label: "Mã OTP", min: 6 }),
  email: emailField(),
  new_password: passwordField({ label: "Mật khẩu mới" }),
});
