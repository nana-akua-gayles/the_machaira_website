import { useState, useEffect } from "react";
import { User, ArrowRight, ArrowUpRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function PartnershipStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch stories from Supabase
  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from("impact_stories")
          .select("*")
          .order("display_order", { ascending: true })
          .limit(3);

        if (error) throw error;
        setStories(data || []);
      } catch (err) {
        console.error("Error fetching stories:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  // Handle Escape key and background scrolling
  useEffect(() => {
    if (!selectedStory) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedStory(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedStory]);

  // Parse gallery images
  const parseGallery = (galleryData) => {
    if (!galleryData) return [];
    if (Array.isArray(galleryData)) return galleryData.filter(Boolean);

    if (typeof galleryData === "string") {
      const cleaned = galleryData.trim();
      if (!cleaned) return [];

      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // Support comma-separated gallery values.
      }

      return cleaned
        .replace(/^\{|\}$/g, "")
        .replace(/^\[|\]$/g, "")
        .replace(/"/g, "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  // Dual drop-cap formatter
  const formatDualDropCapText = (text) => {
    const cleanText = text
      ? text.replace(/\\n/g, "\n").replace(/&#x6E;/g, "\n").trim()
      : "";

    if (!cleanText) {
      return {
        part1Letter: "",
        part1Rest: "",
        part2Letter: "",
        part2Rest: "",
      };
    }

    const midpoint = Math.floor(cleanText.length / 2);
    let breakIndex = cleanText.indexOf(".", midpoint);

    if (breakIndex === -1) breakIndex = midpoint;

    const firstChunk = cleanText.slice(0, breakIndex + 1).trim();
    const secondChunk = cleanText.slice(breakIndex + 1).trim();

    return {
      part1Letter: firstChunk.charAt(0),
      part1Rest: firstChunk.slice(1),
      part2Letter: secondChunk.charAt(0),
      part2Rest: secondChunk.slice(1),
    };
  };

  const storyTextParts = selectedStory
    ? formatDualDropCapText(
        selectedStory.about || selectedStory.testimony
      )
    : {
        part1Letter: "",
        part1Rest: "",
        part2Letter: "",
        part2Rest: "",
      };

  const galleryImages = selectedStory
    ? parseGallery(selectedStory.gallery_images)
    : [];

  return (
    <section className="overflow-hidden px-5 py-14 sm:px-8 md:px-16 md:py-16">
      {/* Section heading */}
      <div className="mb-8 flex w-full items-center justify-between sm:mb-10">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-burgundy-primary">
              Propaganda for Jesus
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-charcoal-text sm:text-4xl">
            Why partner with us?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-cool-gray sm:text-base">
            We walk into banks, salons, offices, hospitals, places preachers don't get invited to 
            and we leave them with copies for free. <br />
            The receptionist who might never come for a crusade. <br />
            The CEO who might be depressed in his fine suit. <br />
            The student who is anxious but looks fine.

          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[430px] animate-pulse rounded-3xl bg-soft-gray/20 sm:h-[470px]"
            >
              <div className="h-full rounded-3xl bg-gradient-to-t from-charcoal-text/20 to-soft-gray/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-56 flex-col items-center justify-center border border-soft-gray/50 px-6 text-center">
          <p className="text-sm font-semibold text-burgundy-primary">
            We couldn't load the impact stories.
          </p>
          <p className="mt-2 text-sm text-cool-gray">
            Please try again in a little while.
          </p>
        </div>
      ) : stories.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center border border-soft-gray/50 px-6 text-center">
          <User size={28} strokeWidth={1.3} className="text-cool-gray" />
          <p className="mt-4 text-sm font-semibold text-charcoal-text">
            Every story matters.
          </p>
          <p className="mt-2 text-sm text-cool-gray">
            Our impact stories will appear here soon.
          </p>
        </div>
      ) : (
        /* Dark cinematic story cards */
        <div className="partnership-story-rail -mx-5 flex items-stretch gap-4 overflow-x-auto px-5 pb-5 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStory(story)}
              aria-label={`Read the impact story of ${story.name}`}
              className="group relative flex h-[430px] w-[84%] shrink-0 flex-col overflow-hidden rounded-3xl bg-charcoal-text text-left shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-primary focus-visible:ring-offset-4 sm:h-[470px] sm:w-[65%] md:h-[490px] md:w-auto"
            >
              {/* Background image */}
              <div className="absolute inset-0 overflow-hidden bg-soft-gray/30">
                {story.image_url ? (
                  <img
                    src={story.image_url}
                    alt={story.name || "Impact story"}
                    loading="lazy"
                    className="h-full w-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-burgundy-primary/10 text-burgundy-primary">
                    <User size={64} strokeWidth={1} className="opacity-50" />
                  </div>
                )}
              </div>

              {/* Black cinematic image treatment */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
              <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/85 via-black/45 to-transparent transition-all duration-500 group-hover:from-black/95" />

              {/* Story details */}
              <div className="relative z-10 mt-auto w-full p-5 text-white sm:p-6 md:p-7">
                <div className="mb-4 h-px w-9 bg-white/80 transition-all duration-300 group-hover:w-16" />

                <h3 className="max-w-sm text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                  {story.name}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/85">
                  {story.about || story.testimony || "Discover this story of impact."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Read the story
                  </span>
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Original reading modal — styling and layout preserved */}
      {selectedStory && (
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#0c0a09]/95 backdrop-blur-2xl animate-in fade-in duration-300">
          {/* Header bar */}
          <header className="flex w-full shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-6 py-5 backdrop-blur-md sm:px-12">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-burgundy-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                Impact Story
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs text-white transition-all hover:bg-white/20"
              aria-label="Close reading"
            >
              <span className="transition-transform group-hover:rotate-90">
                ✕
              </span>
            </button>
          </header>

          {/* Scrollable reading area */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-3 border-b border-white/10 pb-6 text-center lg:text-left">
                <h1 className="text-3xl leading-[1.15] tracking-tight text-white sm:text-5xl">
                  {selectedStory.name}
                </h1>
              </div>

              <div className="grid grid-cols-1 items-start gap-8 pt-2 lg:grid-cols-12">
                <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl lg:col-span-5">
                  {selectedStory.image_url ? (
                    <img
                      src={selectedStory.image_url}
                      alt={selectedStory.name || "Impact story"}
                      className="h-75 w-full object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105 sm:h-95"
                    />
                  ) : (
                    <div className="flex h-75 w-full items-center justify-center bg-burgundy-primary/10 text-burgundy-primary sm:h-95">
                      <User size={64} strokeWidth={1} className="opacity-40" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="lg:col-span-7">
                  <div className="whitespace-pre-line text-base font-light leading-relaxed tracking-wide text-white/90 sm:text-lg">
                    <span className="float-left mr-3 mt-1 select-none text-5xl leading-none text-burgundy-primary sm:text-6xl">
                      {storyTextParts.part1Letter}
                    </span>
                    {storyTextParts.part1Rest}
                  </div>
                </div>
              </div>

              {storyTextParts.part2Letter && (
                <div className="border-t border-white/10 pt-6">
                  <div className="whitespace-pre-line text-base font-light leading-relaxed tracking-wide text-white/90 sm:text-lg">
                    <span className="float-left mr-3 mt-1 select-none text-5xl leading-none text-burgundy-primary sm:text-6xl">
                      {storyTextParts.part2Letter}
                    </span>
                    {storyTextParts.part2Rest}
                  </div>
                </div>
              )}

              {/* Impact gallery */}
              {galleryImages.length > 0 && (
                <div className="space-y-6 border-t border-white/15 pt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
                      Impact Gallery
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {galleryImages.map((imgSrc, index) => (
                      <div
                        key={`${imgSrc}-${index}`}
                        className="group relative h-48 overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-md"
                      >
                        <img
                          src={imgSrc}
                          alt={`Impact moment ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">
                            Impact Moment {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Original footer */}
          <footer className="w-full shrink-0 border-t border-white/10 bg-black/80 px-6 py-4 text-center text-xs uppercase tracking-widest text-white/40">
            God bless you for partnering with us to impact lives for Christ!
          </footer>
        </div>
      )}
    </section>
  );
}
