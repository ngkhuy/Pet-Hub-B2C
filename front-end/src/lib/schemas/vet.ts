import { BookingStatusSchema } from "@/lib/schemas/booking";
import { utcDateField } from "@/lib/schemas/common";
import { PetSchema } from "@/lib/schemas/user-management";
import {
  createEndTimeSchema,
  createStartTimeSchema,
} from "@/lib/utils/time-schema-utils";
import { stat } from "fs";
import { start } from "repl";
import { z } from "zod";

// enum schemas****************************************

// object schemas****************************************

// form schemas****************************************

// body schemas****************************************
export const VetBookingCreateBodySchema = z
  .object({
    user_id: z.uuidv4(),
    pet_id: z.uuidv4(),
    start_time: createStartTimeSchema({
      label: "Thời gian bắt đầu",
      nullable: false,
      messages: {
        past: "Bạn phải chọn thời gian trong tương lai",
      },
    }),
    end_time: createEndTimeSchema({
      label: "Thời gian kết thúc",
      messages: {
        beforeStart: "End time phải sau start time",
      },
      nullable: false,
    }),
    symptoms: z
      .string()
      .min(2, { message: "Mô tả triệu chứng không được để trống" })
      .trim()
      .max(500, { message: "Mô tả triệu chứng tối đa 500 ký tự" }),
    notes: z
      .string()
      .trim()
      .max(500, { message: "Ghi chú tối đa 500 ký tự" })
      .optional(),
    service_ids: z
      .array(z.uuidv4({ message: "ID dịch vụ không hợp lệ" }))
      .min(1, { message: "Phải chọn ít nhất một dịch vụ" }),
  })
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return false;
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return end > start;
    },
    {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      path: ["end_time"],
      abort: true,
    }
  );

export const VetBookingEditBodySchema = VetBookingCreateBodySchema.omit({
  pet_id: true,
  user_id: true,
  service_ids: true,
}).partial();

export const AdminVetBookingEditBodySchema = VetBookingEditBodySchema.extend({
  status: BookingStatusSchema.optional(),
});

export const VetServiceCreateBodySchema = z.object({
  name: z.string().min(1, { message: "Tên dịch vụ không được để trống" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Mô tả tối đa 1000 ký tự" })
    .optional(),
  base_price: z
    .number({ error: "Giá cơ bản phải là một số" })
    .nonnegative({ message: "Giá cơ bản phải lớn hơn hoặc bằng 0" }),
  duration_minutes: z
    .number({ error: "Thời lượng phải là một số" })
    .positive({ message: "Thời lượng phải lớn hơn 0" }),
  follow_up_interval_days: z
    .number({ error: "Khoảng thời gian tái khám phải là một số" })
    .nonnegative({
      message: "Khoảng thời gian tái khám phải lớn hơn hoặc bằng 0",
    })
    .nullable()
    .optional(),
  doses_required: z
    .number({ error: "Số liều cần thiết phải là một số" })
    .nonnegative({ message: "Số liều cần thiết phải lớn hơn hoặc bằng 0" })
    .nullable()
    .optional(),
  doses_interval_days: z
    .number({ error: "Khoảng cách giữa các liều phải là một số" })
    .nonnegative({
      message: "Khoảng cách giữa các liều phải lớn hơn hoặc bằng 0",
    })
    .nullable()
    .optional(),
});

export const VetServiceEditBodySchema = VetServiceCreateBodySchema.partial();

// response schemas****************************************
export const VetServiceResponseSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  description: z.string().nullable(),
  base_price: z.number(),
  duration_minutes: z.number(),
  follow_up_interval_days: z.number().nullable(),
  doses_required: z.number().nullable(),
  dose_interval_days: z.number().nullable(),
});

export const VetBookingResponseSchema = z.object({
  id: z.uuidv4(),
  user_id: z.uuidv4(),
  pet_id: z.uuidv4(),
  start_time: z.string().transform((str) => new Date(str)),
  end_time: z.string().transform((str) => new Date(str)),
  symptoms: z.string().nullable(),
  notes: z.string().nullable(),
  status: BookingStatusSchema,
  created_at: z.string().transform((str) => new Date(str)),
  updated_at: z.string().transform((str) => new Date(str)),
  services: VetServiceResponseSchema.array().default([]),
});
