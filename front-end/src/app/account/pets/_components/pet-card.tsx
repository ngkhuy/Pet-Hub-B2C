"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  MdPets,
  MdCalendarMonth,
  MdInfo,
  MdDelete,
  MdEdit,
  MdArrowForward,
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PetType } from "@/lib/types/user-management";
import { formatDate } from "@/lib/utils/format";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";

interface PetCardProps {
  pet: PetType;
  index?: number;
  onDelete?: (id: string) => void;
}

export function PetCard({ pet, index = 0 }: PetCardProps) {
  const {
    setIsOpenEditDialog,
    setEditPet,
    setIsOpenDeleteDialog,
    setRemovePet,
  } = useOwnPetStore.use.actions();

  const speciesLabel =
    pet.species === "dog" ? "Chó" : pet.species === "cat" ? "Mèo" : "Khác";

  return (
    <motion.article
      key={pet.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex h-full flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* TOP: avatar + name + meta */}
      <div>
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MdPets className="h-5 w-5 aspect-square" />
            </div>

            <div className="space-y-1">
              {/* <h3 className="text-base font-semibold leading-tight text-foreground break-all">
                {pet.name}
              </h3> */}
              <h3 className="break-all line-clamp-1 font-semibold text-foreground">
                {pet.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-[11px] font-medium"
                >
                  {speciesLabel}
                </Badge>

                <span className="inline-flex items-center gap-1">
                  <MdCalendarMonth className="h-4 w-4 text-primary" />
                  <span>{formatDate({ date: pet.birth, type: "date" })}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Breed */}
        <p className="mt-3 text-xs text-muted-foreground">
          Giống:{" "}
          <span className="font-medium text-foreground">
            {pet.breed || "Không xác định"}
          </span>
        </p>

        {/* Note */}
        {pet.note && (
          <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
            <MdInfo className="mt-0.5 h-4 w-4 text-primary" />
            <p className="w-full text-xs text-muted-foreground line-clamp-1 break-all p-0 ">
              {pet.note}
            </p>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex items-center justify-between gap-3">
        {/* Detail – link sang trang chi tiết */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-xs text-muted-foreground hover:text-primary"
        >
          <Link href={`/pets/${pet.id}`}>
            <span className="inline-flex items-center gap-1">
              <MdArrowForward className="h-4 w-4" />
              Xem chi tiết
            </span>
          </Link>
        </Button>

        <div className="flex gap-2">
          {/* Edit dialog */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => {
              setEditPet(pet.id);
              setIsOpenEditDialog(true);
            }}
          >
            <MdEdit className="h-4 w-4" />
            Chỉnh sửa
          </Button>

          {/* Delete confirm Button */}
          <Button
            variant="destructive"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => {
              setRemovePet(pet?.id);
              setIsOpenDeleteDialog(true);
            }}
          >
            <MdDelete className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
