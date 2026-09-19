import React, { useState, useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import MainFeedSection from "./MainFeedSection";
import RightSidebar from "./RightSidebar";
import { supabase } from "../../lib/supabaseClient";
import ApostlesImage from "../../assets/images/Apostle2.jpg";

export default function NewsfeedPage() {
  const [activeStory, setActiveStory] = useState(null);
  const [defaultFeatured, setDefaultFeatured] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false); // Controls the glass overlay state

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
    setIsExpanded(true); // Automatically open the glass overlay when a story is selected
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] px-4 py-6 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl">

        {/* MAIN PAGE GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          {/* =====================================================
              HERO / READING AREA (Scrollable Content Card from Middle to Bottom)
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
              <div className="h-72 flex items-center justify-center text-xs text-cool-gray bg-white">
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

                {/* Dark Glass Card Spanning Edge-to-Edge from Middle to Bottom with Scrollable Text */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-black/75 backdrop-blur-md border-t border-white/15 p-4 sm:p-5 flex flex-col justify-between shadow-2xl text-white">
                  <div className="space-y-1.5 overflow-y-auto pr-1">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary">
                      {activeStory.subtitle}
                    </span>

                    <h1 className="text-xs sm:text-sm font-serif leading-tight">
                      {activeStory.title}
                    </h1>

                    {activeStory.body && (
                      <p className="text-[10px] text-white/80 leading-relaxed whitespace-pre-line">
                        {activeStory.body}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 shrink-0 border-t border-white/10 mt-2">
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-[10px] font-medium text-burgundy-primary hover:text-white transition inline-flex items-center gap-1"
                    >
                      Read Full Article →
                    </button>
                  </div>
                </div>

              </div>
            ) : null}
          </section>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}
          <aside className="lg:col-span-3 lg:row-span-2">
            <RightSidebar />
          </aside>

          {/* =====================================================
              LEFT SIDEBAR
          ====================================================== */}
          <aside className="lg:col-span-2">
            <LeftSidebar />
          </aside>

          {/* =====================================================
              MAIN FEED
          ====================================================== */}
          <section className="lg:col-span-7">
            <MainFeedSection onSelectStory={handleSelectStory} />
          </section>

        </div>

      </div>

      {/* =====================================================
          DARK GLASS OVERLAY MODAL (Triggered on Read More)
      ====================================================== */}
      {isExpanded && activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-black/85 backdrop-blur-2xl border border-white/15 text-white w-full max-w-2xl max-h-[85vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Overlay Header / Image */}
            <div className="relative w-full h-48 sm:h-56 shrink-0 bg-black">
              <img
                src={activeStory.image_url}
                alt={activeStory.title}
                className="w-full h-full object-cover object-top"
              />
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-md backdrop-blur-md border border-white/10"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Overlay Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-burgundy-primary">
                  {activeStory.subtitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-white leading-tight mt-1">
                  {activeStory.title}
                </h2>
              </div>

              {activeStory.body && (
                <div className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line space-y-3">
                  {activeStory.body}
                </div>
              )}
            </div>

            {/* Overlay Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 bg-burgundy-primary hover:bg-burgundy-primary/90 text-white text-xs rounded-xl transition shadow-sm"
              >
                Close Reading View
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}