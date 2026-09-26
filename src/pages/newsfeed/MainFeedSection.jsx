import React, { useState, useEffect } from "react";
import { 
  Globe, Megaphone, BookOpen, Heart, Calendar, 
  MoreHorizontal, Send, Loader2
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
    <div className="space-y-4">
      
      {/* =====================================================
          HORIZONTAL CATEGORIES BAR
      ====================================================== */}
      <div className="bg-white p-4 rounded-xl border border-black/5 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.label;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(item.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? "bg-[#fffaf5] text-burgundy-primary border border-burgundy-primary/20 shadow-xs"
                    : "text-charcoal-text hover:bg-black/5 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-burgundy-primary" : "opacity-70"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          SHARE YOUR STORY CARD 
      ====================================================== */}
      <div className="bg-linear-to-br from-burgundy-primary via-[#5a1827] to-[#3a0f18] text-white px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border border-white/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-medium tracking-tight">Share Your Story With Us</h3>
            <p className="text-[10px] sm:text-[11px] text-white/80 leading-relaxed font-light">
              Your testimony has the power to inspire and uplift someone today.
            </p>
          </div>

          <div className="shrink-0">
            <button className="w-full sm:w-auto bg-white hover:bg-[#fffaf5] text-burgundy-primary px-3.5 py-2 rounded-lg text-[10px] sm:text-[11px] font-medium transition shadow-sm flex items-center justify-center gap-1.5 group">
              <Send className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          FEED STATUS: LOADING, ERROR, OR EMPTY
      ====================================================== */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-black/5">
          <Loader2 className="w-6 h-6 animate-spin text-burgundy-primary mb-2" />
          <p className="text-xs text-cool-gray">Loading updates...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs text-center border border-red-100">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-black/5">
          <p className="text-xs text-cool-gray">No articles found in this category yet.</p>
        </div>
      )}

      {/* =====================================================
          ARTICLES FEED LIST (Narrower Picture Column)
      ====================================================== */}
      {!loading && articles.map((article) => (
        <article key={article.id} className="bg-white p-3.5 sm:p-4 rounded-xl border border-black/5 shadow-xs transition hover:shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-center">
            
            {/* Article Thumbnail - Reduced width (1 out of 4 columns on desktop) */}
            <div className="relative w-full h-32 sm:h-24 max-h-32 rounded-lg overflow-hidden bg-black/5 shrink-0">
              {article.image_url ? (
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover object-top" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">No Image</div>
              )}
            </div>

            {/* Article Content - Takes up 3 out of 4 columns on desktop */}
            <div className="sm:col-span-3 flex flex-col justify-between h-full py-0.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy-primary">
                    {article.category || "Article"}
                  </span>
                  <button className="text-cool-gray hover:text-charcoal-text">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 
                  onClick={() => onSelectStory && onSelectStory(article)}
                  className="text-xs sm:text-sm font-normal text-charcoal-text leading-snug mb-1 hover:text-burgundy-primary transition cursor-pointer line-clamp-1"
                >
                  {article.title}
                </h2>

                <p className="text-[11px] text-cool-gray leading-relaxed mb-2 line-clamp-2">
                  {article.body || "No content snippet available."}
                </p>
              </div>

              {/* Article Footer Metadata */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] text-cool-gray">
                <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : "Recent"}</span>
                <button 
                  onClick={() => onSelectStory && onSelectStory(article)}
                  className="text-burgundy-primary font-medium hover:underline text-[10px]"
                >
                  Read more →
                </button>
              </div>

            </div>

          </div>
        </article>
      ))}
    </div>
  );
}