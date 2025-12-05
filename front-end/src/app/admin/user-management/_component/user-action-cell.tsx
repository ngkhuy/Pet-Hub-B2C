"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MdBorderHorizontal } from "react-icons/md";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { UserType } from "@/lib/types/user-management";
import { useUserManagementStore } from "@/lib/stores/user-management-store";

interface UserActionsCellProps {
  row: Row<UserType>;
}

export function UserActionsCell({ row }: UserActionsCellProps) {
  const user = row.original;
  const { setIsOpenEdit, setUserEdit } = useUserManagementStore.use.actions();

  function handleClickTrigger() {
    setUserEdit(user);
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
              navigator.clipboard.writeText(user.id);
              toast.success("Đã sao chép!", {
                position: "top-right",
                description: () => (
                  <div className="text-black">ID: {user.id}</div>
                ),
                duration: 2000,
                icon: <CheckCircle className="text-green-500" />,
                className:
                  "border border-green-300 bg-green-50/90 text-green-700 shadow-md",
              });
            }}
          >
            Sao chép ID vào clipboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>Xem thông tin chi tiết</Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleClickTrigger}>
            Cập nhật user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog update user */}
      {/* <EditUserDialog
        onUpdated={onUpdated}
        user={user}
        open={openEdit}
        onOpenChange={setOpenEdit}
      /> */}
    </>
  );
}
