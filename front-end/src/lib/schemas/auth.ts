import z from "zod";
import {
  emailField,
  MessageResponseSchema,
  passwordField,
} from "@/lib/schemas/common";
import { UserRoleSchema } from "@/lib/schemas/user-management";

// ******************************API Schemas****************************************

// Body schemas****************************************
export const LoginFormSchema = z.object({
  username: emailField(),
  password: passwordField({ label: "Mật khẩu" }),
});

export const RegisterBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const ChangePasswordBodySchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

// response schemas****************************************
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default("bearer"),
});

// ******************************Client Schemas****************************************

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

export const ChangePasswordFormSchema = z
  .object({
    old_password: passwordField({ label: "Mật khẩu cũ" }),
    new_password: passwordField({ label: "Mật khẩu mới" }),
    confirm_new_password: passwordField({ label: "Xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_new_password"],
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

export const SlideSessionResponseSchema = MessageResponseSchema.extend({
  access_token_payload: z.object({
    sub: z.string(),
    exp: z.number(),
    role: UserRoleSchema,
  }),
});
