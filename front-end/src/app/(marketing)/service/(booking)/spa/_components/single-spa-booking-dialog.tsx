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
import { SingleSpaBookingFormSchema } from "@/lib/schemas/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth-store";
import { bookingApi } from "@/lib/api/booking";
import { SingleSpaBookingFormType, SpaBookingCartItemType } from "@/lib/types/booking";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { FieldGroup } from "@/components/ui/field";
import { InputField, InputFieldTextarea, SelectField } from "@/components/ui/custom/input-field";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";
import { useEffect, useMemo } from "react";
import { PetSpeciesLabels } from "@/lib/types/user-management";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { useBookingCartStore } from "@/lib/stores/booking-cart-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatDateForBackend, formatDateForInput } from "@/lib/utils/format";
import { useSpaServiceStore } from "@/lib/stores/spa-service-store";

const formId = "form-single-booking";

function BookingConfirmDialogContent({ pet, service, start_time, notes }: SpaBookingCartItemType) {
	const totalPrice =
		service.duration_hours && service.duration_hours > 0
			? service.price_per_hour * service.duration_hours
			: null;

	return (
		<div className="space-y-4 text-left">
			<p className="text-sm text-muted-foreground">
				Vui lòng kiểm tra lại thông tin đặt lịch trước khi xác nhận.
			</p>

			<div className="rounded-2xl border bg-background/60 shadow-sm overflow-hidden">
				{/* Header dịch vụ */}
				<div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
					<div>
						<p className="text-sm font-semibold">{service.name}</p>
						<p className="text-xs text-muted-foreground">
							{service.service_type} • {service.pet_type}
						</p>
					</div>
					<span className="text-sm font-semibold text-primary">
						{service.price_per_hour.toLocaleString("vi-VN")}₫ / giờ
					</span>
				</div>

				{/* Grid thông tin chi tiết */}
				<dl className="grid grid-cols-1 gap-3 px-4 py-3 text-xs sm:grid-cols-2">
					<div className="space-y-1">
						<dt className="label-title">Thú cưng</dt>
						<dd className="value">{pet.name}</dd>
						<dd className="sub-value">{pet.breed ?? pet.species}</dd>
					</div>

					<div className="space-y-1">
						<dt className="label-title">Thời gian bắt đầu</dt>
						<dd className="value">{formatDate({ date: start_time })}</dd>
					</div>

					<div className="space-y-1">
						<dt className="label-title">Thời lượng dự kiến</dt>
						<dd className="value">
							{service.duration_hours
								? `${service.duration_hours} giờ`
								: "Theo đánh giá của bác sĩ"}
						</dd>
					</div>
				</dl>

				{/* Ghi chú */}
				{notes?.trim() && (
					<div className="border-t px-4 py-3">
						<p className="label-title mb-1">Ghi chú cho bác sĩ</p>
						<p className="text-xs text-muted-foreground line-clamp-3">{notes}</p>
					</div>
				)}

				{/* Tổng thanh toán */}
				{totalPrice && (
					<div className="border-t bg-muted/30 px-4 py-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-muted-foreground">
								Tổng thanh toán
							</p>
							<p className="text-lg font-bold text-primary">
								{totalPrice.toLocaleString("vi-VN")}₫
							</p>
						</div>

						<p className="text-[11px] text-muted-foreground mt-1">
							{service.duration_hours} giờ ×{" "}
							{service.price_per_hour.toLocaleString("vi-VN")}₫
						</p>
					</div>
				)}
			</div>

			{/* Tailwind helpers */}
			<style jsx>{`
				.label-title {
					@apply text-[11px] font-medium uppercase tracking-wide text-muted-foreground;
				}
				.value {
					@apply text-sm font-medium;
				}
				.sub-value {
					@apply text-[11px] text-muted-foreground;
				}
			`}</style>
		</div>
	);
}

