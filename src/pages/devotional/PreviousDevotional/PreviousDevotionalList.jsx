import PreviousDevotionalItem from "./PreviousDevotionalItem";

function PreviousDevotionalList({ devotionals = [] }) {
  return (
    <section className="w-full">
      {/* Results heading */}
      <div className="mb-7 flex items-end justify-between gap-6 border-b border-[#E5E7EB] pb-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#991313]">
            Devotional Library
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#101A2B] md:text-3xl">
            Previous Devotionals
          </h2>
        </div>

        <p className="hidden text-sm text-[#6B7280] sm:block">
          {devotionals.length} devotionals
        </p>
      </div>

      {/* Devotional list */}
      {devotionals.length > 0 ? (
        <div className="divide-y divide-[#E5E7EB]">
          {devotionals.map((devotional) => (
            <PreviousDevotionalItem
              key={devotional.id}
              devotional={devotional}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[280px] items-center justify-center border border-dashed border-[#D1D5DB] px-6 text-center">
          <div>
            <p className="text-lg font-semibold text-[#101A2B]">
              No devotionals found
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
              Try adjusting your search or filters to find another
              devotional.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default PreviousDevotionalList;