import z from "zod";
import {
  PetTypeWithNoneSchema,
  PriceRangeSchema,
} from "@/app/(marketing)/service/(booking)/_common/schemas";

export type PriceRangeType = z.infer<typeof PriceRangeSchema>;

export type PetTypeWithNoneType = z.infer<typeof PetTypeWithNoneSchema>;

export const PriceRangeLabels: Record<PriceRangeType, string> = {
  all: "Tất cả",
  "under-200": "Dưới 200.000₫",
  "200-500": "200.000₫ - 500.000₫",
  "over-500": "Trên 500.000₫",
};

export const PriceRangeValues: Record<PriceRangeType, [number, number]> = {
  all: [0, Infinity],
  "under-200": [0, 200000],
  "200-500": [200000, 500000],
  "over-500": [500000, Infinity],
};

export type FilterBookingServiceType = {
  keyword: string;
  petType: PetTypeWithNoneType;
  priceRange: PriceRangeType;
};

export const PetTypeWithNoneLabels: Record<PetTypeWithNoneType, string> = {
  Dog: "Chó",
  Cat: "Mèo",
  All: "Chó và mèo",
  None: "Tất cả",
};

export type BookingConfirmDialogType = {
  formId: string;
  content: React.ReactNode;
};
