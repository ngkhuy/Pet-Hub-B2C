import * as z from "zod";

export const userquerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});
