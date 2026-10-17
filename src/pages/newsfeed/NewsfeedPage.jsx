import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowLeft, BookOpen, X } from "lucide-react";
import MainFeedSection from "./MainFeedSection";
import AllArticlesArchive from "./AllArticlesArchive";
import { supabase } from "../../lib/supabaseClient";
import ApostlesImage from "../../assets/images/Apostle2.jpg";

export default function NewsfeedPage() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <main className="min-h-screen bg-white text-[#111827] font-[Montserrat]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10 py-8 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <section className="lg:col-span-5 min-w-0" aria-label="Featured story">
            <div className="flex items-center justify-between mb-4">
              <span className="h-px flex-1 bg-[#B9BEC8]/60 ml-5" />
            </div>
            {loadingHero ? (
              <div className="aspect-[4/5] animate-pulse bg-[#F0F0F0] rounded-2xl flex items-center justify-center text-sm text-[#4D5057]">Preparing the featured story...</div>
            ) : featuredStory ? (
              <button type="button" onClick={() => handleSelectStory(featuredStory)} className="group relative block w-full overflow-hidden rounded-2xl text-left bg-[#101A2B] aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] shadow-[0_22px_60px_-30px_rgba(16,26,43,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#991313]">
                <img src={featuredStory.image_url} alt={featuredStory.title} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101A2B] via-[#101A2B]/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-burgundy-primary font-semibold">{featuredStory.subtitle}</span>
                  <h2 className="mt-3 text-[clamp(1.6rem,5.5vw,2.8rem)] leading-[1.08] tracking-[-0.045em] font-semibold line-clamp-3">{featuredStory.title}</h2>
                  <p className="mt-3 text-sm text-white/75 line-clamp-2 leading-relaxed">{featuredStory.body?.replace(/\\n/g, " ")}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-xs font-semibold uppercase tracking-[0.14em]">
                    Read this article <span className="grid place-items-center rounded-full bg-white text-[#101A2B] w-10 h-10 transition-transform group-hover:translate-x-1"><ArrowUpRight size={18} /></span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="aspect-[4/5] bg-[#F6F6F6] rounded-2xl grid place-items-center text-[#4D5057]">No featured article available.</div>
            )}
          </section>
          <section className="lg:col-span-7 min-w-0" aria-label="Latest updates">
            <MainFeedSection onSelectStory={handleSelectStory} />
          </section>
        </div>
        <AllArticlesArchive onSelectStory={handleSelectStory} />
      </div>

      {isExpanded && activeStory && (
        <div className="fixed inset-0 z-[9999] bg-[#F9F9F7] flex flex-col" role="dialog" aria-modal="true" aria-label={activeStory.title}>
          <header className="shrink-0 border-b border-[#B9BEC8]/40 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-3 sm:py-4">
            <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
              <button type="button" onClick={() => setIsExpanded(false)} className="inline-flex items-center gap-2 rounde-full border border-[#B9BEC8] px-4 py-2 text-xs font-semibold text-[#101A2B] hover:bg-[#101A2B] hover:text-white transition" aria-label="Close article"><X size={16} /></button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto overscroll-contain" onKeyDown={(event) => { if (event.key === "Escape") setIsExpanded(false); }}>
            <article className="mx-auto max-w-4xl px-5 sm:px-8 pt-10 sm:pt-16 pb-24">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-[#991313] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold">{activeStory.subtitle}</p>
                <h1 className="mt-5 text-[clamp(2.1rem,6vw,4.6rem)] font-semibold leading-[1.1] tracking-[-0.055em] text-[#101A2B]">{activeStory.title}</h1>
                <div className="mt-7 mx-auto h-px w-16 bg-[#991313]" />
              </div>
              <div className="mt-9 sm:mt-12 overflow-hidden rounded-xl sm:rounded-2xl bg-[#101A2B]">
                <img src={activeStory.image_url} alt={activeStory.title} className="w-full max-h-[480px] object-cover object-top" />
              </div>
              <div className="mx-auto max-w-[680px] mt-10 sm:mt-14 text-[#222C3B]">
                {activeStory.body ? (
                  <div className="text-[16px] sm:text-[18px] leading-[1.95] whitespace-pre-line break-words">
                    <span className="float-left text-[4.5rem] sm:text-[5.5rem] leading-[0.85] mr-3 mt-2 font-semibold text-[#991313]">{articleTextParts.part1Letter}</span>
                    {articleTextParts.part1Rest}
                    {articleTextParts.part2Letter && <p className="mt-7"><span className="float-left text-[4.5rem] leading-[0.85] mr-3 mt-2 font-semibold text-[#991313]">{articleTextParts.part2Letter}</span>{articleTextParts.part2Rest}</p>}
                  </div>
                ) : <p>Article content is not available.</p>}
                <div className="mt-14 border-t border-[#B9BEC8]/60 pt-6 flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4D5057]">End of article</span>
                  <button type="button" onClick={() => setIsExpanded(false)} className="flex items-center gap-2 text-xs font-bold text-[#991313]"><ArrowLeft size={16} /> Back to newsfeed</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </main>
  );
}