"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { useState } from "react";
import { useCreateUserForm } from "@/hooks/userCreateUserForm";
import { UserCreateFormFields } from "@/app/admin/users/_components/sections/user-create-form-fields";
import { UserPreview } from "@/app/admin/users/_components/sections/user-update-preview";

type UserCreateDialogProps = {
  onCreated?: () => void;
};

export function UserCreateDialog({ onCreated }: UserCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    fullName,
    phoneNumber,
    email,
    avatarPreview,
    fileInputRef,
    setAvatarFromUrl,
    handleFileChange,
    handleDrop,
  } = useCreateUserForm({
    onClose: () => setOpen(false),
    onCreated,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Tạo mới</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin người dùng. Kéo xuống nếu màn hình nhỏ.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 py-4">
          <form id="form-create-user" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative space-y-6">
              <LoadingOverlay show={isSubmitting} message="Đang tạo..." />

              <UserCreateFormFields
                control={control}
                fileInputRef={fileInputRef}
                setAvatarFromUrl={setAvatarFromUrl}
                handleFileChange={handleFileChange}
                handleDrop={handleDrop}
              />

              <UserPreview
                email={email}
                fullName={fullName}
                phoneNumber={phoneNumber}
                avatarPreview={avatarPreview}
              />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="submit" form="form-create-user" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
