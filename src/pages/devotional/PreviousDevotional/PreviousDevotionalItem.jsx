import { Link } from "react-router-dom";
import fallbackImage from "../../../assets/devotionalImages/devotionalfallback.jpg";

function PreviousDevotionalItem({ devotional, viewMode = "list" }) {
  const {
    id,
    title,
    category,
    episode_number,
    created_at,
    excerpt,
    flyer_url,
    pure_content,
  } = devotional;

  const date = created_at
    ? new Date(created_at).toLocaleDateString("en-GH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const description =
    excerpt ||
    pure_content?.replace(/\s+/g, " ").trim().slice(0, 150) ||
    "Explore this devotional and spend time reflecting on God's Word.";

  const isGrid = viewMode === "grid";

  return (
    <article
      className={`group relative ${
        isGrid
          ? "h-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-burgundy-primary/30 hover:shadow-[0_14px_35px_rgba(16,26,43,0.08)]"
          : "border-b border-[#E5E7EB] last:border-b-0"
      }`}
    >
      <Link
        to={`/devotional/${id}`}
<<<<<<< HEAD
        className={
          isGrid
            ? "flex h-full flex-col"
            : "flex flex-col gap-6 py-7 transition-all duration-300 md:flex-row md:items-center md:gap-8"
        }
      >
        {/* Image and episode */}
        <div
          className={
            isGrid
              ? "relative aspect-[16/10] overflow-hidden bg-[#f4eee8]"
              : "relative hidden h-[125px] w-[105px] shrink-0 overflow-hidden rounded-xl md:block"
          }
        >
=======
        className="flex items-start gap-3 py-5 transition-all duration-300 sm:gap-5 md:items-center md:gap-8 md:py-7"
      >
        {/* Episode number */}
        <div className="relative h-[112px] w-[92px] shrink-0 overflow-hidden rounded-xl sm:h-[125px] sm:w-[105px]">
          {/* Background image */}
>>>>>>> d355de247515715790a1a24934e8df943aab5721
          <img
            src={flyer_url || fallbackImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

<<<<<<< HEAD
        {/* Content */}
        <div
          className={
            isGrid
              ? "flex flex-1 flex-col p-5 sm:p-6"
              : "min-w-0 flex-1"
          }
        >
          {/* Metadata */}
          <div
            className={`mb-3 flex flex-wrap items-center gap-2 ${
              isGrid ? "" : "md:mb-2 md:gap-3"
            }`}
          >
=======
        {/* Mobile metadata */}
        <div className="hidden items-center gap-3 md:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy-primary">
            Episode {episode_number ?? "—"}
          </span>

          {category && (
            <>
              <span className="h-1 w-1 rounded-full bg-soft-gray" />
              <span className="text-xs text-[#6B7280]">{category}</span>
            </>
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 hidden items-center gap-3 md:flex">
>>>>>>> d355de247515715790a1a24934e8df943aab5721
            {category && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary">
                {category}
              </span>
            )}

            {category && date && (
              <span className="h-1 w-1 rounded-full bg-soft-gray" />
            )}

            {date && (
              <span className="text-xs text-[#6B7280]">
                {date}
              </span>
            )}
          </div>

<<<<<<< HEAD
          <h3
            className={`font-semibold leading-tight tracking-[-0.025em] text-navy-dark transition-colors duration-300 group-hover:text-burgundy-primary ${
              isGrid
                ? "text-lg sm:text-xl"
                : "max-w-[520px] text-sm md:text-xl"
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-3 text-sm leading-6 text-[#6B7280] ${
              isGrid
                ? "line-clamp-3"
                : "max-w-[720px] md:text-[15px]"
            }`}
          >
=======
          <h3 className="max-w-[720px] text-base font-semibold sm:text-xl leading-tight tracking-[-0.025em] text-navy-dark transition-colors duration-300 group-hover:text-burgundy-primary md:text-2xl">
            {title}
          </h3>

          <p className="mt-2 line-clamp-3 max-w-[720px] text-xs leading-5 sm:mt-3 sm:text-sm sm:leading-6 text-[#6B7280] md:text-[15px]">
>>>>>>> d355de247515715790a1a24934e8df943aab5721
            {description}
            {!isGrid && description.length >= 40 ? "..." : ""}
          </p>

          {/* Read action */}
          <div
            className={`flex items-center gap-3 text-sm font-semibold text-burgundy-primary ${
              isGrid ? "mt-auto pt-5" : "mt-5 shrink-0 md:mt-0"
            }`}
          >
            <span>{isGrid ? "Read Devotional" : "Read"}</span>

<<<<<<< HEAD
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-soft-gray transition-all duration-300 group-hover:border-burgundy-primary group-hover:bg-burgundy-primary group-hover:text-white">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
=======
        {/* Read action */}
        <div className="hidden shrink-0 items-center gap-3 text-sm font-semibold text-burgundy-primary sm:flex">
          <span className="hidden lg:inline">Read</span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-soft-gray transition-all duration-300 group-hover:border-burgundy-primary group-hover:bg-burgundy-primary group-hover:text-white">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
>>>>>>> d355de247515715790a1a24934e8df943aab5721
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12H19M19 12L13 6M19 12L13 18" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default PreviousDevotionalItem;

