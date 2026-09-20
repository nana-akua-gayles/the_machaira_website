import React, { useState, useEffect } from "react";
import MainFeedSection from "./MainFeedSection";
import { supabase } from "../../lib/supabaseClient";
import ApostlesImage from "../../assets/images/Apostle2.jpg";

export default function NewsfeedPage() {
  const [activeStory, setActiveStory] = useState(null);
  const [defaultFeatured, setDefaultFeatured] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Fetch the latest active featured article ordered by created_at
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
          const featuredData = {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle || "WEEKLY FEATURE",
            body: data.body,
            image_url: ApostlesImage,
            isFeatured: true,
          };
          setDefaultFeatured(featuredData);
          setActiveStory(featuredData);
        } else {
          // Fallback if no active featured article exists
          const fallbackData = {
            title: "A Year of Divine Acceleration & Overflowing Grace",
            subtitle: "WEEKLY FEATURE",
            body: "Isaiah 60:22 — When the time is right, I, the Lord, will make it happen.",
            image_url: ApostlesImage,
            isFeatured: true,
          };
          setDefaultFeatured(fallbackData);
          setActiveStory(fallbackData);
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

  // 2. Handler when a user clicks any story from MainFeedSection
  const handleSelectStory = (article) => {
    setActiveStory({
      id: article.id,
      title: article.title,
      subtitle: "NEWSFEED ARTICLE",
      body: article.body,
      image_url: ApostlesImage, // Hardcoded consistent image
      isFeatured: false,
    });
    setIsExpanded(true); // Automatically open read view when a story is selected
  };

  // Helper to split text for dual drop-caps (Column 1 and Column 2)
  const formatDualDropCapText = (text) => {
    const cleanText = text ? text.replace(/\\n/g, '\n') : "";
    if (!cleanText) return { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

    // Split roughly halfway or at a natural sentence/paragraph break if possible
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
      <div className="mx-auto max-w-7xl">

        {/* MAIN PAGE GRID (2 Columns: Hero Feature & Main Feed) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          {/* =====================================================
              HERO / READING AREA (5 Columns)
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
            ) : activeStory ? (
              <div className="relative w-full max-h-[460px] sm:max-h-[520px] overflow-hidden bg-black">
                
                {/* Image top-framed */}
                <img
                  src={activeStory.image_url}
                  alt={activeStory.title}
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Back to Default Featured Button (If viewing another story) */}
                {!activeStory.isFeatured && defaultFeatured && (
                  <button
                    onClick={() => {
                      setActiveStory(defaultFeatured);
                      setIsExpanded(false);
                    }}
                    className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 text-white text-[9px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md transition shadow-sm border border-white/10"
                  >
                    ← Back to Featured
                  </button>
                )}

                {/* Dark Glass Card Spanning Edge-to-Edge from Middle to Bottom */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-black/85 backdrop-blur-xl border-t border-white/25 p-4 sm:p-5 flex flex-col justify-between shadow-2xl text-white overflow-hidden">
                  <div className="space-y-1.5 overflow-hidden flex-1 flex flex-col">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary shrink-0 block">
                      {activeStory.subtitle}
                    </span>

                    <h1 className="text-xs sm:text-sm font-serif leading-tight shrink-0">
                      {activeStory.title}
                    </h1>

                    {activeStory.body && (
                      <div className="text-[10px] text-white/90 leading-relaxed whitespace-pre-line overflow-hidden flex-1">
                        {activeStory.body.replace(/\\n/g, '\n')}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 shrink-0 border-t border-white/15 mt-2">
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-[10px] font-medium text-burgundy-primary hover:text-white transition inline-flex items-center gap-1 group"
                    >
                      Read Full Article <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : null}
          </section>

          {/* =====================================================
              MAIN FEED SECTION (7 Columns)
          ====================================================== */}
          <section className="lg:col-span-7">
            <MainFeedSection onSelectStory={handleSelectStory} />
          </section>

        </div>

      </div>

      {/* =====================================================
          CREATIVE EDITORIAL MAGAZINE OVERLAY (Modal)
      ====================================================== */}
      {isExpanded && activeStory && (
        <div className="fixed inset-0 z-[9999] bg-[#0c0a09]/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in duration-300">
          
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
                <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-[1.15]">
                  {activeStory.title}
                </h1>
                <div>
                  <span className="uppercase tracking-widest text-burgundy-primary font-semibold text-xs">
                    Featured Article of the Week
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
                    className="w-full h-[300px] sm:h-[380px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Right Side: First Half of Text with Red Drop Cap */}
                <div className="lg:col-span-7">
                  {activeStory.body && (
                    <div className="text-base sm:text-lg text-white/90 leading-relaxed whitespace-pre-line font-light tracking-wide">
                      <span className="float-left text-5xl sm:text-6xl font-serif text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
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
                    <span className="float-left text-5xl sm:text-6xl font-serif text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
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
