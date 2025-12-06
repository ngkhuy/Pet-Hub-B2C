"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { InputGroup } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PetTypeLabels,
  ServiceEditFormType,
  ServiceTypeLabels,
} from "@/lib/types/booking";
import {
  PetTypeSchema,
  ServiceEditFormSchema,
  ServiceTypeSchema,
} from "@/lib/schemas/booking";
import { bookingApi } from "@/lib/api/booking";
import { InputField } from "@/components/ui/custom/input-field";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export function ServiceEditForm() {
  const serviceEdit = useServiceManagementStore.use.serviceEdit();
  const { setIsOpenEdit, editService } =
    useServiceManagementStore.use.actions();
  const form = useForm<ServiceEditFormType>({
    resolver: zodResolver(ServiceEditFormSchema),
    defaultValues: {
      ...serviceEdit,
      duration_hours: String(serviceEdit?.duration_hours ?? 0),
      price_per_hour: String(serviceEdit?.price_per_hour ?? 0),
    },
  });
  const { handleSubmit, formState, control } = form;

  async function onSubmit(data: ServiceEditFormType) {
    try {
      // check has changed
      if (
        serviceEdit?.name === data.name &&
        serviceEdit?.service_type === data.service_type &&
        serviceEdit?.pet_type === data.pet_type &&
        String(serviceEdit?.price_per_hour) === data.price_per_hour &&
        String(serviceEdit?.duration_hours) === data.duration_hours
      ) {
        toastError("Không có thay đổi nào được thực hiện.");
        return;
      }
      const result = await bookingApi.editService(serviceEdit?.id ?? "", data);
      editService(result);
      toastSuccess("Thêm dịch vụ thành công!");
      setIsOpenEdit(false);
    } catch (err) {
      toastError("Cập nhat dịch vụ thất bại. Vui lòng thử lại.");
      console.error(err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-">
        <form
          noValidate
          id="form-edit-service"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="space-y-2  p-6">
            {/* Service Name */}
            <InputField<ServiceEditFormType>
              control={control}
              name="name"
              type="text"
              label="Tên dịch vụ"
              inputProps={{
                placeholder: "Nhập tên dịch vụ",
                inputMode: "text",
              }}
              id="form-service-create-name"
              className="text-(--text-secondary)"
            />

            {/* Service Type */}
            <Controller
              name="service_type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="bg-white px-3 py-6 flex justify-between">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-base font-medium leading-normal"
                    >
                      Loại dịch vụ
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn loại dịch vụ" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại dịch vụ</SelectLabel>
                          {ServiceTypeSchema.options.map((t) => (
                            <SelectItem key={t} value={t}>
                              {ServiceTypeLabels[t]}
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

            {/* Pet Type */}
            <Controller
              name="pet_type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="bg-white px-3 py-6 flex justify-between">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-base font-medium leading-normal"
                    >
                      Loại thú cưng
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn loại thứ cưng" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại thú cưng</SelectLabel>
                          {PetTypeSchema.options.map((t) => (
                            <SelectItem key={t} value={t}>
                              {PetTypeLabels[t]}
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

            {/* Price Per Hour */}
            <InputField<ServiceEditFormType>
              control={form.control}
              name="price_per_hour"
              type="text"
              label="Giá theo giờ (VNĐ)"
              inputProps={{
                placeholder: "Nhập giá ",
                inputMode: "text",
              }}
              id="form-service-create-price"
              className="text-(--text-secondary)"
            />

            {/* Duration Hours */}
            <InputField<ServiceEditFormType>
              control={form.control}
              name="duration_hours"
              type="text"
              label="Thời lượng (giờ)"
              inputProps={{
                placeholder: "Nhập thời lượng",
                inputMode: "text",
              }}
              id="form-service-create-duration"
              className="text-(--text-secondary)"
            />
          </FieldGroup>
        </form>
      </ScrollArea>
      <LoadingOverlay show={formState.isSubmitting} message="Đang tạo..." />
    </>
  );
}
