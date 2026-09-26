import React, { useEffect, useState } from "react";
import { BookOpen, ArrowRight, X } from "lucide-react";
import machairaImg from "../assets/images/wave2.png";

const POPULAR_MOODS = [
  { label: "Confidence in God", categoryKey: "Confidence in God" },
  { label: "Overcoming Low Self-Esteem", categoryKey: "Dealing with Low Self-Esteem" },
  { label: "Finding Peace & Joy", categoryKey: "Joy" },
  { label: "Overcoming Fear", categoryKey: "Fear" },
  { label: "Healing & Health", categoryKey: "Healing and Health" },
  { label: "Faith & Strength", categoryKey: "Faith" },
  { label: "Hope in Trials", categoryKey: "Hope" },
  { label: "Depression & Comfort", categoryKey: "Depression" }
];

export default function WelcomeModal({
  allDevotionals = [],
  onSelectEpisode,
  onTodayEpisode
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => setIsOpen(false);

  const handleMoodClick = (categoryKey) => {
    // Flexible category mapping to ensure match with Supabase database fields
    const categoryMapping = {
      "Confidence in God": "Confidence in God",
      "Dealing with Low Self-Esteem": "Dealing with Low Self-Esteem",
      "Joy": "Joy",
      "Fear": "Fear",
      "Healing and Health": "Healing and Health",
      "Faith": "Faith",
      "Hope": "Hope",
      "Depression": "Depression"
    };

    const targetCategory = categoryMapping[categoryKey] || categoryKey;

    // Flexible filtering (ignoring casing and trailing spaces)
    const matchingEpisodes = allDevotionals.filter(
      (item) => item.category?.trim().toLowerCase() === targetCategory.trim().toLowerCase()
    );

    if (matchingEpisodes.length === 0) {
      console.warn(`No episodes found for category: ${targetCategory}. Total devotionals loaded:`, allDevotionals.length);
      
      // Fallback: try searching if any item includes the key text
      const fallbackEpisodes = allDevotionals.filter(
        (item) => item.category?.toLowerCase().includes(categoryKey.toLowerCase())
      );
      
      if (fallbackEpisodes.length > 0) {
        const todayString = new Date().toISOString().slice(0, 10);
        let seed = 0;
        for (let i = 0; i < todayString.length; i++) {
          seed += todayString.charCodeAt(i);
        }
        const index = (seed + categoryKey.length) % fallbackEpisodes.length;
        onSelectEpisode?.(fallbackEpisodes[index], categoryKey);
        close();
        return;
      }
      return;
    }

    const todayString = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < todayString.length; i++) {
      seed += todayString.charCodeAt(i);
    }

    const index = (seed + categoryKey.length) % matchingEpisodes.length;
    const selectedEpisode = matchingEpisodes[index];

    onSelectEpisode?.(selectedEpisode, categoryKey);
    close();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* LUXURY BLURRED BACKDROP */}
      <div
        className="absolute inset-0 bg-[#1c0c09]/55 backdrop-blur-md animate-[fadeIn_.3s_ease-out]"
        onClick={close}
      />

      {/* LARGE TWO-COLUMN WELCOME CARD */}
      <div className="relative z-10000 w-full max-w-245 overflow-hidden rounded-4xl bg-[#fdfaf7] shadow-[0_30px_80px_rgba(42,17,14,0.35)] ring-1 ring-white/90 animate-[welcomeCard_.45s_cubic-bezier(0.16,1,0.3,1)]">

        {/* WARM AMBIENT GLOW */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-burgundy-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#c9a27a]/10 blur-[80px] pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/5 text-charcoal-text/60 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-black/10 hover:text-charcoal-text"
        >
          <X className="w-4 h-4" />
        </button>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

          {/* ===== LEFT: IMAGE PANEL ===== */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#f7efe9] via-[#fbf5f0] to-[#f0e4db] p-8 lg:p-10">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-64 w-64 rounded-full bg-white/60 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-56 w-56 items-center justify-center lg:h-64 lg:w-64">
              <img
                src={machairaImg}
                alt="Machaira Waving"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(114,47,34,0.25)] animate-[gentleWave_2.2s_ease-in-out_infinite]"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <div className="relative z-10 mt-6 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-burgundy-primary">
                Shalom Beloved,
              </span>
              <p className="mt-2 text-[11px] italic text-cool-gray">
                I'm so excited to see you today!
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-l-4xl ring-1 ring-inset ring-white/40 lg:rounded-r-none" />
          </div>

          {/* ===== RIGHT: CONTENT PANEL ===== */}
          <div className="flex flex-col p-7 sm:p-9 lg:p-10">

            {/* HEADER */}
            <div className="pb-3 border-b border-[#f0e4db]/80">
              <h1 className="text-[1.4rem] sm:text-[1.55rem] font-normal leading-[1.15] tracking-[-0.03em] text-charcoal-text">
                What if God wrote <span className="italic font-serif text-burgundy-primary">you a letter today?</span>
              </h1>
            </div>

            {/* ACTION AREA - TODAY'S WORD HERO CARD (ABSOLUTE PRIORITY) */}
            <div className="mt-4 space-y-4">

              {/* PRIMARY HERO BANNER */}
              <button
                onClick={() => { onTodayEpisode?.(); close(); }}
                className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-[22px] bg-linear-to-br from-burgundy-primary via-[#8a3829] to-[#5e2016] p-5 text-left text-white shadow-[0_12px_30px_rgba(114,47,34,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(114,47,34,0.45)] ring-1 ring-white/20"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                
                <BookOpen className="absolute -right-4 -bottom-6 w-32 h-32 text-white/5 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />

                <div className="flex items-center gap-4 relative z-10">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md shadow-inner ring-1 ring-white/30">
                    <BookOpen className="w-7 h-7" />
                  </span>
                  <div>
                    <span className="block text-[15px] sm:text-[16px] font-bold tracking-tight text-white leading-tight">
                      Today's Devotional was written with you in mind
                    </span>
                    <span className="block text-[11px] text-white/80 font-normal mt-0.5">
                      Click to receive your word for the now
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1.5 backdrop-blur-md shrink-0 ml-3">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* MOOD GRID (SECONDARY SECTION) */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cool-gray/80">
                    Or should we first answer the question lingering on your mind ?
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48.75 overflow-y-auto pr-1 custom-scrollbar">
                  {POPULAR_MOODS.map((mood, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleMoodClick(mood.categoryKey)}
                      className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-[#eadcd6] bg-white px-3.5 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy-primary/40 hover:bg-[#fffcf9] hover:shadow-[0_4px_12px_rgba(80,30,20,0.06)]"
                    >
                      <span className="text-[11px] font-medium text-charcoal-text truncate pr-2 pointer-events-none">
                        {mood.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-soft-gray transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-burgundy-primary shrink-0 pointer-events-none" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* FOOTER ENCOURAGEMENT */}
            <div className="mt-auto pt-3.5 border-t border-[#f0e4db]/80">
              <p className="text-[11px] font-serif italic text-cool-gray text-center lg:text-left">
                "Every word is written like a love letter from God to you. Machaira with Apostle Bennie is a person you behold."
              </p>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes welcomeCard {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gentleWave {
          0% { transform: rotate(0deg); transform-origin: 50% 65%; }
          25% { transform: rotate(4deg); transform-origin: 50% 65%; }
          50% { transform: rotate(0deg); transform-origin: 50% 65%; }
          75% { transform: rotate(-4deg); transform-origin: 50% 65%; }
          100% { transform: rotate(0deg); transform-origin: 50% 65%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eadcd6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}