
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "previousDevotionalCategories";

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function PreviousDevotionalFilters({
  category,
  onCategoryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  episodeFrom,
  onEpisodeFromChange,
  episodeTo,
  onEpisodeToChange,
}) {
  const [saved, setSaved] = useState(readSaved);
  const [draft, setDraft] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const hold = useRef(null);
  const held = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {}
  }, [saved]);

  useEffect(() => () => clearTimeout(hold.current), []);

  const choose = (value) => {
    if (held.current) {
      held.current = false;
      return;
    }
    setDeleteTarget(null);
    onCategoryChange(value);
  };

  const submit = (event) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;

    setSaved((prev) =>
      [value, ...prev.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 20)
    );
    onCategoryChange(value);
    setDraft("");
    setDeleteTarget(null);
  };

  const remove = (value) => {
    setSaved((prev) => prev.filter((item) => item !== value));
    if (category === value) onCategoryChange("all");
    setDeleteTarget(null);
  };

  const startHold = (value) => {
    held.current = false;
    clearTimeout(hold.current);
    hold.current = setTimeout(() => {
      held.current = true;
      setDeleteTarget(value);
    }, 550);
  };

  const stopHold = () => clearTimeout(hold.current);

  const chip = (active) =>
    `w-full select-none whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium lg:rounded-lg lg:text-left ${
      active
        ? "border-burgundy-primary bg-[#F9EAEA] text-burgundy-primary"
        : "border-[#E5E7EB] text-[#6B7280] hover:bg-black/[0.02]"
    }`;

  return (
    <aside className="w-full lg:w-[255px] lg:shrink-0">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-primary">
          Refine
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-navy-dark">
          Filter devotionals
        </h2>
      </div>

      <div className="border-t border-black/[0.08] py-5">
        <h3 className="mb-3 text-sm font-semibold text-navy-dark">Category</h3>

        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] lg:flex-col lg:gap-1 lg:overflow-visible">
          <button
            type="button"
            onClick={() => choose("all")}
            className={`shrink-0 ${chip(category === "all")}`}
          >
            All Categories
          </button>

          {saved.map((value) =>
            deleteTarget === value ? (
              <div
                key={value}
                className="flex shrink-0 items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 lg:w-full lg:rounded-lg"
              >
                <span className="max-w-[90px] truncate px-2 text-xs text-[#6B7280]">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => remove(value)}
                  className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-full px-2.5 py-1 text-xs text-[#6B7280]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div key={value} className="shrink-0 lg:w-full">
                <button
                  type="button"
                  onClick={() => choose(value)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setDeleteTarget(value);
                  }}
                  onTouchStart={() => startHold(value)}
                  onTouchEnd={stopHold}
                  onTouchCancel={stopHold}
                  onTouchMove={stopHold}
                  onMouseDown={() => startHold(value)}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                  className={chip(category === value)}
                >
                  {value}
                </button>
              </div>
            )
          )}
        </div>

        <form onSubmit={submit} className="mt-3">
          <label
            htmlFor="previous-category-search"
            className="mb-2 block text-xs font-medium text-[#6B7280]"
          >
            Search another category
          </label>
          <div className="flex min-w-0 gap-2">
            <input
              id="previous-category-search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search category..."
              className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none focus:border-burgundy-primary"
            />
            <button
              type="submit"
              className="rounded-xl bg-burgundy-primary px-3 text-xs font-semibold text-white"
            >
              Search
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-[#6B7280]">
            Recent searches are saved on this device. Long-press or right-click to delete.
          </p>
        </form>
      </div>

      <div className="hidden border-t border-black/[0.08] py-6 lg:block">
        <h3 className="mb-4 text-sm font-semibold text-navy-dark">Date Range</h3>
        <div className="grid gap-3">
          <label className="text-xs text-[#6B7280]">
            From
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"
            />
          </label>
          <label className="text-xs text-[#6B7280]">
            To
            <input
              type="date"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-black/[0.08] py-5">
        <h3 className="mb-3 text-sm font-semibold text-navy-dark">Episode number</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-[#6B7280]">
            From
            <input
              type="number"
              min="1"
              value={episodeFrom}
              onChange={(event) => onEpisodeFromChange(event.target.value)}
              placeholder="1"
              className="mt-2 w-full min-w-0 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"
            />
          </label>
          <label className="text-xs text-[#6B7280]">
            To
            <input
              type="number"
              min="1"
              value={episodeTo}
              onChange={(event) => onEpisodeToChange(event.target.value)}
              placeholder="1334"
              className="mt-2 w-full min-w-0 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}

export default PreviousDevotionalFilters;
