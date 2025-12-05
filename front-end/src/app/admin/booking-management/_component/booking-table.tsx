"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  BookingLabels,
  BookingStatusLabels,
  BookingStatusType,
  BookingType,
} from "@/lib/types/booking";
import { Badge } from "@/components/ui/badge";
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
import { useBookingManagementStore } from "@/lib/stores/booking-management-store";
import { currencyFormat, formatDate } from "@/lib/utils/format";

export const bookingColumns: ColumnDef<BookingType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={BookingLabels.id} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={BookingLabels.status} />
      );
    },
    cell: ({ row }) => {
      const label = row.getValue("status") as BookingStatusType;

      return <Badge variant="outline">{BookingStatusLabels[label]}</Badge>;
    },
  },
  {
    accessorKey: "total_price",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={BookingLabels.total_price}
        />
      );
    },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="px-2 py-1 text-xs font-semibold rounded-md 
                 bg-orange-50 text-orange-700 border-orange-200"
      >
        {currencyFormat(row.getValue("total_price"))}
      </Badge>
    ),
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={BookingLabels.start_time}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {formatDate({ date: row.getValue("start_time"), type: "datetime" })}
      </div>
    ),
  },
  {
    accessorKey: "end_time",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={BookingLabels.end_time} />
      );
    },
    cell: ({ row }) => (
      <div>
        {formatDate({ date: row.getValue("end_time"), type: "datetime" })}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={BookingLabels.created_at}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {formatDate({ date: row.getValue("created_at"), type: "datetime" })}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={BookingLabels.updated_at}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {formatDate({ date: row.getValue("updated_at"), type: "datetime" })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <BookingActionsCell row={row} />,
  },
];

interface ActionsCellProps {
  row: Row<BookingType>;
}

export function BookingActionsCell({ row }: ActionsCellProps) {
  const booking = row.original;
  const { setIsOpenEdit, setBookingEdit } =
    useBookingManagementStore.use.actions();

  function handleClickTrigger() {
    setBookingEdit(booking);
    setIsOpenEdit(true);
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

          <DropdownMenuItem onClick={handleClickTrigger}>
            Cập nhật thông tin đặt lịch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
