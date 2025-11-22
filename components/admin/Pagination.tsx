interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="flex justify-center gap-3 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 bg-neutral-800 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-gray-300 px-2 py-1">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 bg-neutral-800 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
