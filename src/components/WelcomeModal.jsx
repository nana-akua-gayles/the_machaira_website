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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* LUXURY BLURRED BACKDROP */}
      <div
        className="absolute inset-0 bg-[#1c0c09]/55 backdrop-blur-md animate-[fadeIn_.3s_ease-out]"
        onClick={close}
      />

      {/* LARGE TWO-COLUMN WELCOME CARD */}
      <div className="relative z-10 w-full max-w-[980px] overflow-hidden rounded-[32px] bg-[#fdfaf7] shadow-[0_30px_80px_rgba(42,17,14,0.35)] ring-1 ring-white/90 animate-[welcomeCard_.45s_cubic-bezier(0.16,1,0.3,1)]">

        {/* WARM AMBIENT GLOW */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-burgundy-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#c9a27a]/10 blur-[80px] pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-charcoal-text/60 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-black/10 hover:text-charcoal-text"
        >
          <X className="w-4 h-4" />
        </button>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

          {/* ===== LEFT: IMAGE PANEL ===== */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7efe9] via-[#fbf5f0] to-[#f0e4db] p-8 lg:p-10">

            {/* Decorative radial glow behind the character */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-64 w-64 rounded-full bg-white/60 blur-3xl" />
            </div>

            {/* Character image */}
            <div className="relative z-10 flex h-56 w-56 items-center justify-center lg:h-64 lg:w-64">
              <img
                src={machairaImg}
                alt="Machaira Waving"
                className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(114,47,34,0.25)] animate-[gentleWave_2.2s_ease-in-out_infinite]"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Bottom label */}
            <div className="relative z-10 mt-6 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-burgundy-primary">
                Shalom Dearest Beloved
              </span>
              <p className="mt-2 text-[11px] italic text-cool-gray">
                You are welcome here.
              </p>
            </div>

            {/* Soft ring accent */}
            <div className="pointer-events-none absolute inset-0 rounded-l-[32px] ring-1 ring-inset ring-white/40 lg:rounded-r-none" />
          </div>

          {/* ===== RIGHT: CONTENT PANEL ===== */}
          <div className="flex flex-col p-7 sm:p-9 lg:p-10">

            {/* HEADER */}
            <div className="pb-5 border-b border-[#f0e4db]/80">
              <h1 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.15rem] font-normal leading-[1.15] tracking-[-0.03em] text-charcoal-text">
                What's on your <br className="hidden sm:block" />
                <span className="italic font-serif text-burgundy-primary">heart today?</span>
              </h1>
              <p className="mt-3 text-[13px] leading-6 text-cool-gray max-w-md">
                Pick how you're feeling and we'll bring you a word that speaks to your season.
              </p>
            </div>

            {/* ACTION AREA */}
            <div className="mt-5 space-y-4">

              {/* HERO BUTTON: TODAY'S WORD */}
              <button
                onClick={() => { onTodayEpisode?.(); close(); }}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-[18px] bg-gradient-to-r from-burgundy-primary to-[#722f22] p-4 text-left text-white shadow-[0_8px_20px_rgba(114,47,34,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(114,47,34,0.35)]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center gap-3.5 relative z-10">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white/20 text-white backdrop-blur-sm">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="block text-[14px] font-semibold tracking-wide">
                      Take me to today's word
                    </span>
                    <span className="block text-[11px] text-white/80 mt-0.5">
                      Read today's fresh daily devotional
                    </span>
                  </div>
                </div>
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* MOOD GRID */}
              <div>
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cool-gray/80">
                    choose based on your mood
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {POPULAR_MOODS.map((mood, index) => (
                    <button
                      key={index}
                      onClick={() => handleMoodClick(mood.categoryKey)}
                      className="group relative flex items-center justify-between rounded-[14px] border border-[#eadcd6] bg-white px-3.5 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy-primary/40 hover:bg-[#fffcf9] hover:shadow-[0_6px_16px_rgba(80,30,20,0.08)]"
                    >
                      <span className="text-[12px] font-medium text-charcoal-text truncate pr-2">
                        {mood.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-soft-gray transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-burgundy-primary shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER ENCOURAGEMENT */}
            <div className="mt-auto pt-5 border-t border-[#f0e4db]/80">
              <p className="text-[11px] font-serif italic text-cool-gray text-center lg:text-left">
                "Thy word is a lamp unto my feet, and a light unto my path."
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