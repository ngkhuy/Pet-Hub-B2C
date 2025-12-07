import z from "zod";

// start_time schema
type StartTimeOptions = {
  label?: string;
  nullable?: boolean;
  messages?: {
    required?: string;
    invalid?: string;
    past?: string;
    outOfWorkingHours?: string;
  };
  workingHours?: {
    from: { hour: number; minute: number };
    to: { hour: number; minute: number };
  };
};

export const createStartTimeSchema = (options: StartTimeOptions = {}) => {
  const {
    label = "Thời gian cuộc hẹn",
    nullable = false,
    messages = {},
    workingHours = {
      from: { hour: 8, minute: 30 },
      to: { hour: 21, minute: 30 },
    },
  } = options;

  const schema = z
    .string({
      error: messages.required ?? `${label} là bắt buộc`,
    })
    .superRefine((value, ctx) => {
      if (!value) return;

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: "invalid_format",
          format: "datetime",
          message: messages.invalid ?? `${label} không hợp lệ`,
        });
      }

      // 1. Không được hiện tại / quá khứ
      const now = new Date();
      if (date <= now) {
        ctx.addIssue({
          code: "custom",
          message: messages.past ?? `${label} phải ở thời điểm trong tương lai`,
        });
      }

      const h = date.getHours();
      const m = date.getMinutes();

      const afterStart =
        h > workingHours.from.hour ||
        (h === workingHours.from.hour && m >= workingHours.from.minute);

      const beforeEnd =
        h < workingHours.to.hour ||
        (h === workingHours.to.hour && m <= workingHours.to.minute);

      if (!(afterStart && beforeEnd)) {
        const format = (hour: number, minute: number) =>
          `${hour}:${minute.toString().padStart(2, "0")}`;

        ctx.addIssue({
          code: "custom",
          message:
            messages.outOfWorkingHours ??
            `${label} phải trong khung giờ ${format(
              workingHours.from.hour,
              workingHours.from.minute
            )} – ${format(workingHours.to.hour, workingHours.to.minute)}`,
        });
      }
    });

  return nullable ? schema.nullable() : schema;
};

// end_time schema
type EndTimeOptions = {
  label?: string;
  nullable?: boolean;
  messages?: {
    required?: string;
    invalid?: string;
    beforeStart?: string;
    tooShort?: string;
    outOfWorkingHours?: string;
  };
  workingHours?: {
    from: { hour: number; minute: number };
    to: { hour: number; minute: number };
  };
};

export const createEndTimeSchema = (options: EndTimeOptions = {}) => {
  const {
    label = "Thời gian kết thúc",
    nullable = false,
    messages = {},
    workingHours = {
      from: { hour: 8, minute: 30 },
      to: { hour: 21, minute: 30 },
    },
  } = options;

  const schema = z
    .string({
      error: messages.required ?? `${label} là bắt buộc`,
    })
    .superRefine((value, ctx) => {
      if (!value) return;

      const end = new Date(value);
      if (Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: "invalid_format",
          format: "datetime",
          message: messages.invalid ?? `${label} không hợp lệ`,
        });
      }

      const h = end.getHours();
      const m = end.getMinutes();

      const afterStart =
        h > workingHours.from.hour ||
        (h === workingHours.from.hour && m >= workingHours.from.minute);

      const beforeEnd =
        h < workingHours.to.hour ||
        (h === workingHours.to.hour && m <= workingHours.to.minute);

      if (!(afterStart && beforeEnd)) {
        const format = (hr: number, min: number) =>
          `${hr}:${min.toString().padStart(2, "0")}`;

        ctx.addIssue({
          code: "custom",
          message:
            messages.outOfWorkingHours ??
            `${label} phải nằm trong khung ${format(
              workingHours.from.hour,
              workingHours.from.minute
            )} – ${format(workingHours.to.hour, workingHours.to.minute)}`,
        });
      }
    });

  return nullable ? schema.nullable() : schema;
};
