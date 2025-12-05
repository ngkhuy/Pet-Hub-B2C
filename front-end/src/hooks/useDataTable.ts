"use client";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useReducer, useEffect, useState } from "react";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  onRefresh?: () => void;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  onRefresh,
}: UseDataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [tableKey, forceRebuild] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    forceRebuild(); // mỗi khi data hoặc columns đổi → rebuild
  }, [data, columns]);

  return {
    tableKey,
    columnVisibility,
    setColumnVisibility,
  };
}
