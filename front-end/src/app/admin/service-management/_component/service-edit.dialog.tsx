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
import { ServiceEditForm } from "@/app/admin/service-management/_component/service-edit-form";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export function ServiceEditDialog() {
  const isOpen = useServiceManagementStore.use.isOpenEdit();
  const { setIsOpenEdit } = useServiceManagementStore.use.actions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenEdit}>
      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Cập nhật thông tin dịch vụ</DialogTitle>
          <DialogDescription>
            Vui lòng điền thông tin dịch vụ bên dưới và lưu để cập nhật.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <ServiceEditForm />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpenEdit(false)}>
            Hủy
          </Button>
          <Button type="submit" form="form-edit-service">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
