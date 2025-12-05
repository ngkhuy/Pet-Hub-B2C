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
import { usePathname, useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { InputField } from "@/components/ui/custom/input-field";
import {
  PetTypeSchema,
  ServiceCreateFormSchema,
  ServiceTypeSchema,
} from "@/lib/schemas/booking";
import {
  PetTypeLabels,
  ServiceCreateFormType,
  ServiceTypeLabels,
} from "@/lib/types/booking";
import { bookingApi } from "@/lib/api/booking";
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
import { HttpError } from "@/lib/api/client";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export function ServiceCreateForm() {
  const { setIsOpenCreate, addService } =
    useServiceManagementStore.use.actions();
  const form = useForm<ServiceCreateFormType>({
    resolver: zodResolver(ServiceCreateFormSchema),
    defaultValues: {
      service_type: "Hotel",
      pet_type: "All",
      name: "",
      duration_hours: "0",
      price_per_hour: "0",
    },
  });
  const { handleSubmit, formState, control } = form;

  async function onSubmit(data: ServiceCreateFormType) {
    try {
      const result = await bookingApi.createService(data);
      addService(result);
      toastSuccess("Thêm dịch vụ thành công!");
      setIsOpenCreate(false);
    } catch (error) {
      const err = error as HttpError;
      toastError("Thêm dịch vụ thất bại", { description: err.detail });
      console.error(err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-">
        <form
          noValidate
          id="form-create-service"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="space-y-2  p-6">
            {/* Service Name */}
            <InputField<ServiceCreateFormType>
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
            <InputField<ServiceCreateFormType>
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
            <InputField<ServiceCreateFormType>
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
      {/* Submit actions */}
      <DialogFooter className="p-4 border-t">
        <div className="flex-1 ms-5">
          <Button variant={"link"} onClick={() => form.reset()}>
            Xóa
          </Button>
        </div>
        <Button variant="outline" onClick={() => setIsOpenCreate(false)}>
          Hủy
        </Button>
        <Button type="submit" form="form-create-service">
          Tạo dịch vụ
        </Button>
      </DialogFooter>
      <LoadingOverlay show={formState.isSubmitting} message="Đang tạo..." />
    </>
  );
}
