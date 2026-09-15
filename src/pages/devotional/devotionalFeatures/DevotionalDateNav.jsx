import { useMemo } from "react";

function getDateParts(dateString) {
  const date = new Date(dateString);

  return {
    day: date.getUTCDate(),
    month: date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    }),
    year: date.getUTCFullYear(),
  };
}

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

function DevotionalDateNav({
  devotional,
  selectedDate,
  onDateSelect,
  loading,
}) {
  const dates = useMemo(() => {
    if (!selectedDate) return [];

    const centerDate = new Date(`${selectedDate}T00:00:00Z`);

    return [-2, -1, 0, 1, 2].map((offset) => {
      const date = new Date(centerDate);

      date.setUTCDate(date.getUTCDate() + offset);

      return {
        date: formatDateKey(date),
        day: date.getUTCDate(),
      };
    });
  }, [selectedDate]);

  const selectedParts = devotional
    ? getDateParts(devotional.created_at)
    : null;

  return (
    <div className="relative flex w-[120px] shrink-0 flex-col items-center pt-24">

      {/* Selected date card */}
      <div className="relative z-10 flex h-[134px] w-[78px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white/85 shadow-sm backdrop-blur-sm">

        {selectedParts ? (
          <>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#991313]">
              {selectedParts.month}
            </span>

            <span className="mt-1 text-4xl font-semibold leading-none text-[#111827]">
              {selectedParts.day}
            </span>

            <span className="mt-2 text-sm font-semibold text-[#991313]">
              {selectedParts.year}
            </span>
          </>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-[#991313]">
            No Date
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative mt-6 flex flex-col items-center">

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#B9BEC8]" />

        {dates.map((item) => {
          const isSelected = item.date === selectedDate;

          return (
            <button
              key={item.date}
              type="button"
              disabled={loading}
              onClick={() => onDateSelect(item.date)}
              className="group relative z-10 flex h-[58px] w-[80px] items-center justify-center gap-4 disabled:cursor-wait"
            >
              {/* Dot */}
              <span
                className={`flex shrink-0 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "h-7 w-7 bg-[#991313] shadow-md"
                    : "h-3 w-3 bg-[#B9BEC8] group-hover:bg-[#991313]"
                }`}
              >
                {isSelected && (
                  <span className="m-auto text-xs font-semibold text-white">
                    {item.day}
                  </span>
                )}
              </span>

              {/* Date number */}
              {!isSelected && (
                <span className="w-7 text-left text-sm font-medium text-[#374151] transition-colors duration-300 group-hover:text-[#991313]">
                  {item.day}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DevotionalDateNav;