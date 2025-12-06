"use client";

import { userColumns } from "@/app/admin/user-management/_component/user-column";
import { UserCreateDialog } from "@/app/admin/user-management/_component/user-create-dialog";
import { DataTable } from "@/components/ui/table/data-table";
import { userManagementApi } from "@/lib/api/user-management";
import { UserLabelsWithActions } from "@/lib/types/user-management";
import { toastError } from "@/lib/utils/toast";
import { useEffect } from "react";
import UserListData from "@/MOCK_DATA/USER_MOCK_DATA.json";
import { UserSchema } from "@/lib/schemas/user-management";
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
        const mockUsers = UserListData.flatMap((user) => {
          const parsed = UserSchema.safeParse(user);
          return parsed.success ? parsed.data : [];
        });
        setUsers([
          {
            id: "449153b6-fe09-45b7-bf55-ba0a8107b88c",
            full_name: "Arda Collard",
            role: "admin",
            email: "acollard0@arizona.edu",
            phone_number: "450-639-0011",
            avt_url: "http://dummyimage.com/140x100.png/dddddd/000000",
            is_email_verified: false,
            is_phone_verified: false,
            active_status: false,
            created_at: new Date("2025-09-27T04:55:24Z"),
            updated_at: new Date("2025-03-10T02:07:30Z"),
            bio: "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
            date_of_birth: new Date("2025-01-02T13:51:28Z"),
          },
        ]);
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
