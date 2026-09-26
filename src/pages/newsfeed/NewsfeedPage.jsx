import React, { useState, useEffect } from "react";
import MainFeedSection from "./MainFeedSection";
import AllArticlesArchive from "./AllArticlesArchive"; // Import the separate component
import { supabase } from "../../lib/supabaseClient";
import ApostlesImage from "../../assets/images/Apostle2.jpg";

export default function NewsfeedPage() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Fetch the latest active featured article (Strictly permanent hero)
  useEffect(() => {
    async function fetchFeaturedStory() {
      try {
        setLoadingHero(true);
        const { data, error } = await supabase
          .from("featured_articles")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFeaturedStory({
            id: data.id,
            title: data.title,
            subtitle: data.subtitle || "WEEKLY FEATURE",
            body: data.body,
            image_url: ApostlesImage,
            isFeatured: true,
            created_at: data.created_at,
          });
        }
      } catch (err) {
        console.error("Error fetching featured article:", err.message);
      } finally {
        setLoadingHero(false);
      }
    }

    fetchFeaturedStory();
  }, []);

  // Lock/Unlock body scroll when read view opens/closes
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  // Handler when a user clicks any story from MainFeedSection or Bottom Archive
  const handleSelectStory = (article) => {
    setActiveStory({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle || (article.category ? article.category.toUpperCase() : "ARTICLE"),
      body: article.body,
      image_url: article.image_url || ApostlesImage,
      isFeatured: article.isFeatured,
    });
    setIsExpanded(true);
  };

  // Helper to split text for dual drop-caps
  const formatDualDropCapText = (text) => {
    const cleanText = text ? text.replace(/\\n/g, '\n') : "";
    if (!cleanText) return { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

    const midpoint = Math.floor(cleanText.length / 2);
    let breakIndex = cleanText.indexOf('.', midpoint);
    if (breakIndex === -1) breakIndex = midpoint;

    const firstChunk = cleanText.slice(0, breakIndex + 1).trim();
    const secondChunk = cleanText.slice(breakIndex + 1).trim();

    return {
      part1Letter: firstChunk.charAt(0),
      part1Rest: firstChunk.slice(1),
      part2Letter: secondChunk.length > 0 ? secondChunk.charAt(0) : "",
      part2Rest: secondChunk.length > 0 ? secondChunk.slice(1) : "",
    };
  };

  const articleTextParts = activeStory ? formatDualDropCapText(activeStory.body) : { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

  return (
    <main className="min-h-screen bg-[#FBF9F4] px-4 py-6 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* MAIN PAGE GRID (2 Columns: Hero Feature & Main Feed) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          {/* =====================================================
              HERO / READING AREA (5 Columns) - Strictly Featured Only
          ====================================================== */}
          <section
            className="
              lg:col-span-5
              overflow-hidden
              rounded-[22px]
              border
              border-black/5
              shadow-sm
              relative
            "
          >
            {loadingHero ? (
              <div className="h-72 flex items-center justify-center text-xs text-stone-400 bg-white">
                Loading reading area...
              </div>
            ) : featuredStory ? (
              <div className="relative w-full max-h-115 sm:max-h-130 overflow-hidden bg-black">
                
                {/* Image top-framed */}
                <img
                  src={featuredStory.image_url}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover object-top"
                />

                {/* Dark Glass Card Spanning Edge-to-Edge from Middle to Bottom */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-black/85 backdrop-blur-xl border-t border-white/25 p-4 sm:p-5 flex flex-col justify-between shadow-2xl text-white overflow-hidden">
                  <div className="space-y-1.5 overflow-hidden flex-1 flex flex-col">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary shrink-0 block">
                      {featuredStory.subtitle}
                    </span>

                    <h1 className="text-xs sm:text-sm leading-tight shrink-0">
                      {featuredStory.title}
                    </h1>

                    {featuredStory.body && (
                      <div className="text-[10px] text-white/90 leading-relaxed whitespace-pre-line overflow-hidden flex-1">
                        {featuredStory.body.replace(/\\n/g, '\n')}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 shrink-0 border-t border-white/15 mt-2">
                    <button
                      onClick={() => handleSelectStory(featuredStory)}
                      className="text-[10px] font-medium text-burgundy-primary hover:text-white transition inline-flex items-center gap-1 group"
                    >
                      Read Full Article <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-stone-400 bg-white">
                No featured article available.
              </div>
            )}
          </section>

          {/* =====================================================
              MAIN FEED SECTION (7 Columns)
          ====================================================== */}
          <section className="lg:col-span-7">
            <MainFeedSection onSelectStory={handleSelectStory} />
          </section>

        </div>

        {/* =====================================================
            BOTTOM SECTION: ALL ARTICLES ARCHIVE COMPONENT
        ====================================================== */}
        <AllArticlesArchive onSelectStory={handleSelectStory} />

      </div>

      {/* =====================================================
          CREATIVE EDITORIAL MAGAZINE OVERLAY (Modal)
      ====================================================== */}
      {isExpanded && activeStory && (
        <div className="fixed inset-0 z-9999 bg-[#0c0a09]/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in duration-300">
          
          {/* Top Minimalist Header bar */}
          <header className="w-full px-6 sm:px-12 py-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-burgundy-primary animate-pulse"></span>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase">
                {activeStory.subtitle}
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center text-xs transition-all group"
              aria-label="Close reading"
            >
              <span className="group-hover:rotate-90 transition-transform">✕</span>
            </button>
          </header>

          {/* Scrollable Editorial Magazine Body */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-4xl space-y-8">
              
              {/* Title & Metadata Section */}
              <div className="space-y-3 text-center lg:text-left border-b border-white/10 pb-6">
                <h1 className="text-3xl sm:text-5xl text-white tracking-tight leading-[1.15]">
                  {activeStory.title}
                </h1>
                <div>
                  <span className="uppercase tracking-widest text-burgundy-primary font-semibold text-xs">
                    {activeStory.isFeatured ? "Featured Article of the Week" : "Newsfeed Update"}
                  </span>
                </div>
              </div>

              {/* Part 1: Top Section (Image Left, Text Right with First Drop Cap) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                
                {/* Left Side: Image Card */}
                <div className="lg:col-span-5 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group">
                  <img
                    src={activeStory.image_url}
                    alt={activeStory.title}
                    className="w-full h-75 sm:h-95 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Right Side: First Half of Text with Red Drop Cap */}
                <div className="lg:col-span-7">
                  {activeStory.body && (
                    <div className="text-base sm:text-lg text-white/90 leading-relaxed whitespace-pre-line font-light tracking-wide">
                      <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
                        {articleTextParts.part1Letter}
                      </span> 
                      {articleTextParts.part1Rest}
                    </div>
                  )}
                </div>

              </div>

              {/* Part 2: Bottom Section (Full Width, Left Aligned with Second Drop Cap) */}
              {articleTextParts.part2Letter && (
                <div className="pt-6 border-t border-white/10">
                  <div className="text-base sm:text-lg text-white/90 leading-relaxed whitespace-pre-line font-light tracking-wide">
                    <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
                      {articleTextParts.part2Letter}
                    </span>
                    {articleTextParts.part2Rest}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer Minimalist Bar */}
          <footer className="w-full py-4 px-6 border-t border-white/10 bg-black/80 text-center text-xs text-white/40 tracking-widest uppercase shrink-0">
            End of Article • Press Close to Return
          </footer>

        </div>
      )}
    </main>
  );
}