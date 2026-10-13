
function PreviousDevotionalToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
  viewMode = "list",
  onViewModeChange,
}) {
  const activeClass = "bg-burgundy-primary/[0.07] text-burgundy-primary";
  const inactiveClass = "text-[#6B7280] hover:bg-black/[0.04] hover:text-charcoal-text";

  return (
    <div className="relative z-30 mx-auto -mb-8 max-w-[1350px] px-6 lg:px-10">
      <div className="flex min-h-[74px] flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_12px_35px_rgba(16,26,43,0.08)] backdrop-blur-md lg:flex-row lg:items-center lg:gap-0">
        <div className="flex min-w-0 flex-1 items-center px-3 lg:px-4">
          <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy-primary/[0.06] text-burgundy-primary">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, topic, scripture or keyword..."
            className="w-full bg-transparent py-3 text-sm text-charcoal-text outline-none placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        <div className="flex items-center gap-3 px-3 lg:px-5">
          <label className="whitespace-nowrap text-sm text-[#6B7280]">Sort by:</label>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="cursor-pointer bg-transparent text-sm font-medium text-charcoal-text outline-none">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        <div className="flex items-center gap-3 px-3 lg:px-5">
          <label className="whitespace-nowrap text-sm text-[#6B7280]">Items:</label>
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="cursor-pointer bg-transparent text-sm font-semibold text-charcoal-text outline-none">
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        <div className="flex items-center gap-1 px-2">
          <button type="button" aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => onViewModeChange("list")} className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${viewMode === "list" ? activeClass : inactiveClass}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>

          <button type="button" aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => onViewModeChange("grid")} className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${viewMode === "grid" ? activeClass : inactiveClass}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
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
