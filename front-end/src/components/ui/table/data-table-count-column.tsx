import React from "react";

type CountColumnProps = {
  totalRows: number;
  from: number | (() => number);
  to: number | (() => number);
};

export function DataTableCountColumn({
  from,
  to,
  totalRows,
}: CountColumnProps) {
  const resolvedFrom = typeof from === "function" ? from() : from;
  const resolvedTo = typeof to === "function" ? to() : to;
  return (
    <div className="text-muted-foreground flex-1 text-sm">
      Hiển thị {resolvedFrom}-{resolvedTo} trên tổng {totalRows} mục
    </div>
  );
}
