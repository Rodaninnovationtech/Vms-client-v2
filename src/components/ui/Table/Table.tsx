import type { TableColumn } from "@/types";

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  emptyText?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  emptyText = "No records found",
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-primary-50">
      <table className="w-full text-sm text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-primary-50/70">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className="px-4 py-3 font-semibold text-primary-800 text-xs uppercase tracking-wide whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-t border-slate-100 hover:bg-primary-50/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
