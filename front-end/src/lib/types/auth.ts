import {
  ChangePasswordBodySchema,
  ChangePasswordFormSchema,
  LoginFormSchema,
  RegisterBodySchema,
  RegisterFormSchema,
  SlideSessionResponseSchema,
  TokenResponseSchema,
} from "@/lib/schemas/auth";
import { UserRoleSchema } from "@/lib/schemas/user-management";
import z from "zod";

export type UserRoleType = z.infer<typeof UserRoleSchema>;

// form types****************************************
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;

// body types****************************************
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>;

// response types****************************************
export type TokenResponseType = z.infer<typeof TokenResponseSchema>;

export type SlideSessionResponseType = z.infer<
  typeof SlideSessionResponseSchema
>;
