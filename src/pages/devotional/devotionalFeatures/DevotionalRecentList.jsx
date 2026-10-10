import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDevotionalTitle, formatDate } from "./formatDevotional";

function DevotionalRecentList({ devotionals }) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollToCard = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = carousel.querySelectorAll("[data-devotional-card]");
    const target = cards[Math.max(0, Math.min(index, cards.length - 1))];
    if (target) carousel.scrollTo({ left: target.offsetLeft - carousel.offsetLeft, behavior: "smooth" });
  };
  const updateActive = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = [...carousel.querySelectorAll("[data-devotional-card]")];
    if (!cards.length) return;
    const scrollLeft = carousel.scrollLeft;
    let nearest = 0;
    cards.forEach((card, i) => {
      if (Math.abs(card.offsetLeft - carousel.offsetLeft - scrollLeft) < Math.abs(cards[nearest].offsetLeft - carousel.offsetLeft - scrollLeft)) nearest = i;
    });
    setActiveIndex(nearest);
  };
  if (!devotionals || devotionals.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">

        {/* Section heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <Link to="/previous-devotionals" className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
              Previous Devotionals
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-navy-dark md:text-4xl">
              Catch Up On Recent Episodes
            </h2>

            <p className="mt-3 max-w-140 text-sm leading-6 text-cool-gray">
              Missed a day? Revisit recent episodes of Machaira with Apostle
              Bennie.
            </p>
          </div>

          <Link
            to="/previous-devotionals"
            className="hidden shrink-0 rounded-full border border-soft-gray px-5 py-2.5 text-xs font-semibold text-navy-dark transition duration-300 hover:border-burgundy-primary hover:bg-burgundy-primary hover:text-white md:block"
          >
            View All
          </Link>
        </div>

        {/* Devotional carousel */}
        <div ref={carouselRef}
          onScroll={updateActive}
          aria-label="Recent devotionals, swipe to explore"
          className="relative mt-7 -mx-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-px-5 px-5 pb-5 overscroll-x-contain scrollbar-none sm:mt-10 sm:-mx-2 sm:px-2">
          <div className="flex w-max gap-3 sm:gap-5">

            {devotionals.map((item) => {
              const formatted = formatDevotionalTitle(item.title);

              return (
                <Link
                  key={item.id}
                  data-devotional-card
                  to={`/devotional/${item.id}`}
                  className="group relative h-[255px] w-[min(72vw,260px)] shrink-0 snap-start sm:h-[260px] sm:w-[230px] overflow-hidden rounded-[24px] text-left shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
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
                  <div className="absolute inset-0 bg-linear-to-t from-[#101A2B]/90 via-[#101A2B]/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-3 h-0.5 w-8 bg-burgundy-primary transition-all duration-300 group-hover:w-12" />

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

        {/* Mobile scroll affordance and controls */}
        <div className="mt-1 flex items-center justify-between gap-3 md:hidden">
          <div className="flex items-center gap-2" aria-label={`Episode ${activeIndex + 1} of ${devotionals.length}`}>
            {devotionals.map((item, i) => (
              <button key={item.id} type="button" onClick={() => scrollToCard(i)}
                aria-label={`Go to episode ${i + 1}`} aria-current={activeIndex === i ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-7 bg-burgundy-primary" : "w-1.5 bg-gray-300"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-[11px] text-cool-gray">Swipe to explore</span>
            <button type="button" onClick={() => scrollToCard(activeIndex - 1)} disabled={activeIndex === 0}
              aria-label="Previous episode" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-navy-dark disabled:opacity-30">←</button>
            <button type="button" onClick={() => scrollToCard(activeIndex + 1)} disabled={activeIndex >= devotionals.length - 1}
              aria-label="Next episode" className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy-primary text-white disabled:opacity-30">→</button>
          </div>
        </div>

        {/* Mobile View All */}
        <Link
          to="/previous-devotionals"
          className="mt-3 inline-block rounded-full border border-soft-gray px-5 py-2.5 text-xs font-semibold text-navy-dark transition duration-300 hover:border-burgundy-primary hover:bg-burgundy-primary hover:text-white md:hidden"
        >
          View All
        </Link>

      </div>
    </section>
  );
}

export default DevotionalRecentList;