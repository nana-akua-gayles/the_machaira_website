function PreviousDevotionalFilters({
    category,
    onCategoryChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    episodeFrom,
    onEpisodeFromChange,
    episodeTo,
    onEpisodeToChange,
    onClear,
}) {

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Faith", value: "Faith" },
    { label: "Healing", value: "Healing" },
    { label: "Liberty", value: "Liberty" },
    { label: "Hope", value: "Hope" },
  ];

  function handleClearFilters() {
    setCategory("all");
    setSelectedSeries("all");
    setDateFrom("");
    setDateTo("");
    setEpisodeRange([1, 1327]);
  }

  return (
    <aside className="w-full lg:w-[255px] lg:shrink-0">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#991313]">
            Refine
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#101A2B]">
            Filter devotionals
          </h2>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-[#991313] transition-colors hover:text-[#7f0e0e]"
        >
          Clear filters
        </button>

      </div>

      {/* Category */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-[#101A2B]">
          Category
        </h3>

        <div className="space-y-3">

        {categories.map((item) => {
          const isActive = category === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className="flex w-full items-center gap-3 py-2 text-left"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isActive
                    ? "border-[#991313]"
                    : "border-[#B9BEC8]"
                }`}
              >
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-[#991313]" />
                )}
              </span>

              <span
                className={`text-sm ${
                  isActive
                    ? "font-medium text-[#101A2B]"
                    : "text-[#6B7280]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        </div>
      
      <div className="mt-5 border-t border-[#E5E7EB] pt-5">
        <label
          htmlFor="category-search"
          className="mb-2 block text-xs font-medium text-[#6B7280]"
        >
          Search another category
        </label>

        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <input
            id="category-search"
            type="text"
            value={
              categories.some((item) => item.value === category)
                ? ""
                : category
            }
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            placeholder="Search category..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#991313]"
          />
        </div>
      </div>
      </div>

      {/* Date Range */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-[#101A2B]">
          Date Range
        </h3>

        <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            From
          </label>

          <input
            type="date"
            value={dateFrom}
            onChange={(event) =>
              onDateFromChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            To
          </label>

          <input
            type="date"
            value={dateTo}
            onChange={(event) =>
              onDateToChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313]"
          />
        </div>
      </div>
      </div>

      {/* Episode Number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            From
          </label>

          <input
            type="number"
            min="1"
            value={episodeFrom}
            onChange={(event) =>
              onEpisodeFromChange(event.target.value)
            }
            placeholder="1"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            To
          </label>

          <input
            type="number"
            min="1"
            value={episodeTo}
            onChange={(event) =>
              onEpisodeToChange(event.target.value)
            }
            placeholder="1334"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313]"
          />
        </div>
      </div>

    </aside>
  );
}

export default PreviousDevotionalFilters;