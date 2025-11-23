"use client";

import { z } from "zod";

const configSchema = z.object({
  AUTH_API: z.string(),
  BOOKING_API: z.string(),
  USER_MANGEMENT_API: z.string(),
  APP_URL: z.string(),
  NEXT_PUBLIC_FACEBOOK_URL: z.string(),
  NEXT_PUBLIC_INSTAGRAM_URL: z.string(),
  NEXT_PUBLIC_GITHUB_URL: z.string(),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string(),
  NEXT_PUBLIC_PHONE_NUMBER: z.string(),
});
type Config = z.infer<typeof configSchema>;

const loadConfig: Partial<Config> = {
  AUTH_API: process.env.NEXT_PUBLIC_AUTH_API,
  BOOKING_API: process.env.NEXT_PUBLIC_BOOKING_API,
  USER_MANGEMENT_API: process.env.NEXT_PUBLIC_USER_MANAGEMENT_API,
  APP_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
};

const configProject = configSchema.safeParse(loadConfig);
if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
