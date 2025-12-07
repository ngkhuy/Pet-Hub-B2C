"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { ColumnDef } from "@tanstack/react-table";

import {
  UserActiveStatusLabels,
  UserConfirmLabels,
  UserLabels,
  UserRole,
  UserRolesLabels,
  UserType,
} from "@/lib/types/user-management";
import { BooleanBadge } from "@/components/ui/custom/boolean-badge";
import { UserActionsCell } from "@/app/admin/user-management/_component/user-action-cell";
import { User } from "lucide-react";

export const userColumns: ColumnDef<UserType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={UserLabels.id} />;
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={UserLabels.full_name} />
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={UserLabels.email} />;
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={UserLabels.phone_number}
        />
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={UserLabels.role} />;
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return (
        <BooleanBadge
          value={role === "admin"}
          trueLabel={UserRolesLabels["admin"]}
          falseLabel={UserRolesLabels["user"]}
          variant="info"
        />
      );
    },
  },
  {
    accessorKey: "is_email_verified",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={UserLabels.is_email_verified}
        />
      );
    },
    cell: ({ row }) => (
      <BooleanBadge
        value={row.getValue("is_email_verified") as boolean}
        trueLabel={UserConfirmLabels["true"]}
        falseLabel={UserConfirmLabels["false"]}
        variant="success"
      />
    ),
  },
  {
    accessorKey: "is_phone_verified",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={UserLabels.is_phone_verified}
        />
      );
    },
    cell: ({ row }) => (
      <BooleanBadge
        value={row.getValue("is_phone_verified") as boolean}
        trueLabel={UserConfirmLabels["true"]}
        falseLabel={UserConfirmLabels["false"]}
        variant="success"
      />
    ),
  },
  {
    accessorKey: "active_status",
    cell: ({ row }) => {
      return (
        <BooleanBadge
          value={row.getValue("active_status") as boolean}
          trueLabel={UserActiveStatusLabels["true"]}
          falseLabel={UserActiveStatusLabels["false"]}
          variant="success"
        />
      );
    },
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={UserLabels.active_status}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell row={row} />,
  },
];
