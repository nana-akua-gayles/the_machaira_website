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
          <img
            src={flyer_url || fallbackImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

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

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-soft-gray transition-all duration-300 group-hover:border-burgundy-primary group-hover:bg-burgundy-primary group-hover:text-white">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
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

