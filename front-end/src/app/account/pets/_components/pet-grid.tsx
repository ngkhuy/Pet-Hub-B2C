"use client";

import { PetCard } from "@/app/account/pets/_components/pet-card";
import { PetCardSkeleton } from "@/app/account/pets/_components/pet-card-skeleton";
import { Button } from "@/components/ui/button";
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import { useOwnPetStore } from "@/lib/stores/own-pet-store";
import { toastError } from "@/lib/utils/toast";
import { useCallback, useEffect, useState } from "react";

function PetSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <PetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function PetGrip() {
  const myPets = useOwnPetStore.use.ownPets();
  const { setOwnPets, setIsOpenAddDialog } = useOwnPetStore.use.actions();
  const [isFetching, setIsFetching] = useState(false);

  const fetchPets = useCallback(
    async function fetchPets() {
      try {
        setIsFetching(true);
        const result = await userManagementApi.getOwnPets({
          skip: 0,
          limit: 20,
        });
        setOwnPets(result);
      } catch (error) {
        const err = error as HttpError;
        toastError("Lấy danh sách thú cưng thất bại", {
          position: "top-right",
          description: err.detail,
        });
      } finally {
        setIsFetching(false);
      }
    },
    [setOwnPets]
  );

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <div>
      <div>
        <Button
          onClick={() => setIsOpenAddDialog(true)}
          className="mb-6 bg-primary text-white"
        >
          Thêm thú cưng
        </Button>
        {isFetching ? (
          <PetSkeletonGrid />
        ) : myPets.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Chưa có thú cưng nào được thêm vào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPets.map((pet, index) => (
              <PetCard key={pet.id} pet={pet} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
