import * as z from "zod";

interface StringFieldOptions {
  label: string;
  min?: number;
  max?: number;
  regex?: [RegExp, string];
}

export const stringField = ({
  label,
  min = 1,
  max = 255,
  regex,
}: StringFieldOptions) => {
  let schema = z
    .string({ error: `${label} là bắt buộc` })
    .min(min, `${label} ít nhất ${min} ký tự`)
    .max(max, `${label} tối đa ${max} ký tự`)
    .trim();

  if (regex) schema = schema.regex(regex[0], regex[1]);
  return schema;
};
