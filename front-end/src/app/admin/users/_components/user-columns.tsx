"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { User, userLabels, UserRole } from "@/lib/schemas/user";
import { ColumnDef } from "@tanstack/react-table";

import { BooleanBadge } from "@/components/ui/custom/boolean-badge";
import { UserActionsCell } from "@/app/admin/users/_components/user-actions-cell";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={userLabels.id} />;
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={userLabels.full_name} />
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={userLabels.email} />;
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={userLabels.phone_number}
        />
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={userLabels.role} />;
    },
    cell: ({ row }) => (
      <BooleanBadge
        value={(row.getValue("role") as UserRole) === "Admin"}
        trueLabel="Quản trị viên"
        falseLabel="Người dùng"
        variant="info"
      />
    ),
  },
  {
    accessorKey: "is_email_verified",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={userLabels.is_email_verified}
        />
      );
    },
    cell: ({ row }) => (
      <BooleanBadge
        value={row.getValue("is_email_verified") as boolean}
        trueLabel="Đã xác minh"
        falseLabel="Chưa xác minh"
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
          title={userLabels.is_phone_verified}
        />
      );
    },
    cell: ({ row }) => (
      <BooleanBadge
        value={row.getValue("is_phone_verified") as boolean}
        trueLabel="Đã xác minh"
        falseLabel="Chưa xác minh"
        variant="success"
      />
    ),
  },
  {
    accessorKey: "active_status",
    cell: ({ row }) => (
      <BooleanBadge
        value={row.getValue("active_status") as boolean}
        trueLabel="Hoat động"
        falseLabel="Vô hiệu"
        variant="success"
      />
    ),
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={userLabels.active_status}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <UserActionsCell row={row} onUpdated={table.options.meta?.onUpdated} />
    ),
  },
];
