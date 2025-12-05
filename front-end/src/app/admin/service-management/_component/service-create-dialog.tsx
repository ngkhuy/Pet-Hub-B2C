"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ServiceCreateForm } from "@/app/admin/service-management/_component/service-create-form";
import { TiPlusOutline } from "react-icons/ti";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export function ServiceCreateDialog() {
  const isOpen = useServiceManagementStore.use.isOpenCreate();
  const { setIsOpenCreate } = useServiceManagementStore.use.actions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenCreate}>
      <DialogTrigger asChild>
        <Button size="sm">
          <TiPlusOutline />
          Thêm dịch vụ
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh]  p-0 rounded-xl ">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Tạo dịch vụ mới</DialogTitle>
          <DialogDescription>
            Vui lòng điền thông tin dịch vụ bên dưới và lưu để tạo.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <ServiceCreateForm />
      </DialogContent>
    </Dialog>
  );
}
