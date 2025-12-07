import { z } from "zod";

const configSchema = z.object({
	// Application info
	APP_URL: z.string(),
	BRAND_NAME: z.string(),
	APP_DESCRIPTION: z.string(),
	// API endpoints
	AUTH_API: z.string(),
	BOOKING_API: z.string(),
	USER_MANGEMENT_API: z.string(),
	VET_API: z.string(),
	// Social links and contact
	NEXT_PUBLIC_FACEBOOK_URL: z.string(),
	NEXT_PUBLIC_INSTAGRAM_URL: z.string(),
	NEXT_PUBLIC_GITHUB_URL: z.string(),
	NEXT_PUBLIC_SUPPORT_EMAIL: z.string(),
	NEXT_PUBLIC_PHONE_NUMBER: z.string(),
});
type Config = z.infer<typeof configSchema>;

const loadConfig: Partial<Config> = {
	// Application info
	APP_URL: process.env.NEXT_PUBLIC_URL,
	BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
	APP_DESCRIPTION: process.env.NEXT_PUBLIC_DESCRIPTION,
	// API endpoints
	AUTH_API: process.env.NEXT_PUBLIC_AUTH_API,
	BOOKING_API: process.env.NEXT_PUBLIC_BOOKING_API,
	USER_MANGEMENT_API: process.env.NEXT_PUBLIC_USER_MANAGEMENT_API,
	VET_API: process.env.NEXT_PUBLIC_VET_API,
	// Social links and contact
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
