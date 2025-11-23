"use client";

import { toast } from "sonner";
import { ToastMessage } from "@/components/ui/custom/toast-message";

type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

type ToastOptions = {
  description?: string;
  position?: ToastPosition;
};

export const toastSuccess = (title: string, options?: ToastOptions) => {
  toast.custom(
    (id) => (
      <ToastMessage
        id={id}
        title={title}
        description={options?.description}
        type="success"
      />
    ),
    { position: options?.position ?? "top-right" }
  );
};

export const toastError = (title: string, options?: ToastOptions) => {
  toast.custom(
    () => (
      <ToastMessage
        title={title}
        description={options?.description}
        type="error"
      />
    ),
    {
      position: options?.position ?? "top-right",
    }
  );
};

export const toastLoading = (title: string, options?: ToastOptions) => {
  return toast.custom(
    () => (
      <ToastMessage
        title={title}
        description={options?.description}
        type="loading"
      />
    ),
    {
      duration: Infinity,
      position: options?.position ?? "top-right",
    }
  );
};

export async function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: { position?: ToastPosition }
) {
  const loadingId = toastLoading(messages.loading, {
    position: options?.position,
  });

  try {
    const result = await promise;
    toast.dismiss(loadingId);
    toastSuccess(messages.success, { position: options?.position });
    return result;
  } catch (e) {
    toast.dismiss(loadingId);
    toastError(messages.error, { position: options?.position });
    throw e;
  }
}
