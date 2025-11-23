"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Service, serviceLabels } from "@/lib/schemas/service";
import { ServiceActionsCell } from "@/app/admin/services/_components/service-actions-cell";

export const serviceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={serviceLabels.id} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={serviceLabels.name} />
      );
    },
  },
  {
    accessorKey: "service_type",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={serviceLabels.service_type}
        />
      );
    },
  },
  {
    accessorKey: "pet_type",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={serviceLabels.pet_type} />
      );
    },
  },
  {
    accessorKey: "price_per_hour",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={serviceLabels.price_per_hour}
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
          title={serviceLabels.duration_hours}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ServiceActionsCell row={row} />,
  },
];
