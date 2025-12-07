import { BookingStatusSchema } from "@/lib/schemas/booking";
import { utcDateField } from "@/lib/schemas/common";
import { PetSchema } from "@/lib/schemas/user-management";
import {
  VetBookingResponseType,
  VetServiceResponseType,
} from "@/lib/types/vet";
import {
  createEndTimeSchema,
  createStartTimeSchema,
} from "@/lib/utils/time-schema-utils";
import { stat } from "fs";
import { start } from "repl";
import { z } from "zod";

// enum schemas****************************************

// object schemas****************************************
export const VetServiceLabels: Record<keyof VetServiceResponseType, string> = {
  id: "ID",
  name: "Tên dịch vụ",
  description: "Mô tả",
  base_price: "Giá cơ bản",
  duration_minutes: "Thời lượng (phút)",
  follow_up_interval_days: "Khoảng thời gian tái khám (ngày)",
  doses_required: "Số liều cần thiết",
  dose_interval_days: "Khoảng cách giữa các liều (ngày)",
};

export const VetBookingLabels: Record<keyof VetBookingResponseType, string> = {
  id: "ID",
  user_id: "Khách hàng",
  pet_id: "Thú cưng",
  start_time: "Thời gian bắt đầu",
  end_time: "Thời gian kết thúc",
  symptoms: "Triệu chứng",
  notes: "Ghi chú",
  status: "Trạng thái",
  created_at: "Ngày tạo",
  updated_at: "Ngày cập nhật",
  services: "Dịch vụ",
};
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
    .string()
    .refine((v) => isNaN(Number(v)) === false, {
      message: "Giá cơ bản phải là một số",
    })
    .refine((v) => Number(v) >= 0, {
      message: "Giá cơ bản phải lớn hơn hoặc bằng 0",
    }),
  duration_minutes: z
    .string()
    .refine((v) => isNaN(Number(v)) === false, {
      message: "Giá cơ bản phải là một số",
    })
    .refine((v) => Number(v) >= 0, {
      message: "Giá cơ bản phải lớn hơn hoặc bằng 0",
    }),
  follow_up_interval_days: z
    .string()
    .refine((v) => isNaN(Number(v)) === false, {
      message: "Giá cơ bản phải là một số",
    })
    .optional(),
  doses_required: z
    .string()
    .refine((v) => isNaN(Number(v)) === false, {
      message: "Giá cơ bản phải là một số",
    })
    .optional(),
  dose_interval_days: z
    .string()
    .refine((v) => isNaN(Number(v)) === false, {
      message: "Giá cơ bản phải là một số",
    })
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
