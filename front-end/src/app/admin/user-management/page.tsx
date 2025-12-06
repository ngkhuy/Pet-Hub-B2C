"use client";

import { userColumns } from "@/app/admin/user-management/_component/user-column";
import { UserCreateDialog } from "@/app/admin/user-management/_component/user-create-dialog";
import { DataTable } from "@/components/ui/table/data-table";
import { userManagementApi } from "@/lib/api/user-management";
import { UserLabelsWithActions } from "@/lib/types/user-management";
import { toastError } from "@/lib/utils/toast";
import { useEffect } from "react";
import { UserEditDialog } from "@/app/admin/user-management/_component/user-edit.dialog";
import { useUserManagementStore } from "@/lib/stores/user-management-store";

export default function UserManagementPage() {
  const users = useUserManagementStore.use.users();

  const { setUsers } = useUserManagementStore.use.actions();

  useEffect(() => {
    userManagementApi
      .adminGetUsers()
      .then((data) => {
        if (data.length > 0) {
          setUsers(data);
        }
      })
      .catch((err) => {
        toastError("Lấy danh sách người dùng thất bại");
        console.error("Error when loading user list:", err);
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={UserLabelsWithActions}
        columns={userColumns}
        data={users}
        renderCreateDialog={UserCreateDialog}
        renderEditDialog={UserEditDialog}
      />
    </div>
  );
}
