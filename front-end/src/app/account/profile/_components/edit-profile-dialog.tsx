import { EditAccountInfoFormSchema } from "@/lib/schemas/user-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { InputField } from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameAbbreviation } from "@/lib/schemas/common";
import { useRouter } from "next/navigation";
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import { useAppContext } from "@/components/global/app-provider";
import { EditAccountInfoFormType } from "@/lib/types/user-management";

export function EditProfileDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAppContext();
  const form = useForm<EditAccountInfoFormType>({
    resolver: zodResolver(EditAccountInfoFormSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      phone_number: user?.phone_number ?? "",
      avatar_url: user?.avt_url ?? "",
      bio: user?.bio ?? "",
      // giả định birthDateField() nhận "YYYY-MM-DD"
      date_of_birth: user?.date_of_birth
        ? user.date_of_birth.toISOString().split("T")[0]
        : new Date(
            new Date().getTime() - 13 * 365 * 24 * 60 * 60 * 1000 // 13 age
          )
            .toISOString()
            .split("T")[0],
    },
  });

  const avatarPreview = form.watch("avatar_url");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: EditAccountInfoFormType) {
    if (!hasChanges(values)) {
      toastError("Không có thay đổi nào để lưu.", { position: "top-center" });
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 2000));
      toastSuccess("Cập nhật thông tin thành công!");
      setOpen(false);
      const result = await userManagementApi.updateAccountInfo(values);
      console.log("Update result:", result);
      router.refresh();
    } catch (error) {
      if (error instanceof HttpError) {
        toastError(`Cập nhật thất bại: ${error.detail}`, {
          position: "top-center",
        });
      } else {
        console.error("Unexpected error:", error);
        toastError("Đã có lỗi xảy ra. Vui lòng thử lại sau.", {
          position: "top-center",
        });
      }
    }
  }

  function hasChanges(values: EditAccountInfoFormType) {
    return (
      values.full_name !== (user?.full_name ?? "") ||
      values.phone_number !== (user?.phone_number ?? "") ||
      values.avatar_url !== (user?.avt_url ?? "") ||
      values.bio !== (user?.bio ?? "") ||
      values.date_of_birth !==
        (user?.date_of_birth
          ? user.date_of_birth.toISOString().split("T")[0]
          : "")
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 h-10 px-5 bg-primary text-white hover:bg-primary/90">
          Cập nhật thông tin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg ">
        <LoadingOverlay show={isSubmitting} message="Đang lưu thay đổi..." />

        <DialogHeader>
          <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Thay đổi các thông tin bên dưới, sau đó nhấn lưu để cập nhật.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
            <InputField<EditAccountInfoFormType>
              control={control}
              name="full_name"
              label="Họ và tên"
              id="edit-fullname"
              inputProps={{ placeholder: "Nhập họ và tên" }}
            />

            <InputField<EditAccountInfoFormType>
              control={control}
              name="phone_number"
              label="Số điện thoại"
              id="edit-phone"
              type="tel"
              inputProps={{ placeholder: "098xxxxxxx" }}
            />

            <InputField<EditAccountInfoFormType>
              control={control}
              name="date_of_birth"
              label="Ngày sinh"
              id="edit-dob"
              type="date"
              inputProps={{}}
              className="md:col-span-2"
            />

            <div className="flex items-center justify-between gap-4 md:col-span-2 flex-col md:flex-row">
              <div className="flex-4 ">
                <InputField<EditAccountInfoFormType>
                  control={control}
                  name="avatar_url"
                  label="Ảnh đại diện (URL)"
                  id="edit-avatar"
                  inputProps={{ placeholder: "https://example.com/avatar.png" }}
                />
              </div>

              {/* Avatar Preview */}
              <Avatar className="flex-1 h-fit">
                <AvatarImage src={avatarPreview ?? ""} alt="Avatar Preview" />
                <AvatarFallback className="aspect-square">
                  {getNameAbbreviation(user?.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <InputField<EditAccountInfoFormType>
              control={control}
              name="bio"
              label="Giới thiệu"
              id="edit-bio"
              groupClassName="md:col-span-2"
              inputProps={{ placeholder: "Mô tả ngắn về bạn..." }}
              className="md:col-span-2"
            />
          </FieldGroup>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 px-4"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 bg-primary text-white hover:bg-primary/90"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
