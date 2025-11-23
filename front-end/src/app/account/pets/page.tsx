"use client";

import { Button } from "@/components/ui/button";
import { PetCard } from "@/app/account/pets/_components/pet-card";

type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string;
  birth: string;
  note?: string;
  owner_id: string;
};

// MOCK DATA – replace API later
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Lucky",
    species: "dog",
    breed: "Corgi",
    birth: "2023-01-05",
    note: "Thân thiện, thích chạy nhảy",
    owner_id: "user-1",
  },
  {
    id: "2",
    name: "Milo",
    species: "cat",
    breed: "British Shorthair",
    birth: "2022-06-10",
    note: "Ít nói nhưng rất hiền",
    owner_id: "user-1",
  },
];

export default function PetListPage() {
  return (
    <main className="flex-1 bg-white dark:bg-[#1a202c] p-6 lg:p-8 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-(--text-primary) dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">
          Thú cưng của tôi
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base">
          Quản lý tất cả thú cưng đã đăng ký
        </p>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPets.map((pet, index) => (
          <PetCard
            key={pet.id}
            pet={pet}
            index={index}
            onDetail={(id) => console.log("View", id)}
            onEdit={(id) => console.log("Edit", id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockPets.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">Bạn chưa thêm thú cưng nào.</p>
          <Button className="mt-4 bg-primary text-white">Thêm thú cưng</Button>
        </div>
      )}
    </main>
  );
}
