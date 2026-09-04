import { useState } from "react";

function DevotionalDateNav() {
  const dates = [16, 17, 18, 19, 20];

  const [selectedDate, setSelectedDate] = useState(18);

  return (
    <div className="relative flex w-[120px] shrink-0 flex-col items-center pt-24">

      {/* Selected date card */}
      <div className="relative z-10 flex h-[134px] w-[78px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white/85 shadow-sm backdrop-blur-sm">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#991313]">
          May
        </span>

        <span className="mt-1 text-4xl font-semibold leading-none text-[#111827]">
          {selectedDate}
        </span>

        <span className="mt-2 text-sm font-semibold text-[#991313]">
          2025
        </span>
      </div>

      {/* Timeline */}
      <div className="relative mt-6 flex flex-col items-center">

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#B9BEC8]" />

        {dates.map((date) => {
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className="group relative z-10 flex h-[58px] w-[80px] items-center justify-center gap-4"
            >
              {/* Dot */}
              <span
                className={`flex h-3 w-3 shrink-0 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "h-7 w-7 bg-[#991313] shadow-md"
                    : "bg-[#B9BEC8] group-hover:bg-[#991313]"
                }`}
              >
                {isSelected && (
                  <span className="m-auto text-xs font-semibold text-white">
                    {date}
                  </span>
                )}
              </span>

              {/* Date number */}
              {!isSelected && (
                <span className="w-7 text-left text-sm font-medium text-[#374151] transition-colors duration-300 group-hover:text-[#991313]">
                  {date}
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