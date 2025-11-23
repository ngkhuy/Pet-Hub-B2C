import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUser, editUserSchema, User } from "@/lib/schemas/user";
import { useAvatarPreview } from "./useAvatarPreview";
import { toastError, toastSuccess } from "@/lib/utils/toast";

type UseEditUserFormOptions = {
  onClose: () => void;
  onUpdated?: () => void;
};

export function useEditUserForm(
  user: User,
  { onClose, onUpdated }: UseEditUserFormOptions
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditUser>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      phone_number: user.phone_number ?? "",
      bio: user.bio ?? "",
      date_of_birth: user.date_of_birth
        ? user.date_of_birth.toISOString().split("T")[0]
        : "",
      avt_url: user.avt_url ?? "",
    },
  });

  const { control, handleSubmit } = form;

  const fullName = useWatch({ control, name: "full_name" });
  const phoneNumber = useWatch({ control, name: "phone_number" });

  const {
    avatarPreview,
    fileInputRef,
    setFromUrl,
    handleFileChange,
    handleDrop,
  } = useAvatarPreview(user.avt_url ?? "");

  const onSubmit = useCallback(
    async (values: EditUser) => {
      setIsSubmitting(true);

      try {
        const changed = Object.entries(values).some(
          ([k, v]) => v !== user[k as keyof User]
        );

        if (!changed) {
          toastError("Không có thay đổi nào để lưu.");
          return;
        }

        await new Promise((res) => setTimeout(res, 1000));

        toastSuccess(`Cập nhật thành công người dùng ID: ${user.id}!`);

        onUpdated?.();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, onUpdated, user]
  );

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    fullName,
    phoneNumber,
    avatarPreview,
    fileInputRef,
    setAvatarFromUrl: setFromUrl,
    handleFileChange,
    handleDrop,
  };
}
