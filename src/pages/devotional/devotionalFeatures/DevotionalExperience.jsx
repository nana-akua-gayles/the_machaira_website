function DevotionalExperience() {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <aside className="w-[330px] rounded-[26px] border border-black/10 bg-white/90 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl">
      
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111827]">
          Your Devotional Experience
        </h2>

        <div className="mt-3 h-[2px] w-12 bg-[#991313]" />
      </div>

      {/* Streak */}
      <div className="rounded-2xl border border-black/10 p-4">
        <div className="flex items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <span className="text-sm font-medium text-[#374151]">
                Streak
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold text-[#111827]">
              12 Days
            </p>

            <p className="mt-1 text-xs font-medium text-[#991313]">
              Keep going!
            </p>
          </div>

          {/* Progress circle */}
          <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[conic-gradient(#991313_0deg_270deg,#E5E7EB_270deg_360deg)]">
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white">
              <span className="text-sm font-semibold text-[#111827]">
                75%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Weekly progress */}
      <div className="mt-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-medium text-[#111827]">
          Progress this Week
        </p>

        <div className="mt-4 flex items-center justify-between">
          {weekDays.map((day, index) => {
            const completed = index < 6;

            return (
              <div
                key={`${day}-${index}`}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                  completed
                    ? "bg-[#991313] text-white"
                    : "bg-[#E5E7EB] text-[#374151]"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current series */}
      <div className="mt-3 rounded-2xl border border-black/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#374151]">
              Current Series
            </p>

            <h3 className="mt-1 text-sm font-semibold text-[#111827]">
              Living by Faith
            </h3>

            <p className="mt-1 text-xs font-medium text-[#991313]">
              5 of 7 Devotionals
            </p>
          </div>

          <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-[#E5E7EB]">
            <img
              src="/images/living-by-faith.jpg"
              alt="Living by Faith"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Download */}
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA]"
      >
        <div>
          <p className="text-sm font-medium text-[#111827]">
            Download for Offline
          </p>

          <p className="mt-1 text-xs text-[#4D5057]">
            Save and read anywhere
          </p>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">
          ↓
        </span>
      </button>

      {/* Share */}
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-black/10 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-[#FAFAFA]"
      >
        <div>
          <p className="text-sm font-medium text-[#111827]">
            Share Today's Devotional
          </p>

          <p className="mt-1 text-xs text-[#4D5057]">
            Encourage someone
          </p>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg">
          ↗
        </span>
      </button>

      {/* Community */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#E7DCD2] bg-[#F8F1EA] p-5">
        
        <div className="relative z-10 max-w-[190px]">
          <p className="text-sm font-semibold text-[#111827]">
            Join Our Community
          </p>

          <p className="mt-2 text-xs leading-5 text-[#4D5057]">
            Discuss, connect and grow together in faith.
          </p>

          <button
            type="button"
            className="mt-4 rounded-full bg-[#991313] px-5 py-2.5 text-xs font-semibold text-white transition duration-300 hover:bg-[#7F0E0E]"
          >
            Join Forum
          </button>
        </div>

        {/* Decorative cross */}
        <div className="absolute right-7 top-5 h-12 w-12 opacity-70">
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#8D563B]" />
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#8D563B]" />
        </div>

      </div>

    </aside>
  );
}

export default DevotionalExperience;