"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Service, serviceTypeLabels } from "@/lib/schemas/service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { petTypeLabels } from "@/lib/schemas/pet";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";

interface EditServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const editServiceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống"),
  service_type: z.enum(["Spa", "Hotel"]),
  pet_type: z.enum(["Dog", "Cat", "All"]),
  price_per_hour: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Giá mỗi giờ phải là một số lớn hơn 0" }
  ),
  duration_hours: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Thời lượng phải là một số lớn hơn 0" }
  ),
});
type EditService = z.infer<typeof editServiceSchema>;

export function EditServiceDialog({
  service,
  open,
  onOpenChange,
}: EditServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditService>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      name: service.name,
      service_type: service.service_type,
      pet_type: service.pet_type,
      price_per_hour: String(service.price_per_hour),
      duration_hours: String(service.duration_hours ?? 0),
    },
  });

  async function onSubmit(values: EditService) {
    setIsSubmitting(true);
    const parseValues = {
      ...values,
      price_per_hour: Number(values.price_per_hour),
      duration_hours: Number(values.duration_hours),
    };

    try {
      const isChanged = Object.keys(parseValues).some(
        (key) =>
          parseValues[key as keyof EditService] !==
          service[key as keyof Service]
      );

      if (!isChanged) {
        toast.error("Không có thay đổi nào để lưu.", {
          icon: (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-600" />
            </span>
          ),
          className:
            "border border-red-300 bg-red-50 text-red-700 shadow-md rounded-lg",
          duration: 2500,
          position: "top-center",
        });
        return;
      }

      await new Promise((res) => setTimeout(res, 3000));

      toast.success("Cập nhật thành công!", {
        description: (
          <span className="text-black">
            Dịch vụ <b>{values.name}</b> đã được cập nhật.
          </span>
        ),
        icon: (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </span>
        ),
        className:
          "border border-green-300 bg-green-50 text-green-800 shadow-lg rounded-lg",
        position: "top-center",
      });

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Cập nhật dịch vụ
          </DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin và lưu lại thay đổi.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-update-service"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="relative space-y-6 py-4 px-1">
            {/* LOADING OVERLAY */}
            <LoadingOverlay show={isSubmitting} message="Đang lưu..." />

            {/* ID */}
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                ID dịch vụ
              </span>
              <Badge
                variant="outline"
                className="border-primary/60 py-1 px-2 text-sm break-all"
              >
                {service.id}
              </Badge>
            </div>

            {/* Name */}
            <Field className="space-y-1">
              <Label>Tên dịch vụ</Label>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Nhập tên dịch vụ"
                      className="h-10"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />
            </Field>

            {/* GRID ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service type */}
              <Field className="space-y-1">
                <Label>Loại dịch vụ</Label>
                <Controller
                  name="service_type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(serviceTypeLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </>
                  )}
                />
              </Field>

              {/* Pet type */}
              <Field className="space-y-1">
                <Label>Loại thú cưng</Label>
                <Controller
                  name="pet_type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(petTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </>
                  )}
                />
              </Field>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1">
                <Label>Giá mỗi giờ</Label>
                <Controller
                  name="price_per_hour"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        type="text"
                        min={1}
                        placeholder="Giá theo giờ"
                        className="h-10"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </>
                  )}
                />
              </Field>

              <Field className="space-y-1">
                <Label>Thời lượng (giờ)</Label>
                <Controller
                  name="duration_hours"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        type="text"
                        min={0}
                        placeholder="Thời lượng dịch vụ"
                        className="h-10"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </>
                  )}
                />
              </Field>
            </div>
          </div>
        </form>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button form="form-update-service" disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
