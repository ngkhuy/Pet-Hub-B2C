import z from "zod";

import { VN_PHONE_REG } from "@/lib/utils/regex";
import {
  birthDateField,
  emailField,
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

export const PetSpeciesSchema = z.enum(["dog", "cat"]);

// object schemas********************************
export const UserSchema = z.object({
  id: z.string(),
  full_name: z.string().nullable(),
  role: UserRoleSchema,
  email: z.string(),
  phone_number: z.string().nullable(),
  avt_url: z.string().nullable(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
  active_status: z.boolean(),
  bio: z.string().nullable(),
  date_of_birth: z.date().nullable(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
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

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: PetSpeciesSchema,
  breed: z.string().nullable(),
  birth: z.string().transform((dateStr) => new Date(dateStr)),
  owner_id: z.string(),
  note: z.string().nullable(),
});

// form schemas********************************
export const AdminEditUserFormSchema = z.object({
  active_status: z.boolean(),
  role: UserRoleSchema,
});

export const AdminCreateUserFormSchema = z.object({
  username: emailField(),
  password: passwordField({ label: "Mật khẩu" }),
});

export const EditAccountInfoFormSchema = z.object({
  full_name: stringField({ label: "Họ và tên", min: 0 }).optional(),
  phone_number: z
    .string()
    .optional()
    .refine((v) => !v || VN_PHONE_REG.test(v), "Số điện thoại không hợp lệ"),
  avt_url: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: birthDateField({ optional: true }),
});

export const PetAddFormSchema = z.object({
  name: stringField({ label: "Tên thú cưng", min: 1 }),
  species: PetSpeciesSchema,
  breed: stringField({ label: "Giống", min: 0 }).nullable(),
  birth: birthDateField({ minimumAge: 0 }),
  note: stringField({ label: "Ghi chú", min: 0, max: 100 }).nullable(),
});

export const PetEditFormSchema = z.object({
  name: stringField({ label: "Tên thú cưng", min: 1 }),
  species: PetSpeciesSchema,
  breed: stringField({ label: "Giống", min: 0 }),
  birth: birthDateField({ minimumAge: 0 }),
  note: stringField({ label: "Ghi chú", min: 0, max: 100 }),
});

// body schemas********************************
export const ResetPasswordBodySchema = z.object({
  otp: stringField({ label: "Mã OTP", min: 6 }),
  email: emailField(),
  new_password: passwordField({ label: "Mật khẩu mới" }),
});

// response schemas****************************
export const UserResponseSchema = z.object({
  id: z.string(),
  full_name: z.string().nullable(),
  role: UserRoleSchema,
  email: z.string(),
  phone_number: z.string().nullable(),
  avt_url: z.string().nullable(),
  is_email_verified: z.boolean(),
  is_phone_verified: z.boolean(),
  active_status: z.boolean(),
  bio: z.string().nullable(),
  day_of_birth: z
    .string()
    .transform((v) => new Date(v))
    .nullable(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
});
