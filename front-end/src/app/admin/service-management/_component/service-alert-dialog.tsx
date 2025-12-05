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
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export function ServiceDeleteAlertDialog() {
  const { cancelButtonText, confirmButtonText, description, onConfirm, title } =
    useServiceManagementStore.use.alertDialog();
  const isOpen = useServiceManagementStore.use.isOpenAlertDialog();

  const { setIsOpenAlertDialog } = useServiceManagementStore.use.actions();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpenAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
