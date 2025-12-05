"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";
import OwnPetEditForm from "@/app/account/pets/_components/own-pet-edit-form";

export function OwnPetEditDialog() {
  const isOpen = useOwnPetStore.use.isOpenEditDialog();
  const pet = useOwnPetStore.use.editPet();
  const { setIsOpenEditDialog } = useOwnPetStore.use.actions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenEditDialog}>
      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Chỉnh sửa thông tin thú cưng</DialogTitle>
          <DialogDescription>
            Cập nhật lại thông tin cho <b>{pet?.name}</b>.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <OwnPetEditForm />
        {/* Submit actions */}
      </DialogContent>
    </Dialog>
  );
}
