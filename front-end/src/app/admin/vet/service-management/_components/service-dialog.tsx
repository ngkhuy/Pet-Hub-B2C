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
import { BookingEditForm } from "@/app/admin/booking-management/_component/booking-form";
import { useVetServiceManagementStore } from "@/lib/stores/vet-service-management-store";
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
import { toastError, toastLoading, toastSuccess } from "@/lib/utils/toast";
import { vetApi } from "@/lib/api/vet";
import { HttpError } from "@/lib/api/client";
import {
  ServiceCreateForm,
  ServiceEditForm,
} from "@/app/admin/vet/service-management/_components/service-form";
import { TiPlusOutline } from "react-icons/ti";
import { toast } from "sonner";

const formEditId = "form-edit-service";
export function ServiceEditDialog() {
  const isOpen = useVetServiceManagementStore.use.isOpenEdit();
  const { setIsOpenEdit } = useVetServiceManagementStore.use.actions();

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
        <ServiceEditForm formId={formEditId} />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpenEdit(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formEditId}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceDeleteAlertDialog() {
  const { removeService, setIsOpenDelete, setDeleteService } =
    useVetServiceManagementStore.use.actions();
  const isOpen = useVetServiceManagementStore.use.isOpenDelete();
  const service = useVetServiceManagementStore.use.serviceDelete();

  async function onConfirm() {
    if (!service) {
      toastError("Dịch vụ không tồn tại hoặc đã bị xóa.");
      return;
    }
    const toastId = toastLoading("Đang xóa dịch vụ...");
    try {
      await vetApi.adminDeleteService(service.id);
      removeService(service.id);
      setDeleteService(null);
      setIsOpenDelete(false);
      toast.dismiss(toastId);
      toastSuccess("Xóa dịch vụ thành công!");
    } catch (error) {
      const err = error as HttpError;
      toast.dismiss(toastId);
      toastError("Xóa dịch vụ thất bại.", { description: err.detail });
      console.error("Failed to delete service:", err);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpenDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa dịch vụ</AlertDialogTitle>
          <AlertDialogDescription>
            {`Bạn có chắc chắn muốn xóa dịch vụ "${service?.name}" không? Hành động này
            không thể hoàn tác.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="text-white bg-red-500 hover:bg-red-500/80"
          >
            Xóa dịch vụ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const formCreateId = "form-create-service";
export function ServiceCreateDialog() {
  const isOpen = useVetServiceManagementStore.use.isOpenCreate();
  const { setIsOpenCreate } = useVetServiceManagementStore.use.actions();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenCreate}>
      <DialogTrigger asChild>
        <Button size="sm">
          <TiPlusOutline />
          Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Tạo dịch vụ mới</DialogTitle>
          <DialogDescription>
            Vui lòng điền thông tin dịch vụ bên dưới và lưu để tạo dịch vụ mới.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <ServiceCreateForm formId={formCreateId} />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpenCreate(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formCreateId}>
            Tạo dịch vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
