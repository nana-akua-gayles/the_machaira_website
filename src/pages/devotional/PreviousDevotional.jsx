import PreviousDevotionalHero from "./PreviousDevotional/PreviousDevotionalHero";
import PreviousDevotionalToolbar from "./PreviousDevotional/PreviousDevotionalToolbar";
import PreviousDevotionalFilters from "./PreviousDevotional/PreviousDevotionalFilters";

function PreviousDevotional() {
  return (
    <main className="previous-devotional-page min-h-screen bg-white">

      <PreviousDevotionalHero />

      <PreviousDevotionalToolbar />

      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-20 lg:px-10">

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

          <PreviousDevotionalFilters />

          {/* Devotional results will go here */}
          <div className="min-w-0 flex-1">
            {/* Coming next */}
          </div>

        </div>

      </section>

      {/* Pagination will be built later */}

      {/* CTA will be built later */}

    </main>
  );
}

export default PreviousDevotional;