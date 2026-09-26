import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ArrowUpRight, Loader2 } from "lucide-react";

export default function AllArticlesArchive({ onSelectStory, excludeIds = [] }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const excludeRef = useRef(excludeIds);
  excludeRef.current = excludeIds;

  useEffect(() => {
    fetchArchiveBatch(0, true);
  }, []); 

  async function fetchArchiveBatch(pageNumber, reset = false) {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }

      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("articles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      const currentExclusions = excludeRef.current || [];
      if (currentExclusions.length > 0 && currentExclusions.length < 100) {
        const validIds = currentExclusions.filter(Boolean);
        if (validIds.length > 0) {
          query = query.not("id", "in", `(${validIds.join(",")})`);
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const formatted = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.category ? item.category.toUpperCase() : "ARTICLE",
        body: item.body,
        created_at: item.created_at,
        isFeatured: false,
      }));

      if (reset) {
        setArticles(formatted);
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const uniqueNew = formatted.filter(a => !existingIds.has(a.id));
          return [...prev, ...uniqueNew];
        });
      }

      if (count !== null && from + formatted.length >= count) {
        setHasMore(false);
      } else if (formatted.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Error fetching archive batch:", err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArchiveBatch(nextPage, false);
  };

  return (
    <section className="mt-20 pt-12 pb-8 border-t border-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900 font-serif">
            The Archives
          </h2>
        </div>
        <div className="text-xs text-gray-500">
          Explore our previous articles & prior teachings
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-red-800" />
          Loading archive...
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400 uppercase tracking-wider">
          No additional records found in the archive.
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {articles.map((article, index) => (
              <article 
                key={`${article.id}-${index}`}
                onClick={() => onSelectStory(article)}
                className="py-6 sm:py-7 group cursor-pointer hover:bg-gray-50 px-3 rounded transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  
                  {/* Left Meta */}
                  <div className="lg:col-span-3 flex lg:flex-col justify-between items-center lg:items-start gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-red-800">
                      {article.subtitle}
                    </span>
                    <time className="text-xs text-gray-400">
                      {article.created_at ? new Date(article.created_at).toLocaleDateString() : "Recent"}
                    </time>
                  </div>

                  {/* Right Content */}
                  <div className="lg:col-span-9 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base sm:text-lg text-gray-900 font-serif group-hover:text-red-800 transition-colors">
                        {article.title}
                      </h3>
                      <span className="shrink-0 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:bg-red-800 group-hover:border-red-800 group-hover:text-white transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {article.body || "No preview available."}
                    </p>
                  </div>

                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="pt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:border-red-800 hover:text-red-800 transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loadingMore && <Loader2 className="w-3 h-3 animate-spin" />}
                Load More Articles
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}