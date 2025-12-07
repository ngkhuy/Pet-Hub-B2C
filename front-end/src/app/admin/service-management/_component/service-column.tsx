"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { ServiceType, ServiceLabels } from "@/lib/types/booking";
import { ServiceActionsCell } from "@/app/admin/service-management/_component/service-action-cell";
import { Badge } from "@/components/ui/badge";

export const serviceColumns: ColumnDef<ServiceType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={ServiceLabels.id} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={ServiceLabels.name} />
      );
    },
  },
  {
    accessorKey: "service_type",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={ServiceLabels.service_type}
        />
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("service_type")}</Badge>
    ),
  },
  {
    accessorKey: "pet_type",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={ServiceLabels.pet_type} />
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("pet_type")}</Badge>
    ),
  },
  {
    accessorKey: "price_per_hour",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={ServiceLabels.price_per_hour}
        />
      );
    },
  },
  {
    accessorKey: "duration_hours",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={ServiceLabels.duration_hours}
        />
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <ServiceActionsCell row={row} />,
  },
];
