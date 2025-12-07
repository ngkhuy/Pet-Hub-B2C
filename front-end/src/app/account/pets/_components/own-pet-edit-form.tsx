"use client";

import { Button } from "@/components/ui/button";
import {
  InputField,
  InputFieldTextarea,
  SelectField,
} from "@/components/ui/custom/input-field";
import { LoadingOverlay } from "@/components/ui/custom/loading-overlay";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import {
  PetEditFormSchema,
  PetSpeciesSchema,
} from "@/lib/schemas/user-management";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";
import { PetEditFormType, PetSpeciesLabels } from "@/lib/types/user-management";
import { formatDate, formatDateForInput } from "@/lib/utils/format";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

const formId = "form-edit-pet";

export default function OwnPetEditForm() {
  const petEdit = useOwnPetStore.use.editPet();
  const { setIsOpenEditDialog, editPet } = useOwnPetStore.use.actions();

  const form = useForm<PetEditFormType>({
    resolver: zodResolver(PetEditFormSchema),
    defaultValues: {
      birth: petEdit ? petEdit.birth.toISOString().split("T")[0] : undefined,
      breed: petEdit?.breed ?? "",
      name: petEdit?.name ?? "",
      note: petEdit?.note ?? "",
      species: petEdit?.species,
    },
  });
  const { handleSubmit, formState, control } = form;

  useEffect(() => {
    if (petEdit) {
      form.reset();
    }
  }, [petEdit]);

  async function onSubmit(data: PetEditFormType) {
    try {
      // check has changed
      if (!petEdit) return;

      if (
        petEdit.name === data.name &&
        petEdit.species === data.species &&
        petEdit?.breed === data.breed &&
        formatDate({ date: petEdit.birth, type: "date" }) ===
          formatDate({ date: new Date(data.birth), type: "date" }) &&
        petEdit?.note === data.note
      ) {
        toastError("Không có thay đổi nào được thực hiện.");
        return;
      }
      const result = await userManagementApi.editMyPet(petEdit?.id ?? "", data);
      toastSuccess(`Cập nhật thông tin ${data.name} thành công!`);
      editPet(result);
      setIsOpenEditDialog(false);
    } catch (error) {
      const err = error as HttpError;
      toastError(`Cập nhật thông tin ${data.name}không thành công.`, {
        description: err.detail,
      });
      console.error(err);
    }
  }

  return (
    <>
      <ScrollArea className="max-h-[45vh] sm:max-w-[500px] px-10 py-">
        <form noValidate id={formId} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2  p-6">
            {/* Service Name */}
            <InputField<PetEditFormType>
              control={control}
              name="name"
              type="text"
              label="Tên thú cưng"
              inputProps={{
                placeholder: "Nhập tên dịch vụ",
                inputMode: "text",
              }}
              id={`${formId}-name`}
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

            {/* Pet Breed */}
            <InputField<PetEditFormType>
              control={control}
              name="breed"
              type="text"
              label="Giống"
              inputProps={{
                placeholder: "Nhập giống thú cưng",
                inputMode: "text",
              }}
              id={`${formId}-breed`}
              className="text-(--text-secondary)"
            />
            {/* Pet Birth */}
            <InputField<PetEditFormType>
              control={control}
              name="birth"
              type="date"
              label="Ngày sinh"
              inputProps={{
                placeholder: "Chọn ngày sinh",
                inputMode: "text",
              }}
              id={`${formId}-birth`}
              className="text-(--text-secondary)"
            />
            {/* Pet Note */}
            <InputFieldTextarea<PetEditFormType>
              control={control}
              name="note"
              label="Ghi chú"
              id={`${formId}-note`}
              description="Thêm ghi chú về thú cưng (tối đa 100 ký tự)."
              inputTextareaProps={{
                placeholder: "Nhập ghi chú về thú cưng",
                maxLength: 100,
              }}
              className="text-(--text-secondary)"
            />
          </FieldGroup>
        </form>
      </ScrollArea>
      <div className="p-4 border-t flex justify-between px-12">
        <div>
          <Button variant="link" onClick={() => form.reset()}>
            Đặt lại
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={() => setIsOpenEditDialog(false)}>
            Hủy
          </Button>

          <Button type="submit" form={formId} className="ml-4">
            Lưu thay đổi
          </Button>
        </div>
      </div>
      <LoadingOverlay
        show={formState.isSubmitting}
        message="Đang cập nhật..."
      />
    </>
  );
}
