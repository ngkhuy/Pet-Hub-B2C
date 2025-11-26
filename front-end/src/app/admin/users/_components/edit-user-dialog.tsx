"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { User } from "@/lib/schemas/user-management";
import { useEditUserForm } from "@/hooks/useEditUserForm";
import { UserStaticInfo } from "@/app/admin/users/_components/sections/user-static-info";
import { UserUpdateFormFields } from "@/app/admin/users/_components/sections/user-update-form-fields";
import { UserPreview } from "@/app/admin/users/_components/sections/user-update-preview";

type EditUserDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
};

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUpdated,
}: EditUserDialogProps) {
  const {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    fullName,
    phoneNumber,
    avatarPreview,
    fileInputRef,
    setAvatarFromUrl,
    handleFileChange,
    handleDrop,
  } = useEditUserForm(user, { onClose: () => onOpenChange(false), onUpdated });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] sm p-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Cập nhật người dùng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin cá nhân. Kéo xuống nếu màn hình nhỏ.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 py-4">
          <form id="form-user" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative space-y-6">
              <LoadingOverlay show={isSubmitting} message="Đang lưu..." />

              <UserStaticInfo user={user} />

              <UserUpdateFormFields
                control={control}
                fileInputRef={fileInputRef}
                setAvatarFromUrl={setAvatarFromUrl}
                handleFileChange={handleFileChange}
                handleDrop={handleDrop}
              />

              <UserPreview
                email={user.email}
                fullName={fullName}
                phoneNumber={phoneNumber}
                avatarPreview={avatarPreview}
              />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="form-user" disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
