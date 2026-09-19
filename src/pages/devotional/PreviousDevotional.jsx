import { useEffect, useState } from "react";
import { getDevotionals } from "../../lib/devotionalService";
import PreviousDevotionalHero from "./PreviousDevotional/PreviousDevotionalHero";
import PreviousDevotionalToolbar from "./PreviousDevotional/PreviousDevotionalToolbar";
import PreviousDevotionalFilters from "./PreviousDevotional/PreviousDevotionalFilters";
import PreviousDevotionalList from "./PreviousDevotional/PreviousDevotionalList";
import PreviousDevotionalPagination from "./PreviousDevotional/PreviousDevotionalPagination";

function PreviousDevotional() {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [episodeFrom, setEpisodeFrom] = useState("");
  const [episodeTo, setEpisodeTo] = useState("");

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    async function loadDevotionals() {
      try {
        setLoading(true);
        setError(null);

        const result = await getDevotionals({
          page,
          pageSize,
          search,
          sortBy,
          category,
          dateFrom,
          dateTo,
          episodeFrom,
          episodeTo,
        });

        setDevotionals(result.data);
        setTotalCount(result.count);
      } catch (error) {
        console.error("Failed to load devotionals:", error);
        setError("Unable to load previous devotionals.");
      } finally {
        setLoading(false);
      }
    }
    loadDevotionals();
  }, [
      pageSize,
      search,
      sortBy,
      category,
      dateFrom,
      dateTo,
      episodeFrom,
      episodeTo,
      page,
    ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    setPage(1);
  };

  const handleEpisodeFromChange = (value) => {
    setEpisodeFrom(value);
    setPage(1);
  };

  const handleEpisodeToChange = (value) => {
    setEpisodeTo(value);
    setPage(1);
  };

  return (
    <main className="previous-devotional-page min-h-screen bg-white">

      <PreviousDevotionalHero />

      <PreviousDevotionalToolbar
        search={search}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      <section className="mx-auto max-w-[1350px] px-6 pb-20 pt-20 lg:px-10">

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

          <PreviousDevotionalFilters
            category={category}
            onCategoryChange={handleCategoryChange}
            dateFrom={dateFrom}
            onDateFromChange={handleDateFromChange}
            dateTo={dateTo}
            onDateToChange={handleDateToChange}
            episodeFrom={episodeFrom}
            onEpisodeFromChange={handleEpisodeFromChange}
            episodeTo={episodeTo}
            onEpisodeToChange={handleEpisodeToChange}
            onClear={() => {
              setCategory("all");
              setDateFrom("");
              setDateTo("");
              setEpisodeFrom("");
              setEpisodeTo("");
              setPage(1);
            }}
          />

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
      {totalPages > 1 && (
        <section className="mx-auto max-w-[1350px] px-6 pb-6 lg:px-10">
          <PreviousDevotionalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      )}

      {/* CTA will be built later */}

    </main>
  );
}

export default PreviousDevotional;