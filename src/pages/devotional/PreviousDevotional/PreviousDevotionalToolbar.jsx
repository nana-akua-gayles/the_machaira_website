<<<<<<< HEAD
import React from 'react';

function PreviousDevotionalToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
  viewMode = 'list',
  onViewModeChange = () => {},
}) {
  const activeClass =
    'bg-burgundy-primary/[0.07] text-burgundy-primary';
  const inactiveClass =
    'text-[#6B7280] hover:bg-black/[0.04] hover:text-charcoal-text';

  return (
    <div className="relative z-30 mx-auto -mb-8 max-w-[1350px] px-6 lg:px-10">
      <div className="flex min-h-[74px] flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_12px_35px_rgba(16,26,43,0.08)] backdrop-blur-md lg:flex-row lg:items-center lg:gap-0">

        {/* Search */}
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, topic, scripture or keyword..."
            className="w-full bg-transparent py-3 text-sm text-charcoal-text outline-none placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* Sort */}
        <div className="flex items-center gap-3 px-3 lg:px-5">
          <span className="whitespace-nowrap text-sm text-[#6B7280]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-charcoal-text outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <span className="-ml-5 pointer-events-none text-xs text-burgundy-primary">▾</span>
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* Items per page */}
        <div className="flex items-center gap-3 px-3 lg:px-5">
          <span className="whitespace-nowrap text-sm text-[#6B7280]">Items:</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-semibold text-charcoal-text outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="-ml-5 pointer-events-none text-xs text-burgundy-primary">▾</span>
        </div>

        <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block" />

        {/* View controls */}
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${viewMode === 'list' ? activeClass : inactiveClass}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${viewMode === 'grid' ? activeClass : inactiveClass}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
          </button>
        </div>

=======
function PreviousDevotionalToolbar({search,onSearchChange,sortBy,onSortChange,pageSize,onPageSizeChange,dateFrom,onDateFromChange,dateTo,onDateToChange}) {
  return <div className="relative z-30 mx-auto -mb-8 max-w-[1350px] px-4 sm:px-6 lg:px-10">
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_12px_35px_rgba(16,26,43,0.08)] backdrop-blur-md lg:min-h-[74px] lg:flex-row lg:items-center lg:gap-0">
      <div className="flex min-w-0 flex-1 items-center px-2 lg:px-4"><span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy-primary/[0.06] text-burgundy-primary"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></span><input aria-label="Search devotionals" type="search" value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search by title, topic, scripture or keyword..." className="min-w-0 w-full bg-transparent py-3 text-sm text-charcoal-text outline-none placeholder:text-[#9CA3AF]"/></div>
      <div className="hidden h-9 w-px bg-[#E5E7EB] lg:block"/>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center lg:flex-nowrap lg:gap-3">
        <label className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-2 py-2 lg:border-0 lg:px-4"><span className="shrink-0 text-[11px] text-[#6B7280] sm:text-sm">Sort:</span><select aria-label="Sort devotionals" value={sortBy} onChange={e=>onSortChange(e.target.value)} className="min-w-0 w-full bg-transparent text-[11px] font-medium text-charcoal-text outline-none sm:text-sm"><option value="newest">Newest First</option><option value="oldest">Oldest First</option></select></label>
        <label className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-2 py-2 lg:border-0 lg:px-4"><span className="shrink-0 text-[11px] text-[#6B7280] sm:text-sm">Items:</span><select aria-label="Items per page" value={pageSize} onChange={e=>onPageSizeChange(Number(e.target.value))} className="min-w-0 w-full bg-transparent text-[11px] font-medium text-charcoal-text outline-none sm:text-sm"><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></label>
        <div className="col-span-2 min-w-0 rounded-xl border border-[#E5E7EB] px-2 py-2 lg:hidden"><div className="flex items-center gap-2"><span className="shrink-0 text-[11px] font-medium text-[#6B7280]">Dates</span><label className="min-w-0 flex-1"><span className="sr-only">From date</span><input type="date" aria-label="From date" value={dateFrom} onChange={e=>onDateFromChange(e.target.value)} className="w-full min-w-0 bg-transparent text-[11px] text-charcoal-text outline-none"/></label><span className="text-[#9CA3AF]">–</span><label className="min-w-0 flex-1"><span className="sr-only">To date</span><input type="date" aria-label="To date" value={dateTo} onChange={e=>onDateToChange(e.target.value)} className="w-full min-w-0 bg-transparent text-[11px] text-charcoal-text outline-none"/></label></div></div>
>>>>>>> d355de247515715790a1a24934e8df943aab5721
      </div>
    </div>
  </div>;
}
<<<<<<< HEAD

export default PreviousDevotionalToolbar;

=======
export default PreviousDevotionalToolbar;
>>>>>>> d355de247515715790a1a24934e8df943aab5721
