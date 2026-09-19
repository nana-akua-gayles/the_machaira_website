function PreviousDevotionalPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];

    // Small number of pages — show everything
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Near the beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    // Near the end
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Somewhere in the middle
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Previous devotionals pagination"
      className="flex w-full items-center justify-between border border-[#E5E7EB] bg-white px-5 py-4 md:px-7"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group flex items-center gap-2 text-sm font-medium text-[#101A2B] transition-colors hover:text-[#991313] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#101A2B]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>

        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((pageNumber, index) => {
          if (
            pageNumber === "ellipsis" ||
            pageNumber === "ellipsis-end"
          ) {
            return (
              <span
                key={`${pageNumber}-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-[#6B7280]"
              >
                ...
              </span>
            );
          }

          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#991313] text-white"
                  : "text-[#101A2B] hover:bg-[#F9EAEA] hover:text-[#991313]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-2 text-sm font-medium text-[#101A2B] transition-colors hover:text-[#991313] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#101A2B]"
      >
        <span className="hidden sm:inline">Next</span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default PreviousDevotionalPagination;