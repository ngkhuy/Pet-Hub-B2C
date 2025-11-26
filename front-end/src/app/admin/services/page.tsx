import mockData from "@/MOCK_DATA/SERVICE_MOCK_DATA.json";

import { DataTable } from "@/components/ui/table/data-table";
import { serviceColumns } from "@/app/admin/services/_components/service-columns";
import {
  Service,
  ServiceLabelsWithActions,
  ServiceType,
} from "@/lib/schemas/booking";

async function getData(): Promise<ServiceType[]> {
  // Fetch data from your API here.
  const data = await Promise.all(mockData.map((v) => Service.parseAsync(v)));

  return data;
}

export default async function UserManagementPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={ServiceLabelsWithActions}
        columns={serviceColumns}
        data={data}
      />
    </div>
  );
}
