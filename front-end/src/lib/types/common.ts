import { MessageResponseSchema } from "@/lib/schemas/common";
import z from "zod";

export type MessageResponseType = z.infer<typeof MessageResponseSchema>;

export type BooleanType = {
  true: string;
  false: string;
};
