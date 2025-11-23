"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { User } from "@/lib/schemas/user";
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
import { EditUserDialog } from "@/app/admin/users/_components/edit-user-dialog";

interface UserActionsCellProps {
  row: Row<User>;
  onUpdated?: () => void;
}

export function UserActionsCell({ row, onUpdated }: UserActionsCellProps) {
  const user = row.original;
  const [openEdit, setOpenEdit] = useState(false);

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

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Cập nhật user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog update user */}
      <EditUserDialog
        onUpdated={onUpdated}
        user={user}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
    </>
  );
}
