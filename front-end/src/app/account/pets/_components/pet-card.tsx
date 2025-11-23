"use client";

import { motion } from "motion/react";
import { MdPets, MdCalendarMonth, MdInfo } from "react-icons/md";
import { Button } from "@/components/ui/button";

export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string;
  birth: string;
  note?: string;
  owner_id: string;
};

interface PetCardProps {
  pet: Pet;
  index?: number;
  onDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function PetCard({ pet, index = 0, onDetail, onEdit }: PetCardProps) {
  return (
    <motion.div
      key={pet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl p-5 bg-white dark:bg-[#101922] border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition-all"
    >
      {/* Name */}
      <div className="flex items-center gap-2 mb-2">
        <MdPets className="text-primary text-2xl" />
        <p className="text-xl font-bold text-(--text-primary)">{pet.name}</p>
      </div>

      {/* Species + Breed */}
      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loài:{" "}
          <span className="font-semibold text-(--text-primary)">
            {pet.species === "dog"
              ? "Chó"
              : pet.species === "cat"
              ? "Mèo"
              : "Khác"}
          </span>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Giống:{" "}
          <span className="font-semibold text-(--text-primary)">
            {pet.breed}
          </span>
        </p>
      </div>

      {/* Birth Date */}
      <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <MdCalendarMonth className="text-primary" />
        Ngày sinh:{" "}
        <span className="font-semibold text-(--text-primary)">
          {new Date(pet.birth).toLocaleDateString("vi-VN")}
        </span>
      </p>

      {/* Note */}
      {pet.note && (
        <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <MdInfo className="text-primary" />
          <span>{pet.note}</span>
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
          onClick={() => onDetail?.(pet.id)}
        >
          Chi tiết
        </Button>

        <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => onEdit?.(pet.id)}
        >
          Chỉnh sửa
        </Button>
      </div>
    </motion.div>
  );
}
