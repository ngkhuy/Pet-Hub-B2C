"use client";

import { useState } from "react";
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
import { Service } from "@/lib/schemas/service";
import { EditServiceDialog } from "@/app/admin/services/_components/edit-service-dialog";

interface serviceActionsCellProps {
  row: Row<Service>;
}

export function ServiceActionsCell({ row }: serviceActionsCellProps) {
  const service = row.original;
  const [openEdit, setOpenEdit] = useState(false);

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
              navigator.clipboard.writeText(service.id);
              toast.success("Đã sao chép!", {
                position: "top-right",
                description: () => (
                  <div className="text-black">ID: {service.id}</div>
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

          <DropdownMenuItem asChild>
            <Link href={`/admin/services/${service.id}`}>
              Xem thông tin chi tiết
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Cập nhật dịch vụ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog update service */}
      <EditServiceDialog
        service={service}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </>
  );
}
