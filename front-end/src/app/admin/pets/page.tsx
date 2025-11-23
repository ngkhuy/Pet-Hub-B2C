import { User, userLabelsWithActions, userSchema } from "@/lib/schemas/user";

import { DataTable } from "@/components/ui/table/data-table";
import userData from "@/MOCK_DATA/USER_MOCK_DATA.json";
import { userColumns } from "@/app/admin/users/_components/user-columns";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  const data = await Promise.all(userData.map((v) => userSchema.parseAsync(v)));

  return data;
}

export default async function UserManagementPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={userLabelsWithActions}
        columns={userColumns}
        data={data}
      />
    </div>
  );
}
