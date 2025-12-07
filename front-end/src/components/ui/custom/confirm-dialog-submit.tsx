"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useCallback, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

type ConfirmDialogSubmitProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  /** Validate toàn form (mặc định) hoặc truyền danh sách field để validate riêng */
  validate?: Parameters<UseFormReturn<T>["trigger"]>[0];
  /** copy & UI */
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;

  /** Nhận values đã validate để submit */
  onConfirm: (values: T) => Promise<void> | void;

  /** Nhận sự thay đổi busy (để parent có thể disable FieldSet nếu muốn) */
  onBusyChange?: (busy: boolean) => void;

  /** Tùy biến nút trigger (ví dụ dùng <Button/>) */
  renderTrigger?: (args: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;
};

export function ConfirmDialogSubmit<T extends FieldValues>({
  form,
  validate,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  onBusyChange,
  renderTrigger,
}: ConfirmDialogSubmitProps<T>) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const setBusyBoth = useCallback(
    (v: boolean) => {
      setBusy(v);
      onBusyChange?.(v);
    },
    [onBusyChange]
  );

  const handleValidateThenOpen = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ok = await form.trigger(validate as any);
    if (ok) setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    setBusyBoth(true);
    try {
      const values = form.getValues();
      await onConfirm(values);
    } finally {
      setBusyBoth(false);
    }
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ onClick: handleValidateThenOpen, disabled: busy })
      ) : (
        <Button type="button" disabled={busy} onClick={handleValidateThenOpen}>
          Lưu thay đổi
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
