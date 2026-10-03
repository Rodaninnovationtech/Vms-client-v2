import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
  pageSize?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  pageSize,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const from = totalRecords && pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const to =
    totalRecords && pageSize ? Math.min(currentPage * pageSize, totalRecords) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3">
      {totalRecords !== undefined && (
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">{from}</span>-
          <span className="font-medium text-slate-700">{to}</span> of{" "}
          <span className="font-medium text-slate-700">{totalRecords}</span>
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-slate-500 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, idx) => (
          <div key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && (
              <span className="px-1 text-slate-400 text-xs">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`min-w-[30px] h-[30px] rounded-md text-xs font-medium transition-colors
              ${
                p === currentPage
                  ? "bg-primary-700 text-white"
                  : "text-slate-600 hover:bg-primary-50"
              }`}
            >
              {p}
            </button>
          </div>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-slate-500 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