export function SingleSpaBookingDialog() {
	const bookingService = useSpaServiceStore.use.bookingService();
	const user = useAuthStore.use.user();
	const ownPets = useOwnPetStore.use.ownPets();
	const isOpen = useSpaServiceStore.use.isOpenBooking();
	const { setIsOpenBookingDialog, setIsOpenConfirmDialog, setBookingConfirmDialog } =
		useSpaServiceStore.use.actions();
	const { addSpaToCart } = useBookingCartStore.use.actions();
	const form = useForm<SingleSpaBookingFormType>({
		resolver: zodResolver(SingleSpaBookingFormSchema),
		defaultValues: {
			notes: "",
			pet_id: "",
			start_time: formatDateForInput(),
		},
	});
	const { handleSubmit, control } = form;

	const bookingId = useMemo(() => crypto.randomUUID(), [bookingService]);

	const petOptions = useMemo(() => {
		return ownPets.map((pet) => ({
			optionLabel: `${pet.name} - ${PetSpeciesLabels[pet.species]}`,
			optionValue: pet.id,
		}));
	}, [ownPets]);

	function handleClickConfirm() {
		form.trigger().then((isValid) => {
			if (isValid) {
				const petId = form.getValues("pet_id");
				const pet = ownPets.find((p) => p.id === petId);

				setBookingConfirmDialog({
					formId: formId,
					content: (
						<BookingConfirmDialogContent
							id={bookingId}
							pet={pet!}
							service={bookingService!}
							start_time={form.getValues("start_time")}
							notes={form.getValues("notes")}
						/>
					),
				});
				setIsOpenConfirmDialog(true);
			}
		});
	}

	function handleAddToCart() {
		form.trigger().then((isValid) => {
			if (isValid) {
				addSpaToCart({
					start_time: formatDateForBackend(form.getValues("start_time")),
					notes: form.getValues("notes"),
					service: bookingService!,
					pet: ownPets.find((pet) => pet.id === form.getValues("pet_id"))!,
					id: bookingId,
				});
				form.reset();
				toastSuccess("Đã thêm dịch vụ vào danh sách!", {
					position: "top-center",
				});
			}
		});
	}

	async function onSubmit(data: SingleSpaBookingFormType) {
		try {
			// Convert start_time to UTC
			const submitData = {
				...data,
				start_time: formatDateForBackend(data.start_time),
			};

			await bookingApi.createSpaSingleBooking(user!.id, bookingService!.id, submitData);

			setIsOpenBookingDialog(false);
			toastSuccess("Đặt dịch vụ thành công!");
		} catch (error) {
			toastError("Đặt dịch vụ thất bại, vui lòng thử lại sau.");
			console.error(error);
		}
	}

	useEffect(() => {
		if (isOpen) {
			form.reset({
				notes: "",
				pet_id: "",
				start_time: formatDateForInput(),
			});
		}
	}, [isOpen, form]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpenBookingDialog}>
			<DialogContent className="max-h-[90vh] w-fit p-10 rounded-xl ">
				<DialogHeader className="px-6 py-4 border-b  flex justify-start p-0">
					<DialogTitle>Đăt dịch vụ</DialogTitle>
					<DialogDescription>Điền thông tin bên dưới và xác nhận.</DialogDescription>
				</DialogHeader>
				{/* form */}
				<ScrollArea className=" ">
					<form
						className="min-w-[400px]  px-5 py-2"
						onSubmit={handleSubmit(onSubmit)}
						id={formId}
						noValidate
					>
						<FieldGroup>
							<InputField
								control={control}
								name="start_time"
								id={`${formId}-start-time`}
								label="Thời gian bắt đầu"
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
						<Button
							variant="outline"
							onClick={() => {
								handleAddToCart();
							}}
						>
							Thêm vào danh sách
						</Button>
						<Button onClick={handleClickConfirm}>Đặt dịch vụ</Button>
					</div>
				</DialogFooter>
				<LoadingOverlay show={form.formState.isSubmitting} message="Đang tạo..." />
			</DialogContent>
		</Dialog>
	);
}
