import z from "zod";
import { emailField, passwordField, stringField } from "@/lib/schemas/common";
import { UserRoleSchema } from "@/lib/schemas/user-management";

// form schemas****************************************
export const RegisterFormSchema = z
  .object({
    email: emailField(),
    password: passwordField({ label: "Mật khẩu" }),
    confirm_password: passwordField({ label: "Xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export const LoginFormSchema = z.object({
  username: emailField(),
  password: stringField({ label: "Mật khẩu", min: 8, max: 100 }),
});

export const ChangePasswordFormSchema = z
  .object({
    old_password: stringField({ label: "Mật khẩu cũ", min: 8, max: 100 }),
    new_password: stringField({ label: "Mật khẩu mới", min: 8, max: 100 }),
    confirm_new_password: stringField({
      label: "Xác nhận mật khẩu mới",
      min: 8,
      max: 100,
    }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_new_password"],
  });

// body schemas****************************************
export const RegisterBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const ChangePasswordBodySchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

// response schemas****************************************
export const RegisterResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  active_status: z.boolean(),
  is_phone_verified: z.boolean().optional(),
  is_email_verified: z.boolean().optional(),
  role: UserRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
});
