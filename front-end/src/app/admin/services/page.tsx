import mockData from "@/MOCK_DATA/SERVICE_MOCK_DATA.json";
import {
  Service,
  serviceLabelsWithActions,
  serviceSchema,
} from "@/lib/schemas/service";
import { DataTable } from "@/components/ui/table/data-table";
import { serviceColumns } from "@/app/admin/services/_components/service-columns";

async function getData(): Promise<Service[]> {
  // Fetch data from your API here.
  const data = await Promise.all(
    mockData.map((v) => serviceSchema.parseAsync(v))
  );

  return data;
}

export default async function UserManagementPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        headerLabels={serviceLabelsWithActions}
        columns={serviceColumns}
        data={data}
      />
    </div>
  );
}
