import React from "react";
import { Control, useController } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditUser } from "@/lib/schemas/user";
import { formatVNPhone } from "@/lib/utils/format";

type Props = {
  control: Control<EditUser>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setAvatarFromUrl: (url: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export const UserUpdateFormFields = React.memo(function UserFormFields({
  control,
  fileInputRef,
  setAvatarFromUrl,
  handleFileChange,
  handleDrop,
}: Props) {
  const { field: fullName, fieldState: fullNameState } = useController({
    name: "full_name",
    control,
  });

  const { field: phone, fieldState: phoneState } = useController({
    name: "phone_number",
    control,
  });

  const { field: dob, fieldState: dobState } = useController({
    name: "date_of_birth",
    control,
  });

  const { field: bio } = useController({
    name: "bio",
    control,
  });

  const { field: avatar } = useController({
    name: "avt_url",
    control,
  });

  return (
    <>
      <Field className="space-y-1">
        <Label>Họ và tên</Label>
        <Input {...fullName} placeholder="Nguyễn Văn A" />
        {fullNameState.error && <FieldError errors={[fullNameState.error]} />}
      </Field>

      <Field className="space-y-1">
        <Label>Số điện thoại</Label>
        <Input
          value={formatVNPhone(phone.value || "")}
          onChange={(e) => phone.onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="090 123 4567"
        />
        {phoneState.error && <FieldError errors={[phoneState.error]} />}
      </Field>

      <Field className="space-y-1">
        <Label>Ngày sinh</Label>
        <Input type="date" {...dob} />
        {dobState.error && <FieldError errors={[dobState.error]} />}
      </Field>

      <Field>
        <Label>Giới thiệu</Label>
        <textarea
          {...bio}
          rows={4}
          className="w-full rounded-md border p-2 text-sm resize-none"
        />
      </Field>

      <Field className="space-y-1">
        <Label>Ảnh đại diện</Label>
        <Input
          {...avatar}
          placeholder="https://..."
          onChange={(e) => {
            avatar.onChange(e);
            setAvatarFromUrl(e.target.value);
          }}
        />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed p-4 text-center rounded-md cursor-pointer hover:bg-muted/40"
        >
          <p className="text-xs text-muted-foreground">
            Kéo ảnh vào đây hoặc bấm để chọn file
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </Field>
    </>
  );
});
