"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef, Row } from "@tanstack/react-table";
import { toastSuccess } from "@/lib/utils/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdBorderHorizontal } from "react-icons/md";
import { currencyFormat } from "@/lib/utils/format";
import { VetServiceResponseType } from "@/lib/types/vet";
import { VetServiceLabels } from "@/lib/schemas/vet";
import { useVetServiceManagementStore } from "@/lib/stores/vet-service-management-store";

export const serviceColumns: ColumnDef<VetServiceResponseType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={VetServiceLabels.id} />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={VetServiceLabels.name} />
      );
    },
  },
  {
    accessorKey: "base_price",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.base_price}
        />
      );
    },
    cell: ({ row }) => <div>{currencyFormat(row.getValue("base_price"))}</div>,
  },
  {
    accessorKey: "duration_minutes",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.duration_minutes}
        />
      );
    },
  },
  {
    accessorKey: "doses_required",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.doses_required}
        />
      );
    },
  },
  {
    accessorKey: "dose_interval_days",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.dose_interval_days}
        />
      );
    },
  },
  {
    accessorKey: "follow_up_interval_days",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.follow_up_interval_days}
        />
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetServiceLabels.description}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ServiceActionsCell row={row} />,
  },
];

interface ActionsCellProps {
  row: Row<VetServiceResponseType>;
}

export function ServiceActionsCell({ row }: ActionsCellProps) {
  const service = row.original;
  const { setIsOpenEdit, setEditService, setIsOpenDelete, setDeleteService } =
    useVetServiceManagementStore.use.actions();

  function handleClickEdit() {
    setEditService(service);
    setIsOpenEdit(true);
  }

  function handleClickDelete() {
    setDeleteService(service);
    setIsOpenDelete(true);
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
              navigator.clipboard.writeText(service.id);
              toastSuccess("Đã sao chép!", {
                position: "top-right",
                description: () => (
                  <div className="text-black">ID: {service.id}</div>
                ),
              });
            }}
          >
            Sao chép ID vào clipboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleClickEdit}>
            Cập nhật thông tin dịch vụ
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleClickDelete}>
            <span className="text-red-500 font-bold">Xoá dịch vụ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
