"use client";

import { serviceColumns } from "@/app/admin/service-management/_component/service-column";
import { ServiceCreateDialog } from "@/app/admin/service-management/_component/service-create-dialog";
import { ServiceDeleteAlertDialog } from "@/app/admin/service-management/_component/service-alert-dialog";
import { ServiceEditDialog } from "@/app/admin/service-management/_component/service-edit.dialog";
import { DataTable } from "@/components/ui/table/data-table";
import { bookingApi } from "@/lib/api/booking";
import { ServiceType } from "@/lib/types/booking";
import { UserLabelsWithActions } from "@/lib/types/user-management";
import { toastError } from "@/lib/utils/toast";
import { useEffect } from "react";
import { useServiceManagementStore } from "@/lib/stores/service-management-store";

export default function ServiceManagementPage() {
  const services = useServiceManagementStore.use.services();
  const { setServices } = useServiceManagementStore.use.actions();

  useEffect(() => {
    async function fetchServices() {
      try {
        const data: ServiceType[] = [];
        const [spaServices, hotelServices] = await Promise.all([
          bookingApi.getSpaServices(),
          bookingApi.getHotelServices(),
        ]);
        data.push(...spaServices, ...hotelServices);
        setServices(data);
      } catch (error) {
        toastError("Lấy danh sách dịch vụ thất bại");
        console.error("Failed to fetch services:", error);
      }
    }
    fetchServices();
  }, [setServices]);

  return (
    <div className="container mx-auto py-10">
      <ServiceDeleteAlertDialog />
      <ServiceCreateDialog />
      <ServiceEditDialog />
      <DataTable
        headerLabels={UserLabelsWithActions}
        columns={serviceColumns}
        data={services}
      />
    </div>
  );
}
