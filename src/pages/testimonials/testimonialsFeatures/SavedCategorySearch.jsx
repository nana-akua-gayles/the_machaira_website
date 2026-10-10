import { useEffect, useRef, useState } from "react";
import { Search, X, Trash2 } from "lucide-react";

const STORAGE_KEY = "machaira_testimony_recent_categories_v1";
const readSaved = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((v) => typeof v === "string").slice(0, 15) : [];
  } catch { return []; }
};

export default function SavedCategorySearch({ activeCategory, onCategoryChange, categorySearch, onSearchChange }) {
  const [saved, setSaved] = useState(readSaved);
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState(null);
  const pressTimer = useRef(null);
  const didLongPress = useRef(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* private browsing */ }
  }, [saved]);
  useEffect(() => () => clearTimeout(pressTimer.current), []);

  function search(event) {
    event.preventDefault();
    const value = draft.trim().replace(/\s+/g, " ");
    if (!value) return;
    setSaved((old) => [value, ...old.filter((s) => s.toLowerCase() !== value.toLowerCase())].slice(0, 15));
    onCategoryChange("All Stories");
    onSearchChange(value);
    setMenu(null);
  }
  function choose(value) {
    if (didLongPress.current) { didLongPress.current = false; return; }
    onCategoryChange("All Stories");
    onSearchChange(value);
    setDraft(value);
    setMenu(null);
  }
  function remove(value) {
    setSaved((old) => old.filter((v) => v !== value));
    if (categorySearch.toLowerCase() === value.toLowerCase()) onSearchChange("");
    setMenu(null);
  }
  function startPress(value) {
    didLongPress.current = false;
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => { didLongPress.current = true; setMenu(value); }, 550);
  }
  function endPress() { clearTimeout(pressTimer.current); }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#4D5057]">Categories</span>
        {saved.length > 0 && <span className="text-[10px] text-[#6B7280]">Hold or right-click to remove</span>}
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" aria-label="Saved category searches">
        <button type="button" onClick={() => { onCategoryChange("All Stories"); onSearchChange(""); setDraft(""); setMenu(null); }}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${!categorySearch ? "border-[#991313] bg-[#991313] text-white" : "border-[#E5E7EB] bg-white text-[#4D5057]"}`}>All stories</button>
        {saved.map((value) => (
          <div key={value} className="relative shrink-0">
            <button type="button" onClick={() => choose(value)}
              onContextMenu={(e) => { e.preventDefault(); setMenu(value); }}
              onTouchStart={() => startPress(value)} onTouchEnd={endPress} onTouchCancel={endPress} onTouchMove={endPress}
              aria-label={`Search ${value}. Long press to remove.`}
              className={`rounded-full border px-4 py-2 text-xs font-medium ${categorySearch.toLowerCase() === value.toLowerCase() ? "border-[#991313] bg-[#F8EDED] text-[#991313]" : "border-[#E5E7EB] bg-white text-[#4D5057]"}`}>{value}</button>
          </div>
        ))}
        {saved.length === 0 && <span className="self-center whitespace-nowrap text-xs text-[#9CA3AF]">Your searches will appear here</span>}
      </div>
      {menu && <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8F7F5] px-3 py-2 text-xs">
        <span className="min-w-0 truncate text-[#4D5057]">{menu}</span>
        <div className="flex shrink-0 gap-3"><button type="button" onClick={() => remove(menu)} className="inline-flex items-center gap-1 font-semibold text-[#991313]"><Trash2 size={13}/> Delete</button><button type="button" onClick={() => setMenu(null)} aria-label="Close menu"><X size={15}/></button></div>
      </div>}
      <form onSubmit={search} className="flex min-w-0 items-center gap-2">
        <div className="relative min-w-0 flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"/>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search a category or topic" aria-label="Search category"
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-xs text-[#101A2B] outline-none focus:border-[#991313]" /></div>
        <button type="submit" disabled={!draft.trim()} className="shrink-0 rounded-full bg-[#991313] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Search</button>
      </form>
    </div>
  );
}
