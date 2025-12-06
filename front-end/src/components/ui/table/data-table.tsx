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
import { DataTableVisibleMenu } from "@/components/ui/table/data-table-visible-menu";
import { DataTableCountColumn } from "@/components/ui/table/data-table-count-column";
import DataTablePaginateButton from "@/components/ui/table/data-table-paginate-button";
import { useDataTable } from "@/hooks/useDataTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  headerLabels: Partial<Record<keyof TData, string>>;
  renderCreateDialog?: () => React.ReactNode;
  renderEditDialog?: () => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  headerLabels,
  renderCreateDialog,
  renderEditDialog,
}: DataTableProps<TData, TValue>) {
  const { tableKey, columnVisibility, setColumnVisibility } = useDataTable({
    data,
    columns,
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
  });

  const visiableFilterColumns = table.getAllColumns();

  function handleOnPreviousClick() {
    table.previousPage();
  }

  return (
    <div>
      {/* Toolbar: Create + Visible Columns */}
      <div className="flex items-center justify-between py-4">
        <div>{renderCreateDialog && renderCreateDialog()}</div>
        <div>{renderEditDialog && renderEditDialog()}</div>
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
