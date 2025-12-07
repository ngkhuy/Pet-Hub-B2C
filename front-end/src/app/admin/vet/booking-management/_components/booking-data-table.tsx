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
import { VetBookingResponseType } from "@/lib/types/vet";
import { VetBookingLabels } from "@/lib/schemas/vet";
import { useVetBookingManagementStore } from "@/lib/stores/vet-booking-management-store";
import { formatDate } from "@/lib/utils/format";

export const bookingColumns: ColumnDef<VetBookingResponseType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={VetBookingLabels.id} />
      );
    },
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.user_id}
        />
      );
    },
  },
  {
    accessorKey: "pet_id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.pet_id}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.status}
        />
      );
    },
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.start_time}
        />
      );
    },
    cell: ({ row }) => {
      const time = new Date(row.original.start_time);
      return <span>{formatDate({ date: time })}</span>;
    },
  },
  {
    accessorKey: "end_time",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.end_time}
        />
      );
    },
    cell: ({ row }) => {
      const time = new Date(row.original.end_time);
      return <span>{formatDate({ date: time })}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.created_at}
        />
      );
    },
    cell: ({ row }) => {
      const time = new Date(row.original.created_at);
      return <span>{formatDate({ date: time })}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={VetBookingLabels.updated_at}
        />
      );
    },
    cell: ({ row }) => {
      const time = new Date(row.original.updated_at);
      return <span>{formatDate({ date: time })}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BookingActionsCell row={row} />,
  },
];

interface ActionsCellProps {
  row: Row<VetBookingResponseType>;
}

export function BookingActionsCell({ row }: ActionsCellProps) {
  const booking = row.original;
  const { setIsOpenEdit, setEditBooking, setIsOpenDelete, setDeleteBooking } =
    useVetBookingManagementStore.use.actions();

  function handleClickEdit() {
    setEditBooking(booking);
    setIsOpenEdit(true);
  }

  function handleClickDelete() {
    setDeleteBooking(booking);
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
              navigator.clipboard.writeText(booking.id);
              toastSuccess("Đã sao chép!", {
                position: "top-right",
                description: () => (
                  <div className="text-black">ID: {booking.id}</div>
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
