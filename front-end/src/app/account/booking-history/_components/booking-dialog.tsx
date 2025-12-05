"use client";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { bookingApi } from "@/lib/api/booking";
import { HttpError } from "@/lib/api/client";
import {
  getBookingById,
  useBookingHistoryStore,
} from "@/lib/stores/booking-history-store";
import { getPetById } from "@/lib/stores/own-pet-store";
import { formatDate } from "@/lib/utils/format";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useMemo, useState } from "react";

export function BookingDetailDialog() {
  const bookingInfoId = useBookingHistoryStore.use.bookingInfoId();
  const IsOpen = useBookingHistoryStore.use.isOpenInfoDialog();
  const { setIsOpenInfoDialog } = useBookingHistoryStore.use.actions();
  const booking = useMemo(() => {
    return bookingInfoId ? getBookingById(bookingInfoId) : null;
  }, [bookingInfoId]);
  const pet = useMemo(() => {
    return booking ? getPetById(booking.pet_id) : null;
  }, [booking]);

  return (
    <Dialog open={IsOpen} onOpenChange={setIsOpenInfoDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết booking</DialogTitle>
          <DialogDescription>
            Thông tin đầy đủ của booking và thú cưng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Thú cưng
            </p>
            <p className="font-medium">{pet?.name}</p>
            <p className="text-xs text-muted-foreground">
              {pet?.breed}-{pet?.species}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Thời gian
            </p>
            <p>Bắt đầu: {formatDate({ date: booking?.start_time })}</p>
            <p>Kết thúc: {formatDate({ date: booking?.end_time })}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Dịch vụ trong booking
            </p>
            <ul className="space-y-1 text-xs">
              {booking?.services.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-2 py-1"
                >
                  <span>
                    {s.name} • {s.service_type}
                  </span>
                  <span className="font-medium">
                    {s.price_per_hour.toLocaleString("vi-VN")}₫/giờ
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {booking?.notes?.trim() && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Ghi chú
              </p>
              <p className="text-xs">{booking.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpenInfoDialog(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookingNotesDialog() {
  const bookingEditId = useBookingHistoryStore.use.bookingEditId();
  const open = useBookingHistoryStore.use.isOpenEditDialog();
  const { setIsOpenEditDialog, updateBookingInStore } =
    useBookingHistoryStore.use.actions();

  const booking = useMemo(() => {
    return bookingEditId ? getBookingById(bookingEditId) : null;
  }, [bookingEditId]);

  const [notes, setNotes] = useState(booking?.notes || "");

  function onSave() {
    if (!booking) return;

    bookingApi
      .updateBooking(booking.id, { notes })
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

  return (
    <Dialog open={open} onOpenChange={setIsOpenEditDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ghi chú</DialogTitle>
          <DialogDescription>
            Chỉ có thể chỉnh sửa trường{" "}
            <span className="font-semibold">ghi chú</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Ghi chú
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Nhập ghi chú cho bác sĩ / nhân viên..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpenEditDialog(false)}>
            Hủy
          </Button>
          <Button onClick={onSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookingCancelAlert() {
  const bookingCancelId = useBookingHistoryStore.use.bookingCancelId();
  const open = useBookingHistoryStore.use.isOpenCancelDialog();
  const { setIsOpenCancelDialog, removeBookingFromStore } =
    useBookingHistoryStore.use.actions();

  const booking = useMemo(() => {
    return bookingCancelId ? getBookingById(bookingCancelId) : null;
  }, [bookingCancelId]);

  const pet = useMemo(() => {
    return booking ? getPetById(booking.pet_id) : null;
  }, [booking]);

  function onConfirm() {
    if (!booking) return;
    bookingApi
      .cancelBooking(booking.id)
      .then(() => {
        removeBookingFromStore(booking.id);
        setIsOpenCancelDialog(false);
        toastSuccess("Huỷ booking thành công");
      })
      .catch((error) => {
        const err = error as HttpError;
        toastError("Không thể huỷ booking", {
          description: err.detail,
        });
        console.error("Lỗi khi huỷ booking:", error);
      });
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
              {booking?.services.map((v) => v.name).join(", ")}
            </span>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Xác nhận huỷ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
