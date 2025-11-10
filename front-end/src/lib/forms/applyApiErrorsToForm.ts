import { ApiError } from "@/lib/http/errors";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export function applyApiErrorsToForm<T extends FieldValues>(
  err: unknown,
  form: UseFormReturn<T>
) {
  if (!(err instanceof ApiError)) {
    form.setError("root", {
      type: "server",
      message: err instanceof Error ? err.message : "Lỗi không xác định",
    });
    return;
  }
  const d: unknown = err.detail;

  // { errors: [{ field, message }] }
  //   if (Array.isArray(d?.errors)) {
  //     d.errors.forEach(
  //       (e: any) =>
  //         e?.field &&
  //         form.setError(e.field as keyof T, {
  //           type: "server",
  //           message: String(e.message),
  //         })
  //     );
  //   }

  // { fieldErrors: { name: [".."], phone: [".."] } }
  //   if (d?.fieldErrors && typeof d.fieldErrors === "object") {
  //     Object.entries(d.fieldErrors).forEach(([k, v]) =>
  //       form.setError(k as keyof T, {
  //         type: "server",
  //         message: Array.isArray(v) ? String(v[0]) : String(v),
  //       })
  //     );
  //   }

  toast.error(err.detail, { position: "top-center" });

  // fallback
  if (!form.formState.errors.root)
    form.setError("root", { type: "server", message: err.message });
}
