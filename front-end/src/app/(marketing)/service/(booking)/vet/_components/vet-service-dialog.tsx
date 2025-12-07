"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { FieldGroup } from "@/components/ui/field";
import {
  InputField,
  InputFieldTextarea,
  SelectField,
} from "@/components/ui/custom/input-field";
import { getPetById, useOwnPetStore } from "@/lib/stores/own-pet-store";
import { useEffect, useMemo } from "react";
import { PetSpeciesLabels } from "@/lib/types/user-management";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatDateForInput } from "@/lib/utils/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VetBookingCreateBodyType } from "@/lib/types/vet";
import { useVetServiceStore } from "@/lib/stores/vet-service-store";
import { VetBookingCreateBodySchema } from "@/lib/schemas/vet";
import { vetApi } from "@/lib/api/vet";
import z from "zod";
import { HttpError } from "@/lib/api/client";

const formId = "form-single-booking";

export function BookingConfirmDialogContent({
  pet_id,
  start_time,
  end_time,
  service_ids,
  symptoms,
  notes,
}: Omit<VetBookingCreateBodyType, "user_id">) {
  const pet = getPetById(pet_id);

  const services = useVetServiceStore.use.services();
  const selectedServices = services.filter((s) => service_ids.includes(s.id));

  const start = start_time ? new Date(start_time) : null;
  const end = end_time ? new Date(end_time) : null;
  const durationMinutes =
    start && end
      ? Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      : 0;

  const totalPrice = selectedServices.reduce((sum, s) => {
    const hours =
      s.duration_minutes && s.duration_minutes > 0
        ? s.duration_minutes / 60
        : durationMinutes / 60;
    return sum + s.base_price * hours;
  }, 0);

  return (
    <div className="space-y-4 text-left">
      <p className="text-sm text-muted-foreground">
        Vui lòng kiểm tra lại thông tin đặt lịch trước khi xác nhận.
      </p>

      <div className="overflow-hidden rounded-2xl border bg-background/60 shadow-sm">
        {/* Header bill */}
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Tóm tắt lịch khám thú y</h3>
          <p className="text-xs text-muted-foreground">
            Kiểm tra lại thú cưng, thời gian và dịch vụ trước khi xác nhận.
          </p>
        </div>

        <div className="space-y-4 px-4 py-4">
          {/* Thông tin chung */}
          <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Thú cưng
              </dt>
              <dd className="text-sm font-medium">
                {pet?.name ?? "Không tìm thấy thú cưng"}
              </dd>
              {pet && (
                <dd className="text-[11px] text-muted-foreground">
                  {pet.breed ?? pet.species}
                </dd>
              )}
            </div>

            <div className="space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Khung thời gian
              </dt>
              <dd className="text-sm font-medium">
                {formatDate({ date: start_time, isVietNamTime: false })} →{" "}
                {formatDate({ date: end_time, isVietNamTime: false })}
              </dd>
              <dd className="text-[11px] text-muted-foreground">
                Khoảng {durationMinutes} phút
              </dd>
            </div>
          </dl>

          {/* Dịch vụ đã chọn */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Dịch vụ đã chọn ({selectedServices.length})
            </p>

            <div className="divide-y rounded-xl border bg-muted/20">
              {selectedServices.map((s) => {
                const linePrice =
                  s.duration_minutes && s.duration_minutes > 0
                    ? (s.base_price * s.duration_minutes) / 60
                    : undefined;

                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-medium line-clamp-1">{s.name}</p>
                      {s.duration_minutes && (
                        <p className="text-[11px] text-muted-foreground">
                          Thời lượng gợi ý: {s.duration_minutes} phút
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold">
                        {s.base_price.toLocaleString("vi-VN")}₫ / giờ
                      </p>
                      {linePrice && (
                        <p className="text-[11px] text-muted-foreground">
                          Ước tính:{" "}
                          {Math.round(linePrice).toLocaleString("vi-VN")}₫
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Triệu chứng */}
          {symptoms.trim() && (
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Triệu chứng
              </p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {symptoms}
              </p>
            </div>
          )}

          {/* Ghi chú */}
          {notes && notes.trim() && (
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Ghi chú cho bác sĩ
              </p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          )}
        </div>

        {/* Tổng tiền ước tính */}
        {selectedServices.length > 0 && totalPrice > 0 && (
          <div className="border-t bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Tổng ước tính
              </p>
              <p className="text-lg font-bold text-primary">
                {Math.round(totalPrice).toLocaleString("vi-VN")}₫
              </p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Chi phí thực tế có thể thay đổi tùy vào tình trạng thú cưng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const BookingFormSchema = VetBookingCreateBodySchema.omit({
  user_id: true,
  service_ids: true,
});
type BookingFormType = z.infer<typeof BookingFormSchema>;

export function SingleVetBookingDialog() {
  const bookingService = useVetServiceStore.use.bookingService();
  const user = useAuthStore.use.user();
  const ownPets = useOwnPetStore.use.ownPets();
  const isOpen = useVetServiceStore.use.isOpenBooking();
  const {
    setIsOpenBookingDialog,
    setIsOpenConfirmDialog,
    setBookingConfirmDialog,
  } = useVetServiceStore.use.actions();

  const form = useForm<BookingFormType>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      pet_id: "",
      start_time: formatDateForInput(),
      notes: "",
      end_time: undefined,
      symptoms: "",
    },
  });
  const { handleSubmit, control } = form;

  const petOptions = useMemo(() => {
    return ownPets.map((pet) => ({
      optionLabel: `${pet.name} - ${PetSpeciesLabels[pet.species]}`,
      optionValue: pet.id,
    }));
  }, [ownPets]);

  function handleClickConfirm() {
    form.trigger().then((isValid) => {
      console.log("Form is valid:", isValid);
      if (isValid) {
        setBookingConfirmDialog({
          formId: formId,
          content: (
            <BookingConfirmDialogContent
              pet_id={form.getValues("pet_id")}
              start_time={form.getValues("start_time")}
              end_time={form.getValues("end_time")}
              symptoms={form.getValues("symptoms")}
              notes={form.getValues("notes")}
              service_ids={[bookingService!.id]}
            />
          ),
        });
        setIsOpenConfirmDialog(true);
      }
    });
  }

  async function onSubmit(data: BookingFormType) {
    try {
      await vetApi.createBooking({
        ...data,
        user_id: user!.id,
        service_ids: [bookingService!.id],
      });
      setIsOpenBookingDialog(false);
      toastSuccess("Đặt dịch vụ thành công!");
    } catch (error) {
      const err = error as HttpError;
      toastError("Đặt dịch vụ thất bại.", { description: err.detail });
      console.error(error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenBookingDialog}>
      <DialogContent className="max-h-[80vh] w-full p-10 rounded-xl ">
        <DialogHeader className="px-6 py-4 border-b  flex justify-start p-0">
          <DialogTitle>Đăt dịch vụ</DialogTitle>
          <DialogDescription>
            Điền thông tin bên dưới và xác nhận.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <ScrollArea className="max-h-[45vh] mx-auto ">
          <form
            className="min-w-[400px]  px-5 py-2"
            onSubmit={handleSubmit(onSubmit)}
            id={formId}
            noValidate
          >
            <FieldGroup className="">
              <InputField
                control={control}
                name="start_time"
                id={`${formId}-start-time`}
                label="Thời gian bắt đầu"
                type="datetime-local"
              />

              <InputField
                control={control}
                name="end_time"
                id={`${formId}-end-time`}
                label="Thời gian kết thúc"
                type="datetime-local"
              />

              <SelectField
                control={control}
                name="pet_id"
                id={`${formId}-pet-id`}
                label="Chọn thú cưng"
                options={petOptions}
              />

              <InputFieldTextarea
                control={control}
                name="symptoms"
                id={`${formId}-symptoms`}
                label="Triệu chứng(ghi rõ)"
              />

              <InputFieldTextarea
                control={control}
                name="notes"
                id={`${formId}-notes`}
                label="Ghi chú (tùy chọn)"
              />
            </FieldGroup>
          </form>
        </ScrollArea>
        {/* Submit actions */}
        <DialogFooter className="border-t justify-between pt-2">
          <div className="flex-1  ">
            <Button variant="link" onClick={() => form.reset()}>
              Xóa
            </Button>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleClickConfirm}>Đặt dịch vụ</Button>
          </div>
        </DialogFooter>
        <LoadingOverlay
          show={form.formState.isSubmitting}
          message="Đang tạo..."
        />
      </DialogContent>
    </Dialog>
  );
}

export function BookingVetConfirmDialog() {
  const isOpenAlert = useVetServiceStore.use.isOpenConfirmDialog();
  const content = useVetServiceStore.use.bookingConfirmDialog();
  const { setIsOpenConfirmDialog } = useVetServiceStore.use.actions();

  return (
    <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenConfirmDialog}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận đặt dịch vụ</AlertDialogTitle>
          {content && (
            <AlertDialogDescription asChild>
              {content.content}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          {content && (
            <AlertDialogAction type="submit" form={content?.formId}>
              Xác nhận
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
