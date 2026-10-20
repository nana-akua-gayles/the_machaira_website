
import { useEffect, useState } from "react";
import {
  FORUM_CATEGORIES,
  getCategoryCounts,
} from "../../../lib/forumService";

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const DiscussionCategory = ({ selectedCategory, onSelectCategory }) => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      try {
        const data = await getCategoryCounts();
        if (!cancelled) setCounts(data);
      } catch (err) {
        console.error("CATEGORY COUNTS FAILED:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalCount = Object.values(counts).reduce(
    (sum, n) => sum + n,
    0
  );

  const categories = [
    { label: "All Discussions", count: totalCount },
    ...FORUM_CATEGORIES.map((label) => ({
      label,
      count: counts[label] || 0,
    })),
  ];

  return (
    <aside className="min-w-0 bg-transparent lg:space-y-4 lg:rounded-2xl lg:border lg:border-[#B9BEC8]/30 lg:bg-white lg:p-5 lg:shadow-sm">
      <h3 className="mb-2 text-sm font-bold text-[#101A2B] lg:mb-0 lg:text-base">
        Categories
      </h3>

      <nav
        aria-label="Discussion categories"
        className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-1 lg:overflow-visible lg:pb-0"
      >
        {categories.map((cat) => {
          const active = cat.label === selectedCategory;

          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSelectCategory(cat.label)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2.5 text-xs font-medium transition-all lg:w-full lg:justify-between lg:rounded-xl lg:border-transparent ${
                active
                  ? "border-[#991313] bg-[#991313] font-semibold text-white lg:border-transparent lg:bg-[#FBF0F0] lg:text-[#991313]"
                  : "border-[#B9BEC8]/60 bg-white text-[#4D5057] hover:border-[#991313] hover:text-[#991313] lg:border-transparent"
              }`}
            >
              <span>{cat.label}</span>

              <span
                className={`hidden text-[11px] lg:inline ${
                  active
                    ? "font-bold text-[#991313]"
                    : "text-[#4D5057]"
                }`}
              >
                {loading ? "..." : formatCount(cat.count)}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DiscussionCategory;
