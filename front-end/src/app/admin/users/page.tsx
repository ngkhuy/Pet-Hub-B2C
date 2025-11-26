"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { userColumns } from "@/app/admin/users/_components/user-columns";
import { UserCreateDialog } from "@/app/admin/users/_components/create-user-dialog";

import { useState } from "react";
import { UserLabelsWithActions, UserType } from "@/lib/types/user-management";

export default function UserManagementPage() {
  const [{ mutate, users }] = useState<{
    users: UserType[];
    mutate: () => void;
  }>({ users: [], mutate: () => {} }); // Placeholder for actual data fetching logic

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={UserLabelsWithActions}
        columns={userColumns}
        data={users}
        onRefresh={mutate}
        renderCreateDialog={UserCreateDialog}
      />
    </div>
  );
}
