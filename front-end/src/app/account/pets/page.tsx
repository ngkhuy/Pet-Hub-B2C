import { OwnPetDeleteDialog } from "@/app/account/pets/_components/own-pet-delete-dialog";
import { OwnPetEditDialog } from "@/app/account/pets/_components/own-pet-edit-dialog";
import { PetAddDialog } from "@/app/account/pets/_components/pet-add-dialog";
import PetGrip from "@/app/account/pets/_components/pet-grid";
import { decrypt } from "@/lib/actions/session";
import { clientUrl } from "@/lib/data/web-url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PetListPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    redirect(`${clientUrl.login.path}?redirect=${clientUrl.account_pets.path}`);
  }

  const tokenPayload = await decrypt(accessToken || "");
  if (!tokenPayload) {
    redirect(`${clientUrl.home.path}`);
  }

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

      <div>
        <PetGrip />
      </div>
      <PetAddDialog />
      <OwnPetEditDialog />
      <OwnPetDeleteDialog />
    </main>
  );
}
