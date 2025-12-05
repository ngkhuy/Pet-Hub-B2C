import { cn } from "@/lib/utils";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: ReactNode;
  id: string;
  addonStart?: ReactNode;
  addonEnd?: ReactNode;
  className?: string;
  groupClassName?: string;
  description?: ReactNode;
};

type InputFieldProps<T extends FieldValues> = BaseProps<T> & {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "id" | "type"
  >;
  type?: HTMLInputTypeAttribute;
};

export function InputField<T extends FieldValues>({
  control,
  name,
  type = "text",
  id,
  label,
  inputProps,
  addonStart,
  addonEnd,
  className,
  groupClassName,
  description,
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("relative gap-1 text-(--text-secondary)", className)}
        >
          {label && (
            <FieldLabel
              htmlFor={id}
              className="text-base font-medium leading-normal"
            >
              {label}
            </FieldLabel>
          )}

          <InputGroup
            className={cn(
              "bg-white ps-1 py-6 leading-normal text-(--text-primary)",
              groupClassName
            )}
          >
            {addonStart && (
              <InputGroupAddon align="inline-start">
                {addonStart}
              </InputGroupAddon>
            )}

            <InputGroupInput
              {...field}
              id={id}
              type={type}
              aria-invalid={fieldState.invalid}
              {...inputProps}
            />

            {addonEnd && (
              <InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>
            )}
          </InputGroup>

          {description && !fieldState.error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="absolute -bottom-6 "
            />
          )}
        </Field>
      )}
    />
  );
}

type InputFieldTextareaProps<T extends FieldValues> = Omit<
  BaseProps<T>,
  "addonStart" | "addonEnd"
> & {
  inputTextareaProps?: Omit<
    InputHTMLAttributes<HTMLTextAreaElement>,
    "name" | "id"
  >;
};

export function InputFieldTextarea<T extends FieldValues>({
  control,
  name,
  id,
  label,
  className,
  groupClassName,
  description,
  inputTextareaProps,
}: InputFieldTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("relative gap-1 text-(--text-secondary)", className)}
        >
          {label && (
            <FieldLabel
              htmlFor={id}
              className="text-base font-medium leading-normal"
            >
              {label}
            </FieldLabel>
          )}
          <InputGroup
            className={cn(
              "bg-white ps-1 py-1 leading-normal text-(--text-primary)",
              groupClassName
            )}
          >
            <InputGroupTextarea
              {...field}
              id={id}
              aria-invalid={fieldState.invalid}
              rows={6}
              {...inputTextareaProps}
            />
          </InputGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="absolute -bottom-6 "
            />
          )}
        </Field>
      )}
    />
  );
}

type SelectFieldProps<T extends FieldValues> = Omit<
  BaseProps<T>,
  "addonStart" | "addonEnd" | "groupClassName"
> & {
  options:
    | { optionLabels: Record<string, string>; optionValues: string[] }
    | {
        optionLabel: string;
        optionValue: string;
      }[];
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  id,
  label,
  className,
  description,
  options,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn("relative gap-1 text-(--text-secondary)", className)}
          >
            <FieldContent>
              {label && (
                <FieldLabel
                  htmlFor={id}
                  className="text-base font-medium leading-normal"
                >
                  {label}
                </FieldLabel>
              )}
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="absolute -bottom-6 "
                />
              )}
            </FieldContent>

            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id}
                aria-invalid={fieldState.invalid}
                className="min-w-[120px]"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectSeparator />

                {options instanceof Array
                  ? options.map(({ optionLabel, optionValue }) => (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionLabel}
                      </SelectItem>
                    ))
                  : options.optionValues.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {options.optionLabels[opt]}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </Field>
        );
      }}
    />
  );
}
