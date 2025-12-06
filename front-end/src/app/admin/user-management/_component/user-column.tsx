"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { ColumnDef } from "@tanstack/react-table";

import { UserLabels, UserRole, UserType } from "@/lib/types/user-management";
import { BooleanBadge } from "@/components/ui/custom/boolean-badge";
import { UserActionsCell } from "@/app/admin/user-management/_component/user-action-cell";

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
    cell: ({ row }) => (
      <BooleanBadge
        value={(row.getValue("role") as UserRole) === "admin"}
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
          title={UserLabels.is_email_verified}
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
          title={UserLabels.is_phone_verified}
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
