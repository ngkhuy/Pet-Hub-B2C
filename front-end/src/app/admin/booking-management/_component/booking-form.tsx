"use client";

import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { BookingEditFormType, BookingStatusLabels } from "@/lib/types/booking";
import {
  BookingEditFormSchema,
  BookingStatusSchema,
} from "@/lib/schemas/booking";
import { bookingApi } from "@/lib/api/booking";
import {
  InputFieldTextarea,
  SelectField,
} from "@/components/ui/custom/input-field";
import { useBookingManagementStore } from "@/lib/stores/booking-management-store";

const formId = "form-edit-service";

export function BookingEditForm() {
  const booking = useBookingManagementStore.use.bookingEdit();
  const { setIsOpenEdit, editBooking } =
    useBookingManagementStore.use.actions();
  const form = useForm<BookingEditFormType>({
    resolver: zodResolver(BookingEditFormSchema),
    defaultValues: {
      ...booking,
      notes: booking?.notes || "",
      status: booking?.status || "Pending",
    },
  });
  const { handleSubmit, formState, control } = form;

  async function onSubmit(data: BookingEditFormType) {
    try {
      // check has changed
      if (booking?.notes === data.notes && booking?.status === data.status) {
        toastError("Không có thay đổi nào được thực hiện.");
        return;
      }
      const result = await bookingApi.adminEditBooking(booking?.id, data);
      editBooking(result);
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
        <form noValidate id={formId} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2  p-6">
            <SelectField<BookingEditFormType>
              control={control}
              name="status"
              label="Trạng thái đặt lịch"
              id={`${formId}-status`}
              options={{
                optionLabels: BookingStatusLabels,
                optionValues: BookingStatusSchema.options,
              }}
            />

            {/*  Notes */}
            <InputFieldTextarea<BookingEditFormType>
              control={control}
              name="notes"
              label="Ghi chú"
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
