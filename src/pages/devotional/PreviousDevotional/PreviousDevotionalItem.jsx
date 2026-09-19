import { Link } from "react-router-dom";
import fallbackImage from "../../../assets/devotionalImages/biblecoffee.jpg";

function PreviousDevotionalItem({ devotional }) {
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

  return (
    <article className="group relative">
      <Link
        to={`/devotional/${id}`}
        className="flex flex-col gap-6 py-7 transition-all duration-300 md:flex-row md:items-center md:gap-8"
      >
        {/* Episode number */}
        <div className="relative hidden h-[125px] w-[105px] shrink-0 overflow-hidden rounded-xl md:block">
          {/* Background image */}
          <img
            src={flyer_url || fallbackImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#101A2B]/55 transition-colors duration-300 group-hover:bg-[#991313]/65" />

          {/* Episode information */}
          <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Episode
            </span>

            <p className="text-2xl font-semibold tracking-[-0.04em]">
              {episode_number ?? "—"}
            </p>
          </div>
        </div>

        {/* Mobile metadata */}
        <div className="flex items-center gap-3 md:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#991313]">
            Episode {episode_number ?? "—"}
          </span>

          {category && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#B9BEC8]" />
              <span className="text-xs text-[#6B7280]">{category}</span>
            </>
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 hidden items-center gap-3 md:flex">
            {category && (
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#991313]">
                {category}
              </span>
            )}

            {category && date && (
              <span className="h-1 w-1 rounded-full bg-[#B9BEC8]" />
            )}

            {date && (
              <span className="text-xs text-[#6B7280]">
                {date}
              </span>
            )}
          </div>

          <h3 className="max-w-[720px] text-xl font-semibold leading-tight tracking-[-0.025em] text-[#101A2B] transition-colors duration-300 group-hover:text-[#991313] md:text-2xl">
            {title}
          </h3>

          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#6B7280] md:text-[15px]">
            {description}
            {description.length >= 150 ? "..." : ""}
          </p>

          {/* Mobile date */}
          {date && (
            <p className="mt-3 text-xs text-[#9CA3AF] md:hidden">
              {date}
            </p>
          )}
        </div>

        {/* Read action */}
        <div className="flex shrink-0 items-center gap-3 text-sm font-semibold text-[#991313]">
          <span className="hidden lg:inline">Read</span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B9BEC8] transition-all duration-300 group-hover:border-[#991313] group-hover:bg-[#991313] group-hover:text-white">
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
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default PreviousDevotionalItem;