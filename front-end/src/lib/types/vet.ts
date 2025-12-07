import {
  AdminVetBookingEditBodySchema,
  VetBookingCreateBodySchema,
  VetBookingEditBodySchema,
  VetBookingResponseSchema,
  VetServiceCreateBodySchema,
  VetServiceEditBodySchema,
  VetServiceResponseSchema,
} from "@/lib/schemas/vet";
import { z } from "zod";

// enum ****************************************

// object types****************************************

// form types****************************************

// query types****************************************
export type VetBookingQueryType = {
  user_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
};

// body types****************************************
export type VetBookingCreateBodyType = z.infer<
  typeof VetBookingCreateBodySchema
>;

export type VetBookingEditBodyType = z.infer<typeof VetBookingEditBodySchema>;

export type AdminVetBookingEditBodyType = z.infer<
  typeof AdminVetBookingEditBodySchema
>;

export type VetServiceCreateBodyType = z.infer<
  typeof VetServiceCreateBodySchema
>;
export type VetServiceEditBodyType = z.infer<typeof VetServiceEditBodySchema>;

// response types****************************************
export type VetServiceResponseType = z.infer<typeof VetServiceResponseSchema>;

export type VetBookingResponseType = z.infer<typeof VetBookingResponseSchema>;
