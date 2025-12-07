"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MdBorderHorizontal } from "react-icons/md";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { ServiceType } from "@/lib/types/booking";
import { bookingApi } from "@/lib/api/booking";
import { toastPromise } from "@/lib/utils/toast";
import { adminUrl } from "@/lib/data/web-url";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

interface ActionsCellProps {
  row: Row<ServiceType>;
}

export function ServiceActionsCell({ row }: ActionsCellProps) {
  const spaService = row.original;
  const {
    setIsOpenEdit,
    setServiceEdit,
    setIsOpenAlertDialog,
    setAlertDialog,
    removeService,
  } = useServiceManagementStore.use.actions();

  function handleClickTrigger() {
    setServiceEdit(spaService);
    setIsOpenEdit(true);
  }

  function handleClickAlertDialog() {
    setAlertDialog({
      title: "Xóa dịch vụ",
      description: `Bạn có chắc chắn muốn xóa dịch vụ "${spaService.name}" không? Hành động này không thể hoàn tác.`,
      confirmButtonText: "Xóa dịch vụ",
      cancelButtonText: "Hủy",
      onConfirm: async () => {
        try {
          await toastPromise(
            bookingApi
              .deleteService(spaService.id)
              .then(() => removeService(spaService.id)),
            {
              error: `Xóa dịch vụ "${spaService.name}" thất bại.`,
              loading: `Đang xóa dịch vụ "${spaService.name}"...`,
              success: `Đã xóa dịch vụ "${spaService.name}" thành công.`,
            }
          );
        } catch (error) {
          console.error("Failed to delete service:", error);
        }
      },
    });
    setIsOpenAlertDialog(true);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MdBorderHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Chức năng</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(spaService.id);
              toast.success("Đã sao chép!", {
                position: "top-right",
                description: () => (
                  <div className="text-black">ID: {spaService.id}</div>
                ),
                duration: 2000,
                icon: <CheckCircle className="text-green-500" />,
                className:
                  "border border-green-300 bg-green-50/90 text-green-700 shadow-md",
              });
            }}
          >
            Sao chép ID vào clipboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleClickTrigger}>
            Cập nhật dịch vụ
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleClickAlertDialog}>
            <span className="text-red-500 font-bold"> Xóa dịch vụ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
