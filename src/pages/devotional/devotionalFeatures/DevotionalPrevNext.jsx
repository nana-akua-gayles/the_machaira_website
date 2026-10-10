import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function EpisodeCard({ item, direction }) {
  const isNext = direction === "next";
  const Icon = isNext ? ChevronRight : ChevronLeft;

  return (
    <Link
      to={`/devotional/${item.id}`}
      className={`group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${
        isNext
          ? "border border-rose-500/20 bg-gradient-to-br from-[#4a0b13] via-[#7a1020] to-[#2d070c] text-white shadow-lg shadow-rose-950/20 hover:border-rose-400/40 hover:shadow-xl hover:shadow-rose-900/30 sm:col-start-2 sm:flex-row-reverse sm:text-right"
          : "border border-rose-900/10 bg-gradient-to-br from-[#fffafa] via-[#fff0f2] to-[#fce4e8] text-slate-900 shadow-md hover:border-rose-300/80 hover:shadow-lg hover:shadow-rose-900/10 text-left"
      }`}
    >
      {/* Subtle background ambient blur */}
      <span
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl transition-transform duration-500 group-hover:scale-150 ${
          isNext ? "bg-rose-400/20" : "bg-rose-300/30"
        }`}
      />

      {/* Content Details */}
      <div className="relative z-10 flex min-w-0 flex-col justify-center gap-0.5">
        <span
          className={`text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] ${
            isNext ? "text-rose-200/80" : "text-rose-900/80"
          }`}
        >
          {isNext ? "Next Episode" : "Previous Episode"}
        </span>
        <h4 className="truncate text-sm font-semibold tracking-tight sm:text-[15px]">
          {item.title}
        </h4>
        <span
          className={`text-[11px] font-medium tracking-wide ${
            isNext ? "text-rose-200/60" : "text-rose-800/70"
          }`}
        >
          {item.date}
        </span>
      </div>

      {/* Dynamic Action Button */}
      <div className="relative z-10 flex-shrink-0">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
            isNext
              ? "bg-white/10 text-white backdrop-blur-md group-hover:bg-white group-hover:text-rose-950"
              : "bg-rose-950/10 text-rose-950 backdrop-blur-md group-hover:bg-rose-950 group-hover:text-white"
          }`}
        >
          <Icon className={`h-4 w-4 transition-transform duration-300 ${isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`} />
        </span>
      </div>
    </Link>
  );
}

export default function DevotionalPrevNext({ previous, next }) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Episode navigation" className="mx-auto mt-12 max-w-3xl grid grid-cols-1 gap-3 sm:grid-cols-2">
      {previous && <EpisodeCard item={previous} direction="previous" />}
      {next && <EpisodeCard item={next} direction="next" />}
    </nav>
  );
}