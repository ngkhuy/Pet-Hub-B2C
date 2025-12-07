"use client";

import { Button } from "@/components/ui/button";
import {
  InputField,
  InputFieldTextarea,
  SelectField,
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
import { userManagementApi } from "@/lib/api/user-management";
import {
  PetAddFormSchema,
  PetSpeciesSchema,
} from "@/lib/schemas/user-management";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";

import { PetAddFormType, PetSpeciesLabels } from "@/lib/types/user-management";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formId = "form-create-pet";

export function PetAddDialog() {
  const isOpen = useOwnPetStore.use.isOpenAddDialog();
  const { setIsOpenAddDialog, addPet } = useOwnPetStore.use.actions();

  const form = useForm<PetAddFormType>({
    resolver: zodResolver(PetAddFormSchema),
    defaultValues: {
      birth: new Date().toISOString().split("T")[0],
      name: "",
      species: "dog",
      note: "",
      breed: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  async function onSubmit(data: PetAddFormType) {
    try {
      const response = await userManagementApi.addMyPet(data);
      addPet(response);
      setIsOpenAddDialog(false);
      form.reset();
      toastSuccess(`Thêm thú cưng ${data.name} thành công!`);
    } catch (error) {
      const err = error as HttpError;
      toastError(`Thêm thú cưng ${data.name} thất bại! Lỗi: ${err.detail}`);
      console.error("Add pet error:", err);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpenAddDialog}>
      <DialogContent className="max-h-[90vh]  p-0 rounded-xl ">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Thêm thú cưng</DialogTitle>
          <DialogDescription>
            Điền thông tin thú cưng của bạn.
          </DialogDescription>
        </DialogHeader>
        {/* form */}
        <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-">
          <form noValidate id={formId} onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-2  p-6">
              {/* Pet Name */}
              <InputField<PetAddFormType>
                control={control}
                name="name"
                type="text"
                label="Tên thú cưng"
                inputProps={{
                  placeholder: "Nhập tên thú cưng",
                  inputMode: "text",
                }}
                id={`${formId}-name`}
                className="text-(--text-secondary)"
              />

              {/* Birth date */}
              <InputField<PetAddFormType>
                control={control}
                name="birth"
                type="date"
                label="Ngày sinh"
                inputProps={{
                  placeholder: "Chọn ngày sinh thú cưng",
                  inputMode: "text",
                }}
                id={`${formId}-birth`}
                className="text-(--text-secondary)"
              />

              {/* Species  */}
              <SelectField
                control={control}
                name="species"
                label="Loài thú cưng"
                id={`${formId}-species-select`}
                options={{
                  optionValues: PetSpeciesSchema.options,
                  optionLabels: PetSpeciesLabels,
                }}
              />

              {/* Breed Type */}
              <InputField<PetAddFormType>
                control={control}
                name="breed"
                type="text"
                label="Giống thú cưng"
                inputProps={{
                  placeholder: "Nhập giống thú cưng(nếu có)",
                  inputMode: "text",
                }}
                id={`${formId}-breed`}
              />

              {/* Note */}
              <InputFieldTextarea<PetAddFormType>
                control={control}
                name="note"
                label="Ghi chú"
                inputTextareaProps={{
                  placeholder: "Nhập ghi chú cho thú cưng (nếu có)",
                  className: "min-h-24 resize-none",
                }}
                id={`${formId}-note-textarea`}
              />
            </FieldGroup>
          </form>
        </ScrollArea>
        <LoadingOverlay show={formState.isSubmitting} message="Đang tạo..." />
        {/* Submit actions */}
        <DialogFooter className="p-4 border-t">
          <div className="flex-1">
            <Button variant="link" onClick={() => form.reset()}>
              Xóa
            </Button>
          </div>

          <Button variant="outline" onClick={() => setIsOpenAddDialog(false)}>
            Hủy
          </Button>
          <Button type="submit" form={formId}>
            Thêm thú cưng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
