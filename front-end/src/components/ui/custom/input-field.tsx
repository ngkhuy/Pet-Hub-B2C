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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: ReactNode;
  id: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "id" | "type"
  >;
  type?: HTMLInputTypeAttribute;
  addonStart?: ReactNode;
  addonEnd?: ReactNode;
  className?: string;
  groupClassName?: string;
  description?: ReactNode;
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
