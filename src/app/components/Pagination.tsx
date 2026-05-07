import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 8,
  onItemsPerPageChange
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show result:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={24}>24</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {totalPages > 5 && (
          <>
            <span className="text-gray-400">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
