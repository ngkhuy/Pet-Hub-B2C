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
import { useSpaServiceStore } from "@/lib/stores/spa-service-store";

export function BookingSpaConfirmDialog() {
  const isOpenAlert = useSpaServiceStore.use.isOpenConfirmDialog();
  const content = useSpaServiceStore.use.bookingConfirmDialog();
  const { setIsOpenConfirmDialog } = useSpaServiceStore.use.actions();

  return (
    <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenConfirmDialog}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận đặt dịch vụ</AlertDialogTitle>
          {content && (
            <AlertDialogDescription asChild>
              {content.content}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          {content && (
            <AlertDialogAction type="submit" form={content?.formId}>
              Xác nhận
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
