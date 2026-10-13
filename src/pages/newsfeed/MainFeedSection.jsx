import React, { useState, useEffect } from "react";
import { 
  Globe, Megaphone, BookOpen, Heart, Calendar, 
  ArrowUpRight, Loader2
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function MainFeedSection({ onSelectStory }) {
  const [activeCategory, setActiveCategory] = useState("All Updates");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories list with icons matching your database categories
  const categories = [
    { label: "All Updates", icon: Globe },
    { label: "Announcements", icon: Megaphone, dbValue: "ANNOUNCEMENTS" },
    { label: "Teachings", icon: BookOpen, dbValue: "TEACHINGS" },
    { label: "Testimonies", icon: Heart, dbValue: "TESTIMONIES" },
    { label: "Events", icon: Calendar, dbValue: "EVENTS" },
  ];

  // Fetch latest 5 articles from Supabase whenever the active category changes
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3); 

        // If a specific category is selected (not "All Updates"), filter the query
        if (activeCategory !== "All Updates") {
          const selectedCat = categories.find(c => c.label === activeCategory);
          if (selectedCat && selectedCat.dbValue) {
            query = query.eq('category', selectedCat.dbValue);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error("Error fetching articles:", err.message);
        setError("Failed to load feed updates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeCategory]);

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#991313]">02 / The Latest</span>
        <span className="h-px flex-1 bg-[#B9BEC8]/60" />
      </div>
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-3 snap-x" aria-label="Filter stories by category">
        {categories.map((item) => {
          const Icon = item.icon;
          const selected = activeCategory === item.label;
          return (
            <button key={item.label} type="button" onClick={() => setActiveCategory(item.label)} aria-pressed={selected}
              className={`shrink-0 snap-start inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold transition-colors ${selected ? "bg-[#101A2B] border-[#101A2B] text-white" : "bg-white border-[#B9BEC8]/60 text-[#4D5057] hover:border-[#991313]"}`}>
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {loading && <div className="min-h-56 grid place-content-center gap-3 text-center bg-[#F7F7F6] rounded-2xl"><Loader2 className="animate-spin mx-auto text-[#991313]" /><span className="text-sm text-[#4D5057]">Gathering the latest...</span></div>}
        {error && <p role="alert" className="p-6 rounded-2xl bg-red-50 text-[#991313] text-sm">{error}</p>}
        {!loading && !error && articles.length === 0 && <p className="p-8 text-center bg-[#F7F7F6] rounded-2xl text-sm text-[#4D5057]">No stories in this category yet.</p>}
        {!loading && !error && articles.map((article, index) => (
          <button key={article.id} type="button" onClick={() => onSelectStory?.(article)}
            className="group w-full h-44 sm:h-52 text-left flex gap-4 sm:gap-5 items-start overflow-hidden rounded-2xl border border-[#B9BEC8]/35 bg-[#FAFAF9] p-3 sm:p-4 transition-all hover:border-[#991313]/35 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#991313]">
            <div className="relative shrink-0 w-[108px] sm:w-[150px] h-full rounded-xl overflow-hidden bg-[#E9E9E9]">
              {article.image_url ? <img src={article.image_url} alt="" loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" /> : <div className="h-full grid place-content-center text-[#4D5057]"><BookOpen size={26} /></div>}
              <span className="absolute left-2 bottom-2 text-white/80 text-[10px] font-bold bg-[#101A2B]/75 rounded-full px-2 py-1">0{index + 1}</span>
            </div>
            <div className="min-w-0 flex-1 self-stretch flex flex-col py-1">
              <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.13em] text-[#991313]">
                <span className="truncate">{article.category || "Article"}</span>
                <ArrowUpRight size={17} className="shrink-0 text-[#101A2B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="mt-2 text-[15px] sm:text-xl font-semibold leading-[1.3] tracking-[-0.035em] text-[#101A2B] line-clamp-3 group-hover:text-[#991313] transition-colors">{article.title}</h3>
              <p className="hidden sm:block mt-2 text-xs leading-relaxed text-[#4D5057] line-clamp-2">{article.body || "Read the full story"}</p>
              <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-[10px] text-[#4D5057]">
                <time>{article.created_at ? new Date(article.created_at).toLocaleDateString() : "Recent"}</time>
                <span className="font-bold text-[#991313]">Read →</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
