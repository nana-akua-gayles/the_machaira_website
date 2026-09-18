import { useState } from "react";

function PreviousDevotionalFilters() {
  const [category, setCategory] = useState("all");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [episodeRange, setEpisodeRange] = useState([1, 1327]);

  const categories = [
    "All Categories",
    "Faith",
    "Healing",
    "Prayer",
    "Deliverance",
    "Purpose",
    "Provision",
    "Breakthrough",
  ];

  const seriesOptions = [
    "All Series",
    "Daily Machaira",
    "Living by Faith",
    "The Power of Prayer",
    "Walking in Purpose",
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
          onClick={handleClearFilters}
          className="text-xs font-semibold text-[#991313] transition-colors hover:text-[#7f0e0e]"
        >
          Clear
        </button>

      </div>

      {/* Category */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-[#101A2B]">
          Category
        </h3>

        <div className="space-y-3">

          {categories.map((item) => {
            const value =
              item === "All Categories"
                ? "all"
                : item.toLowerCase().replace(/\s+/g, "-");

            const isSelected = category === value;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(value)}
                className="group flex w-full items-center gap-3 text-left"
              >
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    isSelected
                      ? "border-[#991313]"
                      : "border-[#B9BEC8] group-hover:border-[#991313]"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-[#991313]" />
                  )}
                </span>

                <span
                  className={`text-sm transition-colors ${
                    isSelected
                      ? "font-semibold text-[#101A2B]"
                      : "text-[#4D5057] group-hover:text-[#991313]"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}

        </div>
      </div>

      {/* Date Range */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-[#101A2B]">
          Date Range
        </h3>

        <div className="space-y-3">

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#6B7280]">
              From
            </span>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-xl border border-black/[0.1] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313] focus:ring-2 focus:ring-[#991313]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#6B7280]">
              To
            </span>

            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-full rounded-xl border border-black/[0.1] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#991313] focus:ring-2 focus:ring-[#991313]/10"
            />
          </label>

        </div>
      </div>

      {/* Episode Number */}
      <div className="border-t border-black/[0.08] py-6">

        <div className="mb-5 flex items-center justify-between">

          <h3 className="text-sm font-semibold text-[#101A2B]">
            Episode Number
          </h3>

          <span className="text-xs font-semibold text-[#991313]">
            {episodeRange[0]} – {episodeRange[1]}
          </span>

        </div>

        <div className="relative px-1">

          {/* Track */}
          <div className="h-1 rounded-full bg-[#E5E7EB]" />

          {/* Active track */}
          <div className="absolute left-1 right-1 top-0 h-1 rounded-full bg-[#991313]" />

          {/* Lower range */}
          <input
            type="range"
            min="1"
            max="1327"
            value={episodeRange[0]}
            onChange={(event) => {
              const value = Math.min(
                Number(event.target.value),
                episodeRange[1] - 1
              );

              setEpisodeRange([value, episodeRange[1]]);
            }}
            className="absolute inset-0 w-full appearance-none bg-transparent"
            aria-label="Minimum episode"
          />

          {/* Upper range */}
          <input
            type="range"
            min="1"
            max="1327"
            value={episodeRange[1]}
            onChange={(event) => {
              const value = Math.max(
                Number(event.target.value),
                episodeRange[0] + 1
              );

              setEpisodeRange([episodeRange[0], value]);
            }}
            className="absolute inset-0 w-full appearance-none bg-transparent"
            aria-label="Maximum episode"
          />

        </div>

        <div className="mt-4 flex justify-between text-xs text-[#9CA3AF]">
          <span>1</span>
          <span>1327</span>
        </div>

      </div>

      {/* Series */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-[#101A2B]">
          Series
        </h3>

        <div className="space-y-3">

        {seriesOptions.map((item) => {
        const value =
            item === "All Series"
            ? "all"
            : item.toLowerCase().replace(/\s+/g, "-");

        const isSelected = selectedSeries === value;

        return (
            <button
            key={item}
            type="button"
            onClick={() => setSelectedSeries(value)}
            className="group flex w-full items-center gap-3 text-left"
            >
            <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                isSelected
                    ? "border-[#991313]"
                    : "border-[#B9BEC8] group-hover:border-[#991313]"
                }`}
            >
                {isSelected && (
                <span className="h-2 w-2 rounded-full bg-[#991313]" />
                )}
            </span>

            <span
                className={`text-sm transition-colors ${
                isSelected
                    ? "font-semibold text-[#101A2B]"
                    : "text-[#4D5057] group-hover:text-[#991313]"
                }`}
            >
                {item}
            </span>
            </button>
        );
        })}

        </div>
      </div>

    </aside>
  );
}

export default PreviousDevotionalFilters;