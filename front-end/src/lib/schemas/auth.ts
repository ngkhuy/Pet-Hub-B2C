import * as z from "zod";
import { stringField } from "@/lib/utils/zod";
import { VN_PHONE_REG } from "@/lib/utils/regex";

export const loginSchema = z.object({
  phone_number: stringField({
    label: "Số điện thoại",
    min: 10,
    regex: [VN_PHONE_REG, "Số điện thoại không hợp lệ"],
  }),
  password: stringField({
    label: "Mật khẩu",
    min: 8,
    max: 50,
  }),
});
export type LoginType = z.infer<typeof loginSchema>;

export const registerInputSchema = z
  .object({
    phone_number: stringField({
      label: "Số điện thoại",
      min: 10,
      regex: [VN_PHONE_REG, "Số điện thoại không hợp lệ"],
    }),
    password: stringField({
      label: "Mật khẩu",
      min: 8,
      max: 50,
    }),
    confirm_password: stringField({
      label: "Xác nhận mật khẩu",
      min: 8,
      max: 50,
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Mật khẩu không khớp",
    path: ["confirm_password"],
  });

export type RegisterInputType = z.input<typeof registerInputSchema>;

export const registerschema = registerInputSchema.transform(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ confirm_password, ...rest }) => rest
);

export type RegisterType = z.infer<typeof registerschema>;

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
});

export type LoginResponseType = z.infer<typeof loginResponseSchema>;

export const changePasswordInputSchema = z
  .object({
    old_password: stringField({
      label: "Mật khẩu hiện tại",
      min: 8,
      max: 50,
    }),
    new_password: stringField({
      label: "Mật khẩu mới",
      min: 8,
      max: 50,
    }),
    confirm_new_password: stringField({
      label: "Xác nhận mật khẩu mới",
      min: 8,
      max: 50,
    }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    error: "Mật khẩu mới không khớp",
    path: ["confirm_new_password"],
  });

export type ChangePasswordInputType = z.infer<typeof changePasswordInputSchema>;

export const changePasswordSchema = changePasswordInputSchema.transform(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ confirm_new_password, ...rest }) => rest
);

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const messageResponseSchema = z.object({
  message: z.string(),
});

export type MessageResponseType = z.infer<typeof messageResponseSchema>;

export const sendOtpSchema = z.object({
  phone_number: stringField({
    label: "Số điện thoại",
    min: 10,
    regex: [VN_PHONE_REG, "Số điện thoại không hợp lệ"],
  }),
  purpose: z.literal(["password_reset", "phone_authentication"]),
});

export type SendOtpType = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  phone_number: stringField({
    label: "Số điện thoại",
    min: 10,
    regex: [VN_PHONE_REG, "Số điện thoại không hợp lệ"],
  }),
  otp: stringField({
    label: "OTP",
    min: 6,
    max: 6,
  }),
  purpose: z.literal("password_reset"),
});

export type VerifyOtpType = z.infer<typeof verifyOtpSchema>;

export const otpResponseSchema = z.object({
  message: z.string(),
  reset_token: z.string(),
  purpose: z.string(),
});

export type OtpResponseType = z.infer<typeof otpResponseSchema>;

export const resetPassSchema = z
  .object({
    new_password: stringField({
      label: "Mật khẩu mới",
      min: 8,
      max: 50,
    }),
    confirm_new_password: stringField({
      label: "Xác nhận mật khẩu mới",
      min: 8,
      max: 50,
    }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    error: "Mật khẩu mới không khớp",
    path: ["confirm_new_password"],
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .transform(({ confirm_new_password, ...rest }) => rest);

export type ResetPassType = z.infer<typeof resetPassSchema>;
