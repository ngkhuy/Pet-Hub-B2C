"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, UserCreate } from "@/lib/schemas/user";
import { useAvatarPreview } from "@/hooks/useAvatarPreview";
import { toastSuccess, toastError } from "@/lib/utils/toast";

export function useCreateUserForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserCreate>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      email: "",
      full_name: "",
      phone_number: "",
      role: "User",
      bio: "",
      date_of_birth: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)
        .toISOString()
        .split("T")[0],
      avt_url: "",
      is_email_verified: false,
      is_phone_verified: false,
      active_status: true,
    },
  });

  const { control, handleSubmit, reset } = form;

  const fullName = useWatch({ control, name: "full_name" });
  const phoneNumber = useWatch({ control, name: "phone_number" });
  const email = useWatch({ control, name: "email" });

  const {
    avatarPreview,
    fileInputRef,
    setFromUrl: setAvatarFromUrl,
    handleFileChange,
    handleDrop,
  } = useAvatarPreview("");

  const onSubmit = useCallback(
    async (values: UserCreate) => {
      setIsSubmitting(true);
      try {
        const parsedValues = {
          ...values,
          date_of_birth: values.date_of_birth
            ? new Date(values.date_of_birth)
            : undefined,
        };
        // Fake API

        console.log("Created user:", parsedValues);
        toastSuccess("Tạo người dùng thành công!");
        onCreated?.();
        reset();
        onClose();
      } catch (err) {
        toastError("Tạo người dùng thất bại");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, onCreated, reset]
  );

  return {
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
  };
}
