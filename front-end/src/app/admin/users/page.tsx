"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { userLabelsWithActions } from "@/lib/schemas/user";
import { useUsers } from "@/hooks/userUsers";
import { userColumns } from "@/app/admin/users/_components/user-columns";
import { UserCreateDialog } from "@/app/admin/users/_components/create-user-dialog";

export default function UserManagementPage() {
  const { users, mutate } = useUsers();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={userLabelsWithActions}
        columns={userColumns}
        data={users}
        onRefresh={mutate}
        renderCreateDialog={UserCreateDialog}
      />
    </div>
  );
}
