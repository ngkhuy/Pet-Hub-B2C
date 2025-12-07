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
import { useBookingManagementStore } from "@/lib/stores/booking-management-store";
import { BookingEditForm } from "@/app/admin/booking-management/_component/booking-form";

export function BookingEditDialog() {
  const isOpen = useBookingManagementStore.use.isOpenEdit();
  const { setIsOpenEdit } = useBookingManagementStore.use.actions();

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
        <BookingEditForm />
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
