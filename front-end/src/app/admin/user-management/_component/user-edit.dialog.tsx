"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserEditForm } from "@/app/admin/user-management/_component/user-edit-form";
import { useUserManagementStore } from "@/lib/stores/user-management-store";

export function UserEditDialog() {
  const isOpen = useUserManagementStore.use.isOpenEdit();
  const { setIsOpenEdit } = useUserManagementStore.use.actions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenEdit}>
      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Cập nhật người dùng</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin cá nhân.</DialogDescription>
        </DialogHeader>
        {/* form */}
        <UserEditForm />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpenEdit(false)}>
            Hủy
          </Button>
          <Button type="submit" form="form-edit-user">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
