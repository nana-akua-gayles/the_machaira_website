import { Link } from "react-router-dom";
import { formatDevotionalTitle, formatDate } from "./formatDevotional";

function DevotionalRecentList({ devotionals }) {
  if (!devotionals || devotionals.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12">

        {/* Section heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <Link to="/previous-devotionals" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#991313]">
              Previous Devotionals
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#101A2B] md:text-4xl">
              Catch Up On Recent Episodes
            </h2>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#4D5057]">
              Missed a day? Revisit recent episodes of Machaira with Apostle
              Bennie.
            </p>
          </div>

          <Link
            to="/previous-devotionals"
            className="hidden shrink-0 rounded-full border border-[#B9BEC8] px-5 py-2.5 text-xs font-semibold text-[#101A2B] transition duration-300 hover:border-[#991313] hover:bg-[#991313] hover:text-white md:block"
          >
            View All
          </Link>
        </div>

        {/* Devotional carousel */}
        <div className="mt-10 -mx-2 overflow-x-auto px-2 pb-5 scrollbar-none">
          <div className="flex w-max gap-5">

            {devotionals.map((item) => {
              const formatted = formatDevotionalTitle(item.title);

              return (
                <Link
                  key={item.id}
                  to={`/devotional/${item.id}`}
                  className="group relative h-[260px] w-[230px] shrink-0 overflow-hidden rounded-[24px] text-left shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Image or fallback */}
                  {item.flyer_url ? (
                    <img
                      src={item.flyer_url}
                      alt={formatted.mainTitle}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#101A2B]">
                      <span className="pointer-events-none absolute -right-3 -top-6 font-serif text-[160px] leading-none text-white/5">
                        “
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101A2B]/90 via-[#101A2B]/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-3 h-[2px] w-8 bg-[#991313] transition-all duration-300 group-hover:w-12" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e3a8a8]">
                      {item.category || "Daily Devotional"}
                    </p>

                    <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white">
                      {formatted.mainTitle}
                    </h3>

                    <p className="mt-2 text-xs text-white/70">
                      {formatDate(item.created_at)}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white">
                      Read
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}

          </div>
        </div>

        {/* Mobile View All */}
        <Link
          to="/previous-devotionals"
          className="mt-3 inline-block rounded-full border border-[#B9BEC8] px-5 py-2.5 text-xs font-semibold text-[#101A2B] transition duration-300 hover:border-[#991313] hover:bg-[#991313] hover:text-white md:hidden"
        >
          View All
        </Link>

      </div>
    </section>
  );
}

export default DevotionalRecentList;