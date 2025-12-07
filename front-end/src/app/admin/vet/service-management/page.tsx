"use client";

import { DataTable } from "@/app/admin/vet/_components/data-table";
import { serviceColumns } from "@/app/admin/vet/service-management/_components/service-data-table";
import {
  ServiceCreateDialog,
  ServiceDeleteAlertDialog,
  ServiceEditDialog,
} from "@/app/admin/vet/service-management/_components/service-dialog";
import { Button } from "@/components/ui/button";
import { vetApi } from "@/lib/api/vet";
import { VetServiceLabels } from "@/lib/schemas/vet";
import { useVetServiceManagementStore } from "@/lib/stores/vet-service-management-store";
import { useEffect } from "react";

export default function VetServiceManagementPage() {
  const services = useVetServiceManagementStore.use.services();
  const { setServices } = useVetServiceManagementStore.use.actions();
  useEffect(() => {
    async function fetchServices() {
      const response = await vetApi.getServices();
      setServices(response);
    }
    fetchServices();
  }, [setServices]);

  return (
    <div className="container mx-auto py-10">
      <ServiceCreateDialog />
      <DataTable
        headerLabels={VetServiceLabels}
        columns={serviceColumns}
        data={services}
      />
      <ServiceEditDialog />
      <ServiceDeleteAlertDialog />
    </div>
  );
}
