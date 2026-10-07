import React, { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function PartnershipStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch stories on mount (limited to 3)
  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('impact_stories')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(3);

        if (error) {
          throw error;
        } else if (data) {
          setStories(data);
        }
      } catch (err) {
        console.error('Error fetching stories:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  // Close modal on Escape key press & handle body scroll lock
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSelectedStory(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStory]);

  // Helper to safely convert text-based gallery columns into a clean array of strings
  const parseGallery = (galleryData) => {
    if (!galleryData) return [];
    if (Array.isArray(galleryData)) return galleryData;
    if (typeof galleryData === 'string') {
      const cleaned = galleryData.replace(/^\{|\}$/g, '').replace(/"/g, '');
      return cleaned ? cleaned.split(',').map(item => item.trim()).filter(Boolean) : [];
    }
    return [];
  };

  // Dual Drop Cap text formatter matching your Newsfeed page
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

  const storyTextParts = selectedStory 
    ? formatDualDropCapText(selectedStory.about || selectedStory.testimony) 
    : { part1Letter: "", part1Rest: "", part2Letter: "", part2Rest: "" };

  const galleryImages = selectedStory ? parseGallery(selectedStory.gallery_images) : [];

  return (
    <section className="px-6 md:px-16 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-start items-center w-full mb-6">
        <div>
          <span className="text-burgundy-primary text-xl font-bold tracking-wider mb-2 block">
            Why Partner with Us?
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 w-full items-center justify-center text-cool-gray text-xs tracking-widest animate-pulse">
          LOADING OUR IMPACT STORIES...
        </div>
      ) : error ? (
        <div className="flex h-56 w-full items-center justify-center text-burgundy-primary text-xs tracking-widest">
          UNABLE TO LOAD IMPACT STORIES
        </div>
      ) : stories.length === 0 ? (
        <div className="flex h-56 w-full items-center justify-center text-cool-gray text-xs tracking-widest">
          NO IMPACT STORIES AVAILABLE
        </div>
      ) : (
        /* 3-column grid layout with fixed card height */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-stretch">
          {stories.map((story) => (
            <div 
              key={story.id} 
              role="button"
              tabIndex={0}
              onClick={() => setSelectedStory(story)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedStory(story); }}
              className="relative rounded-2xl overflow-hidden shadow-sm h-120 flex flex-col justify-end group cursor-pointer border border-soft-gray/35 hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-burgundy-primary"
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 bg-soft-gray/20">
                {story.image_url ? (
                  <img 
                    src={story.image_url} 
                    alt={story.name} 
                    // Change '15%' here if you want it higher (e.g. '10%') or lower (e.g. '25%')
                    className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-burgundy-primary/10 text-burgundy-primary">
                    <User className="w-16 h-16 opacity-40" />
                  </div>
                )}
              </div>

              {/* Edge-to-Edge Glassmorphism Overlay */}
              <div className="relative z-10 w-full p-6 bg-navy-dark/85 backdrop-blur-md border-t border-parchment/10 text-parchment flex flex-col justify-between h-[52%] transition-colors group-hover:bg-navy-dark/95">
                <div className="overflow-hidden flex flex-col h-full">
                  <h4 className="text-xs font-bold text-parchment leading-tight mb-2 shrink-0">
                    {story.name}
                  </h4>
                  <p className="text-xs text-soft-gray leading-relaxed overflow-hidden">
                    {story.about}
                  </p>
                </div>
                <div className="pt-2 shrink-0 flex items-center gap-1 text-[11px] font-semibold text-burgundy-primary group-hover:underline">
                  Read more <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immersive Modal / Expanded Reading View with Drop Caps & Gallery */}
      {selectedStory && (
        <div className="fixed inset-0 z-9999 bg-[#0c0a09]/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <header className="w-full px-6 sm:px-12 py-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-burgundy-primary animate-pulse"></span>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase">
                Impact Story & Testimony
              </span>
            </div>

            <button 
              onClick={() => setSelectedStory(null)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center text-xs transition-all group"
              aria-label="Close reading"
            >
              <span className="group-hover:rotate-90 transition-transform">✕</span>
            </button>
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-4xl space-y-8">
              
              <div className="space-y-3 text-center lg:text-left border-b border-white/10 pb-6">
                <h1 className="text-3xl sm:text-5xl text-white tracking-tight leading-[1.15]">
                  {selectedStory.name}
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                
                <div className="lg:col-span-5 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group">
                  {selectedStory.image_url ? (
                    <img 
                      src={selectedStory.image_url} 
                      alt={selectedStory.name} 
                      className="w-full h-75 sm:h-95 object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-75 sm:h-95 flex items-center justify-center bg-burgundy-primary/10 text-burgundy-primary">
                      <User className="w-16 h-16 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="lg:col-span-7">
                  {/* Part 1 with Drop Cap */}
                  <div className="text-base sm:text-lg text-white/90 leading-relaxed whitespace-pre-line font-light tracking-wide">
                    <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
                      {storyTextParts.part1Letter}
                    </span>
                    {storyTextParts.part1Rest}
                  </div>
                </div>

              </div>

              {/* Part 2 with Drop Cap (if long enough) */}
              {storyTextParts.part2Letter && (
                <div className="pt-6 border-t border-white/10">
                  <div className="text-base sm:text-lg text-white/90 leading-relaxed whitespace-pre-line font-light tracking-wide">
                    <span className="float-left text-5xl sm:text-6xl text-burgundy-primary leading-none mr-3 mt-1 uppercase select-none">
                      {storyTextParts.part2Letter}
                    </span>
                    {storyTextParts.part2Rest}
                  </div>
                </div>
              )}

              {/* Outreach Photo Gallery Section (Only renders if galleryImages has items) */}
              {galleryImages.length > 0 && (
                <div className="pt-10 border-t border-white/15 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-widest text-white uppercase">
                      Impact Gallery
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((imgSrc, index) => (
                      <div 
                        key={index} 
                        className="group relative h-48 rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-md"
                      >
                        <img 
                          src={imgSrc} 
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-[10px] text-white/80 font-medium tracking-wider uppercase">Impact Moment 0{index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer Bar */}
          <footer className="w-full py-4 px-6 border-t border-white/10 bg-black/80 text-center text-xs text-white/40 tracking-widest uppercase shrink-0">
            God bless you for partnering with us to impact lives for Christ!
          </footer>

        </div>
      )}
    </section>
  );
}