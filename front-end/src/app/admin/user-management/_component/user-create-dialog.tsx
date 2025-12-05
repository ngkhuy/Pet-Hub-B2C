"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserManagementStore } from "@/lib/stores/user-management-store";
import { UserCreateForm } from "@/app/admin/user-management/_component/user-create-form";

export function UserCreateDialog() {
  const isOpen = useUserManagementStore.use.isOpenCreate();
  const { setIsOpenCreate } = useUserManagementStore.use.actions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenCreate}>
      <DialogTrigger asChild>
        <Button size="sm">+ Tạo mới</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh]  p-0 rounded-xl ">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin người dùng. Kéo xuống nếu màn hình nhỏ.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <UserCreateForm />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpenCreate(false)}>
            Hủy
          </Button>
          <Button type="submit" form="form-create-user">
            Tạo người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
