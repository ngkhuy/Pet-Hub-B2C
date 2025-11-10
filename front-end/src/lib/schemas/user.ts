import * as z from "zod";

export const userSchema = z.object({
  id: z.uuidv4(),
  phone_number: z.string(),
  is_active: z.boolean(),
  is_phone_verified: z.boolean(),
  is_admin: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type UserType = z.infer<typeof userSchema>;
