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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => setIsOpen(false);

  /**
   * Daily Rotating / Pseudo-Random Episode Selection Logic
   */
  const handleMoodClick = (categoryKey) => {
    const matchingEpisodes = allDevotionals.filter(
      (item) => item.category?.toLowerCase() === categoryKey.toLowerCase()
    );

    if (matchingEpisodes.length === 0) {
      console.warn(`No episodes found for category: ${categoryKey}`);
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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* LUXURY BLURRED BACKDROP */}
      <div 
        className="absolute inset-0 bg-[#1c0c09]/45 backdrop-blur-md transition-opacity animate-[fadeIn_.3s_ease-out]" 
        onClick={close} 
      />

      {/* FULLY UNIFIED, SINGLE-CANVAS WELCOME CARD */}
      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[32px] bg-[#fdfaf7] p-6 sm:p-8 shadow-[0_30px_80px_rgba(42,17,14,0.25)] ring-1 ring-white/90 animate-[welcomeCard_.4s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* WARM AMBIENT GLOW */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-burgundy-primary/8 blur-[60px] pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button 
          onClick={close} 
          aria-label="Close" 
          className="absolute right-5 top-5 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-charcoal-text/60 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-black/10 hover:text-charcoal-text"
        >
          <X className="w-4 h-4" />
        </button>

        {/* TOP SECTION: INTEGRATED ART & MINIMISED HEADER */}
        <div className="flex items-center gap-4 border-b border-[#f0e4db]/80 pb-5">
          {/* CHARACTER ART CONTAINER WITH FALLBACK SUPPORT */}
          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center rounded-2xl bg-[#f7efe9]">
            <img 
              src={machairaImg} 
              alt="Machaira Waving" 
              className="h-full w-full object-contain animate-[gentleWave_2.2s_ease-in-out_infinite]"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          </div>

          {/* MINIMISED HEADER TEXT */}
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-burgundy-primary">
              Shalom Dearest Beloved !
            </span>
            <h1 className="text-[1.35rem] sm:text-[1.5rem] font-normal leading-[1.15] tracking-[-0.03em] text-charcoal-text mt-0.5">
              What's on your <span className="italic font-serif text-burgundy-primary">heart today?</span>
            </h1>
          </div>
        </div>

        {/* ACTION AREA: TODAY'S WORD + CLEAN MOOD GRID */}
        <div className="mt-4 space-y-3">
          
          {/* HERO BUTTON: TODAY'S WORD */}
          <button 
            onClick={() => { onTodayEpisode?.(); close(); }} 
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-[16px] bg-gradient-to-r from-burgundy-primary to-[#722f22] p-3 text-left text-white shadow-[0_6px_16px_rgba(114,47,34,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(114,47,34,0.3)]"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-center gap-2.5 relative z-10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/20 text-white backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block text-[11px] font-semibold tracking-wide">Take me to today's word</span>
                <span className="block text-[8px] text-white/80">Read today's fresh daily devotional</span>
              </div>
            </div>
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </button>

          {/* CLEAN MOOD GRID CATEGORIES (NO ICONS) */}
          <div>
            <div className="mb-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-cool-gray/80">
                choose based on your mood
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[175px] overflow-y-auto pr-1 custom-scrollbar">
              {POPULAR_MOODS.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodClick(mood.categoryKey)}
                  className="group relative flex items-center justify-between rounded-[12px] border border-[#eadcd6] bg-white p-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy-primary/40 hover:bg-[#fffcf9] hover:shadow-[0_4px_12px_rgba(80,30,20,0.05)]"
                >
                  <span className="text-[10px] font-medium text-charcoal-text truncate pr-1">{mood.label}</span>
                  <ArrowRight className="w-3 h-3 text-soft-gray transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-burgundy-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER ENCOURAGEMENT */}
        <div className="mt-4 pt-3 text-center border-t border-[#f0e4db]/80">
          <p className="text-[8px] font-serif italic text-cool-gray">
            "Thy word is a lamp unto my feet, and a light unto my path."
          </p>
        </div>

      </div>

      <style>{`
        @keyframes welcomeCard {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gentleWave {
          0% { transform: rotate(0deg); transform-origin: 50% 65%; }
          25% { transform: rotate(4deg); transform-origin: 50% 65%; }
          50% { transform: rotate(0deg); transform-origin: 50% 65%; }
          75% { transform: rotate(-4deg); transform-origin: 50% 65%; }
          100% { transform: rotate(0deg); transform-origin: 50% 65%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eadcd6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}