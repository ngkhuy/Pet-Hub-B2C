import {
  ChangePasswordBodySchema,
  ChangePasswordFormSchema,
  LoginFormSchema,
  RegisterBodySchema,
  RegisterFormSchema,
  TokenResponseSchema,
} from "@/lib/schemas/auth";
import z from "zod";

// form types****************************************
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;

// body types****************************************
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>;

// response types****************************************
export type TokenResponseType = z.infer<typeof TokenResponseSchema>;
