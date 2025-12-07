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
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";
import { toastError, toastLoading, toastSuccess } from "@/lib/utils/toast";
import { toast } from "sonner";

export function OwnPetDeleteDialog() {
  const pet = useOwnPetStore.use.removePet();
  const isOpen = useOwnPetStore.use.isOpenDeleteDialog();
  const { setIsOpenDeleteDialog, setRemovePet, removePet } =
    useOwnPetStore.use.actions();

  async function onDelete() {
    const loadingToastId = toastLoading("Đang xóa thú cưng...");
    try {
      await userManagementApi.deleteMyPet(pet?.id ?? "");
      setRemovePet("");
      removePet(pet?.id ?? "");
      toast.dismiss(loadingToastId);
      toastSuccess(`Xóa thú cưng ${pet?.name} thành công.`);
    } catch (error) {
      const err = error as HttpError;
      toast.dismiss(loadingToastId);
      toastError("Xóa thú cưng thất bại", { description: err.detail });
      console.error("Failed to delete pet:", err);
    }
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {pet?.name} khỏi danh sách?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thú cưng và các thông tin liên
              quan sẽ bị xóa khỏi hồ sơ của bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
