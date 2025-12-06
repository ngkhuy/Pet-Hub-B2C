import { PetTypeSchema } from "@/lib/schemas/booking";
import z from "zod";

export const PriceRangeSchema = z.enum([
  "all",
  "under-200",
  "200-500",
  "over-500",
]);

export const PetTypeWithNoneSchema = z.enum([...PetTypeSchema.options, "None"]);
