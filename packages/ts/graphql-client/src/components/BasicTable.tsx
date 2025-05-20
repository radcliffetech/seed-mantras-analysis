import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "../i18n";

const ENABLE_SORTING = false;
export function BasicTable<T>({
  table,
  enableSearch = false,
  searchQuery,
  setSearchQuery,
  Actions,
}: {
  table: Table<T>;
  enableSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  Actions?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const filteredRows = table.getRowModel().rows.filter((row) =>
    row.getVisibleCells().some((cell) =>
      String(cell.getValue() ?? "")
        .toLowerCase()
        .includes((searchQuery ?? "").toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4">
      {enableSearch && setSearchQuery && (
        <div className="flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="border p-2 pr-8 rounded-md w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {Actions && <div className="">{Actions}</div>}
        </div>
      )}

      <table className="min-w-full border border-muted">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-2 text-left ${
                    ENABLE_SORTING && header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }`}
                  onClick={
                    ENABLE_SORTING
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {ENABLE_SORTING &&
                    ({
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ??
                      "")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id} className="even:bg-surface-muted">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
