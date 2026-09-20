function PreviousDevotionalToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
}) {

  return (
    <div className="relative z-30 mx-auto -mb-8 max-w-[1350px] px-6 lg:px-10">
      <div className="flex min-h-[74px] flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_12px_35px_rgba(16,26,43,0.08)] backdrop-blur-md lg:flex-row lg:items-center lg:gap-0">

        {/* Search */}
        <div className="flex min-w-0 flex-1 items-center px-3 lg:px-4">

          <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#991313]/[0.06] text-[#991313]">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, topic, scripture or keyword..."
            className="w-full bg-transparent py-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* Sort */}
        <div className="flex items-center gap-3 px-3 lg:px-5">

          <span className="whitespace-nowrap text-sm text-[#6B7280]">
            Sort by:
          </span>

          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-[#111827] outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <span className="-ml-5 pointer-events-none text-xs text-[#991313]">
            ▾
          </span>

        </div>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* Items per page */}
        <div className="flex items-center gap-3 px-3 lg:px-5">

          <span className="whitespace-nowrap text-sm text-[#6B7280]">
            Items:
          </span>
          
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-semibold text-[#111827] outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="-ml-5 pointer-events-none text-xs text-[#991313]">
            ▾
          </span>

        </div>

        {/* Divider */}
        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* View controls */}
        <div className="flex items-center gap-1 px-2">

          <button
            type="button"
            aria-label="List view"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#991313]/[0.07] text-[#991313]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M8 6h13" />
              <path d="M8 12h13" />
              <path d="M8 18h13" />
              <path d="M3 6h.01" />
              <path d="M3 12h.01" />
              <path d="M3 18h.01" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Grid view"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6B7280] transition-colors hover:bg-black/[0.04] hover:text-[#111827]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
          </button>

        </div>

      </div>
    </div>
  );
}

export default PreviousDevotionalToolbar;