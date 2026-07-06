import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total = 0,
  limit = 15,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
      <span className="text-sm text-slate-500">
        {total > 0 ? (
          <>Showing <strong className="text-slate-700">{(page - 1) * limit + 1}</strong> to <strong className="text-slate-700">{Math.min(page * limit, total)}</strong> of <strong className="text-slate-700">{total}</strong> entries</>
        ) : 'No entries found'}
      </span>
      <div className="flex items-center space-x-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === pageNum
                  ? 'bg-black text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
