// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useEffect, useState } from "react";
// import { DataTableVisibleMenu } from "@/components/ui/table/data-table-visible-menu";
// import { DataTableCountColumn } from "@/components/ui/table/data-table-count-column";
// import DataTablePaginateButton from "@/components/ui/table/data-table-paginate-button";
// import { useSearchParams } from "next/navigation";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   headerLabels: Partial<Record<keyof TData, string>>;
//   onRefresh?: () => void;
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   headerLabels,
//   onRefresh,
// }: DataTableProps<TData, TValue>) {
//   const search = useSearchParams();

//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     state: {
//       columnVisibility,
//     },
//     meta: {
//       onUpdated: onRefresh,
//     },
//   });
//   const visiableFilterColumns = table.getAllColumns();

//   const currentPage = Number(search.get("pageNumber") || 1);

//   function handleOnPreviousClick() {
//     table.previousPage();
//   }

//   useEffect(() => {
//     if (currentPage > 0 && currentPage <= table.getPageCount()) {
//       table.setPageIndex(currentPage - 1);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   return (
//     <div>
//       <div className="flex items-center py-4">
//         <div></div>
//         <DataTableVisibleMenu
//           columns={visiableFilterColumns}
//           labels={headerLabels}
//         />
//       </div>
//       <div className="overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader className="p-10">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <DataTableCountColumn
//           from={
//             table.getState().pagination.pageIndex *
//               table.getState().pagination.pageSize +
//             1
//           }
//           to={() => {
//             const to =
//               (table.getState().pagination.pageIndex + 1) *
//               table.getState().pagination.pageSize;
//             return to > table.getCoreRowModel().rows.length
//               ? table.getCoreRowModel().rows.length
//               : to;
//           }}
//           totalRows={table.getCoreRowModel().rows.length}
//         />
//         <DataTablePaginateButton
//           onPreviousClick={handleOnPreviousClick}
//           onNextClick={() => table.nextPage()}
//           isPreviousDisabled={!table.getCanPreviousPage()}
//           isNextDisabled={!table.getCanNextPage()}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { DataTableVisibleMenu } from "@/components/ui/table/data-table-visible-menu";
import { DataTableCountColumn } from "@/components/ui/table/data-table-count-column";
import DataTablePaginateButton from "@/components/ui/table/data-table-paginate-button";
import { useSearchParams } from "next/navigation";
import { useDataTable } from "@/hooks/useDataTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  headerLabels: Partial<Record<keyof TData, string>>;
  onRefresh?: () => void;
  renderCreateDialog?: (props: { onCreated?: () => void }) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  headerLabels,
  onRefresh,
  renderCreateDialog,
}: DataTableProps<TData, TValue>) {
  const search = useSearchParams();

  const { tableKey, columnVisibility, setColumnVisibility } = useDataTable({
    data,
    columns,
    onRefresh,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onUpdated: onRefresh,
    },
  });

  const visiableFilterColumns = table.getAllColumns();
  const currentPage = Number(search.get("pageNumber") || 1);

  function handleOnPreviousClick() {
    table.previousPage();
  }

  useEffect(() => {
    if (currentPage > 0 && currentPage <= table.getPageCount()) {
      table.setPageIndex(currentPage - 1);
    }
    console.log("Current page:", currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div>
      {/* Toolbar: Create + Visible Columns */}
      <div className="flex items-center justify-between py-4">
        <div>
          {renderCreateDialog && renderCreateDialog({ onCreated: onRefresh })}
        </div>

        <DataTableVisibleMenu
          columns={visiableFilterColumns}
          labels={headerLabels}
        />
      </div>

      {/* Table với scroll */}
      <div className="overflow-hidden  rounded-md border">
        <Table key={tableKey}>
          <TableHeader className="p-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: paginate */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTableCountColumn
          from={
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
            1
          }
          to={() => {
            const to =
              (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize;
            return to > table.getCoreRowModel().rows.length
              ? table.getCoreRowModel().rows.length
              : to;
          }}
          totalRows={table.getCoreRowModel().rows.length}
        />
        <DataTablePaginateButton
          onPreviousClick={handleOnPreviousClick}
          onNextClick={() => table.nextPage()}
          isPreviousDisabled={!table.getCanPreviousPage()}
          isNextDisabled={!table.getCanNextPage()}
        />
      </div>
    </div>
  );
}
