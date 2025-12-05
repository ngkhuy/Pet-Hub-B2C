"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AdminEditUserFormType } from "@/lib/types/user-management";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminEditUserFormSchema,
  UserRoleSchema,
} from "@/lib/schemas/user-management";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { userManagementApi } from "@/lib/api/user-management";
import { cn } from "@/lib/utils";
import { InputGroup } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserManagementStore } from "@/lib/stores/user-management-store";

export function UserEditForm() {
  const userEdit = useUserManagementStore.use.userEdit();
  const router = useRouter();
  const form = useForm<AdminEditUserFormType>({
    resolver: zodResolver(AdminEditUserFormSchema),
    defaultValues: {
      active_status: userEdit?.active_status ?? false,
      role: userEdit?.role ?? "user",
    },
  });
  const { handleSubmit, formState, control } = form;

  async function onSubmit(data: AdminEditUserFormType) {
    try {
      const updateArr = [];
      let hasChanges = false;
      if (data.role !== userEdit?.role) {
        hasChanges = true;
        updateArr.push(
          userManagementApi.adminEditUserRole(userEdit?.id ?? "", data.role)
        );
      }

      if (data.active_status !== userEdit?.active_status) {
        hasChanges = true;
        updateArr.push(
          userManagementApi.adminEditUserStatus(
            userEdit?.id ?? "",
            data.active_status
          )
        );
      }

      if (!hasChanges) {
        toastError("Không có thay đổi nào để cập nhật.");
        return;
      }

      await Promise.all(updateArr);
      toastSuccess("Cập nhật thông tin người dùng thành công!");
      router.refresh();
    } catch (err) {
      toastError("Cập nhật thông tin người dùng thất bại.");
      console.error(err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-5">
        <form noValidate id="form-edit-user" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8  p-6">
            <FieldGroup>
              {/* active_status */}
              <Controller
                name={"active_status"}
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={cn("relative gap-1 text-(--text-secondary)")}
                  >
                    <InputGroup
                      className={cn(
                        "bg-white px-3 py-6 flex justify-between leading-normal text-(--text-primary)"
                      )}
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium leading-normal"
                      >
                        Trạng thái hoạt động
                      </FieldLabel>

                      <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="absolute -bottom-6 "
                      />
                    )}
                  </Field>
                )}
              />

              {/* role */}
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup className="bg-white px-3 py-6 flex justify-between">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium leading-normal"
                      >
                        Vai trò
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Vai trò</SelectLabel>
                            {UserRoleSchema.options.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role === "admin"
                                  ? "Quản trị viên"
                                  : "Người dùng"}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="absolute -bottom-6"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </form>
      </ScrollArea>
      <LoadingOverlay
        show={formState.isSubmitting}
        message="Đang cập nhật..."
      />
    </>
  );
}
