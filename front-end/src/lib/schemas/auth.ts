import z from "zod";

import {
  emailField,
  MessageResponse,
  passwordField,
  stringField,
} from "@/lib/schemas/common";

// register
export const RegisterForm = z
  .object({
    email: emailField(),
    password: passwordField({ label: "Mật khẩu" }),
    confirm_password: passwordField({ label: "Xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });
export type RegisterFormType = z.infer<typeof RegisterForm>;

export const RegisterBody = z.object({
  email: z.string(),
  password: z.string(),
});
export type RegisterBodyType = z.infer<typeof RegisterBody>;

export const RegisterResponse = z.object({
  id: z.string(),
  email: z.string(),
  is_active: z.boolean(),
  is_phone_verified: z.boolean(),
  is_email_verified: z.boolean(),
  is_admin: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type RegisterResponseType = z.infer<typeof RegisterResponse>;

// log-in
export const LoginForm = z.object({
  email: emailField(),
  password: stringField({ label: "Mật khẩu", min: 8, max: 100 }),
});
export type LoginFormType = z.infer<typeof LoginForm>;

// token response
export const TokenResponse = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
});
export type TokenResponseType = z.infer<typeof TokenResponse>;

// change password
export const ChangePasswordForm = z
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
export type ChangePasswordFormType = z.infer<typeof ChangePasswordForm>;

export const ChangePasswordBody = z.object({
  old_password: z.string(),
  new_password: z.string(),
});
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>;

export type ChangePasswordResponseType = MessageResponse;
