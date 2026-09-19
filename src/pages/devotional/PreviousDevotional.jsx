import { useEffect, useState } from "react";
import { getDevotionals } from "../../lib/devotionalService";
import PreviousDevotionalHero from "./PreviousDevotional/PreviousDevotionalHero";
import PreviousDevotionalToolbar from "./PreviousDevotional/PreviousDevotionalToolbar";
import PreviousDevotionalFilters from "./PreviousDevotional/PreviousDevotionalFilters";
import PreviousDevotionalList from "./PreviousDevotional/PreviousDevotionalList";

function PreviousDevotional() {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function loadDevotionals() {
      try {
        setLoading(true);
        setError(null);

        const result = await getDevotionals({
          page: 1,
          pageSize,
          search,
          sortBy,
        });

        setDevotionals(result.data);
      } catch (error) {
        console.error("Failed to load devotionals:", error);
        setError("Unable to load previous devotionals.");
      } finally {
        setLoading(false);
      }
    }
    loadDevotionals();
  }, [pageSize, search, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <main className="previous-devotional-page min-h-screen bg-white">

      <PreviousDevotionalHero />

      <PreviousDevotionalToolbar
        search={search}
        onSearchChange={setSearchInput}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-20 lg:px-10">

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

          <PreviousDevotionalFilters />

          {/* Devotional results will go here */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <p className="text-sm text-[#6B7280]">
                  Loading devotionals...
                </p>
              </div>
            ) : error ? (
              <div className="flex min-h-[280px] items-center justify-center border border-dashed border-[#D1D5DB] px-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-[#101A2B]">
                    Something went wrong
                  </p>

                  <p className="mt-2 text-sm text-[#6B7280]">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <PreviousDevotionalList devotionals={devotionals} />
            )}
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