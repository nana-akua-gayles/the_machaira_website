<<<<<<< HEAD
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
    onClear,
}) {

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Faith", value: "Faith" },
    { label: "Healing", value: "Healing" },
    { label: "Liberty", value: "Liberty" },
    { label: "Hope", value: "Hope" },
  ];


  return (
    <aside className="w-full lg:w-[255px] lg:shrink-0">

      {/* Header */}
      <div className="mb-7 flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-primary">
            Filter devotionals
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-navy-dark">
          Category
        </h3>

        <div className="space-y-3">

        {categories.map((item) => {
          const isActive = category === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className="flex w-full items-center gap-3 py-2 text-left"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isActive
                    ? "border-burgundy-primary"
                    : "border-soft-gray"
                }`}
              >
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-burgundy-primary" />
                )}
              </span>

              <span
                className={`text-sm ${
                  isActive
                    ? "font-medium text-navy-dark"
                    : "text-[#6B7280]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        </div>
      
      <div className="mt-5 border-t border-[#E5E7EB] pt-5">
        <label
          htmlFor="category-search"
          className="mb-2 block text-xs font-medium text-[#6B7280]"
        >
          Search another category
        </label>

        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <input
            id="category-search"
            type="text"
            value={
              categories.some((item) => item.value === category)
                ? ""
                : category
            }
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            placeholder="Search category..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-charcoal-text outline-none transition placeholder:text-[#9CA3AF] focus:border-burgundy-primary"
          />
        </div>
      </div>
      </div>

      {/* Date Range */}
      <div className="border-t border-black/[0.08] py-6">

        <h3 className="mb-4 text-sm font-semibold text-navy-dark">
          Date Range
        </h3>

        <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            From
          </label>

          <input
            type="date"
            value={dateFrom}
            onChange={(event) =>
              onDateFromChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none transition focus:border-burgundy-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            To
          </label>

          <input
            type="date"
            value={dateTo}
            onChange={(event) =>
              onDateToChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none transition focus:border-burgundy-primary"
          />
        </div>
      </div>
      </div>

      {/* Episode Number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            From
          </label>

          <input
            type="number"
            min="1"
            value={episodeFrom}
            onChange={(event) =>
              onEpisodeFromChange(event.target.value)
            }
            placeholder="1"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none transition focus:border-burgundy-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#6B7280]">
            To
          </label>

          <input
            type="number"
            min="1"
            value={episodeTo}
            onChange={(event) =>
              onEpisodeToChange(event.target.value)
            }
            placeholder="1334"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none transition focus:border-burgundy-primary"
          />
        </div>
      </div>

    </aside>
  );
=======
import { useEffect, useRef, useState } from "react";
const STORAGE_KEY = "machaira_previous_devotional_categories_v1";
function readSaved() { try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => typeof x === "string" && x.trim() && x !== "all").slice(0, 20) : [];
>>>>>>> d355de247515715790a1a24934e8df943aab5721
}
catch {
    return [];
} }
function PreviousDevotionalFilters({ category, onCategoryChange, dateFrom, onDateFromChange, dateTo, onDateToChange, episodeFrom, onEpisodeFromChange, episodeTo, onEpisodeToChange, onClear }) {
    const [saved, setSaved] = useState(readSaved);
    const [draft, setDraft] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const hold = useRef(null);
    const held = useRef(false);
    useEffect(() => { try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    catch { } }, [saved]);
    useEffect(() => () => clearTimeout(hold.current), []);
    const choose = (v) => { if (held.current) {
        held.current = false;
        return;
    } setDeleteTarget(null); onCategoryChange(v); };
    const submit = e => { e.preventDefault(); const value = draft.trim(); if (!value)
        return; setSaved(prev => [value, ...prev.filter(x => x.toLowerCase() !== value.toLowerCase())].slice(0, 20)); onCategoryChange(value); setDraft(""); setDeleteTarget(null); };
    const remove = v => { setSaved(prev => prev.filter(x => x !== v)); if (category === v)
        onCategoryChange("all"); setDeleteTarget(null); };
    const startHold = v => { held.current = false; clearTimeout(hold.current); hold.current = setTimeout(() => { held.current = true; setDeleteTarget(v); }, 550); };
    const stopHold = () => clearTimeout(hold.current);
    return <aside className="w-full lg:w-[255px] lg:shrink-0">
  <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-primary">Refine</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-navy-dark">Filter devotionals</h2></div><button type="button" onClick={() => { setDraft(""); setDeleteTarget(null); onClear(); }} className="shrink-0 text-xs font-medium text-burgundy-primary hover:underline">Clear filters</button></div>
  <div className="border-t border-black/[0.08] py-5"><h3 className="mb-3 text-sm font-semibold text-navy-dark">Category</h3>
   <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] lg:flex-col lg:gap-1 lg:overflow-visible">
    <button type="button" onClick={() => choose("all")} className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium lg:w-full lg:rounded-lg lg:text-left ${category === "all" ? "border-burgundy-primary bg-[#F9EAEA] text-burgundy-primary" : "border-[#E5E7EB] text-[#6B7280]"}`}>All Categories</button>
    {saved.map(v => <div key={v} className="relative shrink-0 lg:w-full"><button type="button" onClick={() => choose(v)} onContextMenu={e => { e.preventDefault(); setDeleteTarget(v); }} onTouchStart={() => startHold(v)} onTouchEnd={stopHold} onTouchCancel={stopHold} onTouchMove={stopHold} onMouseDown={() => startHold(v)} onMouseUp={stopHold} onMouseLeave={stopHold} className={`w-full whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium select-none lg:rounded-lg lg:text-left ${category === v ? "border-burgundy-primary bg-[#F9EAEA] text-burgundy-primary" : "border-[#E5E7EB] text-[#6B7280]"}`}>{v}</button>{deleteTarget === v && <div className="absolute left-0 top-full z-20 mt-1 flex gap-1 rounded-lg border bg-white p-1 shadow-lg"><button type="button" onClick={() => remove(v)} className="rounded px-2 py-1 text-xs text-red-700">Delete</button><button type="button" onClick={() => setDeleteTarget(null)} className="rounded px-2 py-1 text-xs text-[#6B7280]">Cancel</button></div>}</div>)}
   </div>
   <form onSubmit={submit} className="mt-3"><label htmlFor="previous-category-search" className="mb-2 block text-xs font-medium text-[#6B7280]">Search another category</label><div className="flex min-w-0 gap-2"><input id="previous-category-search" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Search category..." className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-charcoal-text outline-none focus:border-burgundy-primary"/><button type="submit" className="rounded-xl bg-burgundy-primary px-3 text-xs font-semibold text-white">Search</button></div><p className="mt-2 text-[11px] leading-4 text-[#6B7280]">Recent searches are saved on this device. Long-press or right-click to delete.</p></form>
  </div>
  <div className="hidden border-t border-black/[0.08] py-6 lg:block"><h3 className="mb-4 text-sm font-semibold text-navy-dark">Date Range</h3><div className="grid gap-3"><label className="text-xs text-[#6B7280]">From<input type="date" value={dateFrom} onChange={e => onDateFromChange(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"/></label><label className="text-xs text-[#6B7280]">To<input type="date" value={dateTo} onChange={e => onDateToChange(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"/></label></div></div>
  <div className="border-t border-black/[0.08] py-5"><h3 className="mb-3 text-sm font-semibold text-navy-dark">Episode number</h3><div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#6B7280]">From<input type="number" min="1" value={episodeFrom} onChange={e => onEpisodeFromChange(e.target.value)} placeholder="1" className="mt-2 w-full min-w-0 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"/></label><label className="text-xs text-[#6B7280]">To<input type="number" min="1" value={episodeTo} onChange={e => onEpisodeToChange(e.target.value)} placeholder="1334" className="mt-2 w-full min-w-0 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-charcoal-text"/></label></div></div>
 </aside>;
}
export default PreviousDevotionalFilters;
