"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputField,
  InputFieldTextarea,
} from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HttpError } from "@/lib/api/client";
import { vetApi } from "@/lib/api/vet";
import { VetBookingEditBodySchema } from "@/lib/schemas/vet";
import { getPetById } from "@/lib/stores/own-pet-store";
import { useVetBookingHistoryStore } from "@/lib/stores/vet-booking-history-store";
import { VetBookingEditBodyType } from "@/lib/types/vet";
import { formatDateForInput } from "@/lib/utils/format";
import { toastError, toastLoading, toastSuccess } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formEditId = "form-edit-vet-booking";

export function VetBookingEditDialog() {
  const bookingEdit = useVetBookingHistoryStore.use.bookingEdit();
  const open = useVetBookingHistoryStore.use.isOpenEditDialog();
  const { setIsOpenEditDialog, updateBookingInStore } =
    useVetBookingHistoryStore.use.actions();
  const form = useForm<VetBookingEditBodyType>({
    resolver: zodResolver(VetBookingEditBodySchema),
    defaultValues: {
      notes: bookingEdit?.notes || "",
      end_time: bookingEdit
        ? formatDateForInput(bookingEdit.end_time)
        : undefined,
      start_time: bookingEdit
        ? formatDateForInput(bookingEdit.start_time)
        : undefined,
      symptoms: bookingEdit?.symptoms || "",
    },
  });

  const { handleSubmit, control, formState } = form;

  function onSubmit(data: VetBookingEditBodyType) {
    if (!bookingEdit) return;

    vetApi
      .editBooking(bookingEdit.id, data)
      .then((d) => {
        updateBookingInStore(d);
        setIsOpenEditDialog(false);
        toastSuccess("Cập nhật ghi chú booking thành công");
      })
      .catch((error) => {
        const err = error as HttpError;
        toastError("Không thể cập nhật ghi chú booking", {
          description: err.detail,
        });
        console.error("Lỗi khi cập nhật ghi chú booking:", error);
      });
  }

  useEffect(() => {
    if (bookingEdit) {
      form.reset({
        notes: bookingEdit?.notes || "",
        end_time: formatDateForInput(bookingEdit.end_time),
        start_time: formatDateForInput(bookingEdit.start_time),
        symptoms: bookingEdit?.symptoms || "",
      });
    }
  }, [bookingEdit, form]);

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={setIsOpenEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khám</DialogTitle>
            <DialogDescription>
              Thay đổi thông tin về thời gian, triệu chứng và ghi chú
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10">
            <form
              className="min-w-[400px]  px-5 py-2"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              id={formEditId}
            >
              <FieldGroup>
                <InputField
                  control={control}
                  name="start_time"
                  id={`${formEditId}-start-time`}
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                />

                <InputField
                  control={control}
                  name="end_time"
                  id={`${formEditId}-end-time`}
                  label="Thời gian kết thúc"
                  type="datetime-local"
                />

                <InputFieldTextarea
                  control={control}
                  name="symptoms"
                  id={`${formEditId}-symptoms`}
                  label="Triệu chứng(ghi rõ)"
                />

                <InputFieldTextarea
                  control={control}
                  name="notes"
                  id={`${formEditId}-notes`}
                  label="Ghi chú (tùy chọn)"
                />
              </FieldGroup>
            </form>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpenEditDialog(false)}
            >
              Hủy
            </Button>
            <Button form={formEditId}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LoadingOverlay
        show={formState.isSubmitting}
        message="Đang cập nhật..."
      />
    </div>
  );
}

export function VetBookingCancelAlert() {
  const bookingCancel = useVetBookingHistoryStore.use.bookingCancel();
  console.log("Booking to cancel:", bookingCancel?.id);
  const open = useVetBookingHistoryStore.use.isOpenCancelDialog();
  const { setIsOpenCancelDialog, updateBookingInStore, setBookingCancel } =
    useVetBookingHistoryStore.use.actions();

  const pet = useMemo(() => {
    if (!bookingCancel) return null;
    return getPetById(bookingCancel.pet_id);
  }, [bookingCancel]);

  async function onConfirm() {
    if (!bookingCancel) {
      toastError("Không tìm thấy booking để huỷ");
      return;
    }
    setIsOpenCancelDialog(false);
    const toastId = toastLoading("Đang huỷ booking...");
    try {
      const response = await vetApi.cancelBooking(bookingCancel.id);
      updateBookingInStore(response);
      setBookingCancel(null);
      toast.dismiss(toastId);
      toastSuccess("Huỷ booking thành công");
    } catch (error) {
      const err = error as HttpError;
      toast.dismiss(toastId);
      toastError("Không thể huỷ booking", {
        description: err.detail,
      });
      console.error("Lỗi khi huỷ booking:", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setIsOpenCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Huỷ booking này?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn chắc chắn muốn huỷ booking cho{" "}
            <span className="font-medium">{pet?.name}</span> dịch vụ{" "}
            <span className="font-medium">
              {bookingCancel?.services.map((v) => v.name).join(", ")}
            </span>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <Button variant={"destructive"} onClick={onConfirm}>
            Xác nhận huỷ
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
