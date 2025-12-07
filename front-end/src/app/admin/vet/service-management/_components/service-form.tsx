"use client";

import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import {
  InputField,
  InputFieldTextarea,
} from "@/components/ui/custom/input-field";
import {
  VetServiceCreateBodySchema,
  VetServiceEditBodySchema,
} from "@/lib/schemas/vet";
import {
  VetServiceCreateBodyType,
  VetServiceEditBodyType,
} from "@/lib/types/vet";
import { useVetServiceManagementStore } from "@/lib/stores/vet-service-management-store";
import { vetApi } from "@/lib/api/vet";
import { HttpError } from "@/lib/api/client";

export function ServiceEditForm({ formId }: { formId: string }) {
  const service = useVetServiceManagementStore.use.serviceEdit();
  const { setIsOpenEdit, setEditService, updateService } =
    useVetServiceManagementStore.use.actions();
  const form = useForm<VetServiceEditBodyType>({
    resolver: zodResolver(VetServiceEditBodySchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      base_price: String(service?.base_price || "0"),
      duration_minutes: String(service?.duration_minutes || "0"),
      follow_up_interval_days: String(service?.follow_up_interval_days || "0"),
      doses_required: String(service?.doses_required || "0"),
      dose_interval_days: String(service?.dose_interval_days || "0"),
    },
  });
  const { handleSubmit, formState, control } = form;

  async function onSubmit(data: VetServiceEditBodyType) {
    if (!service) {
      toastError("Không tìm thấy dịch vụ để cập nhật.");
      return;
    }

    try {
      const result = await vetApi.adminEditService(service.id, data);
      setEditService(null);
      updateService(result);
      toastSuccess("Cập nhật dịch vụ thành công!");
      setIsOpenEdit(false);
    } catch (error) {
      const err = error as HttpError;
      toastError("Cập nhật dịch vụ thất bại.", { description: err.detail });
      console.error("Failed to update service:", err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 ">
        <form noValidate id={formId} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2  p-6">
            <InputField
              control={control}
              name="name"
              label="Tên dịch vụ"
              id={`${formId}-name`}
            />

            <InputField
              control={control}
              name="base_price"
              label="Giá cơ bản"
              id={`${formId}-base-price`}
              type="number"
            />

            <InputField
              control={control}
              name="duration_minutes"
              label="Thời lượng (phút)"
              id={`${formId}-duration-minutes`}
            />

            <InputField
              control={control}
              name="doses_required"
              label="Số liều cần thiết"
              id={`${formId}-doses-required`}
            />

            <InputField
              control={control}
              name="dose_interval_days"
              label="Khoảng cách giữa các liều (ngày)"
              id={`${formId}-dose-interval-days`}
            />

            <InputField
              control={control}
              name="follow_up_interval_days"
              label="Khoảng thời gian tái khám (ngày)"
              id={`${formId}-follow-up-interval-days`}
            />

            {/*  Notes */}
            <InputFieldTextarea<VetServiceEditBodyType>
              control={control}
              name="description"
              label="Mô tả dịch vụ"
              id={`${formId}-notes`}
              className="text-(--text-secondary)"
            />
          </FieldGroup>
        </form>
      </ScrollArea>
      <LoadingOverlay
        show={formState.isSubmitting}
        message="Đang cập nhật..."
      />
    </>
  );
}

export function ServiceCreateForm({ formId }: { formId: string }) {
  const { addService, setIsOpenCreate } =
    useVetServiceManagementStore.use.actions();

  const form = useForm<VetServiceCreateBodyType>({
    resolver: zodResolver(VetServiceCreateBodySchema),
    defaultValues: {
      name: "",
      description: "",
      base_price: "0",
      duration_minutes: "0",
      follow_up_interval_days: "0",
      doses_required: "0",
      dose_interval_days: "0",
    },
  });
  const { handleSubmit, formState, control, reset } = form;

  async function onSubmit(data: VetServiceCreateBodyType) {
    try {
      const result = await vetApi.adminCreateService(data);
      addService(result);
      setIsOpenCreate(false);
      toastSuccess("Tạo dịch vụ thành công!");
      reset();
    } catch (error) {
      const err = error as HttpError;
      toastError("Tạo dịch vụ thất bại.", { description: err.detail });
      console.error("Failed to create service:", err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 ">
        <form noValidate id={formId} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2  p-6">
            <InputField<VetServiceCreateBodyType>
              control={control}
              name="name"
              label="Tên dịch vụ"
              id={`${formId}-name`}
            />

            <InputField
              control={control}
              name="base_price"
              label="Giá cơ bản"
              type="number"
              id={`${formId}-base-price`}
            />

            <InputField
              control={control}
              name="duration_minutes"
              label="Thời lượng (phút)"
              type="number"
              id={`${formId}-duration-minutes`}
            />

            <InputField
              control={control}
              name="doses_required"
              label="Số liều cần thiết"
              type="number"
              id={`${formId}-doses-required`}
            />

            <InputField
              control={control}
              name="dose_interval_days"
              type="number"
              label="Khoảng cách giữa các liều (ngày)"
              id={`${formId}-dose-interval-days`}
            />

            <InputField
              control={control}
              name="follow_up_interval_days"
              type="number"
              label="Khoảng thời gian tái khám (ngày)"
              id={`${formId}-follow-up-interval-days`}
            />

            <InputFieldTextarea
              control={control}
              name="description"
              label="Mô tả dịch vụ"
              id={`${formId}-notes`}
              className="text-(--text-secondary)"
            />
          </FieldGroup>
        </form>
      </ScrollArea>
      <LoadingOverlay show={formState.isSubmitting} message="Đang tạo..." />
    </>
  );
}
