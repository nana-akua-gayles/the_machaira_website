import React, { useEffect, useState } from "react";
import { Sparkles, BookOpen, ArrowRight, ArrowUp, X, CloudSun } from "lucide-react";
import machairaImg from "../assets/images/MacAi2.png";

export default function WelcomeModal({ onFeeling, onTodayEpisode, onThoughtSubmit }) {
  const [isOpen, setIsOpen] = useState(true);
  const [thought, setThought] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => setIsOpen(false);
  const submitThought = (e) => {
    e.preventDefault();
    const value = thought.trim();
    if (!value) return;
    onThoughtSubmit?.(value);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* SOFT PAGE OVERLAY */}
      <div className="absolute inset-0 bg-navy-dark/25 backdrop-blur-xs" onClick={close} />

      {/* ACTUAL WELCOME CARD */}
      <div className="relative z-10 w-full max-w-190 overflow-hidden rounded-[26px] bg-parchment shadow-[0_30px_90px_rgba(42,17,14,0.25)] ring-1 ring-white/80 animate-[welcomeCard_.45s_ease-out]">
        
        {/* CLOSE BUTTON */}
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-charcoal-text/60 shadow-sm backdrop-blur-md transition hover:rotate-90 hover:bg-white hover:text-charcoal-text">
          <X className="w-4 h-4" />
        </button>

        <div className="grid min-h-62.5 lg:min-h-150 grid-cols-[38%_62%]">
          
          {/* LEFT IMAGE CONTAINER - CENTERED CHARACTER */}
          <div className="relative overflow-hidden flex items-center justify-center bg-[#fdfaf7]">
            {/* Soft Breathing Aura Glow */}
            <div className="absolute h-36 w-36 rounded-full bg-burgundy-primary/15 blur-2xl animate-[auraPulse_5s_ease-in-out_infinite] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <img 
              src={machairaImg} 
              alt="Machaira Character" 
              className="relative max-h-[85%] w-auto object-contain animate-[playfulEntry_.8s_cubic-bezier(0.34,1.56,0.64,1)_forwards,gentleFloat_4s_ease-in-out_infinite_0.8s]" 
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-8">
            
            {/* GREETING UPDATED */}
            <div className="mb-3 animate-[fadeIn_.6s_ease-out]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burgundy-primary">
                Shalom Dearest Beloved!
              </span>
            </div>

            {/* HEADING */}
            <h1 className="max-w-97.5 text-[2rem] font-normal leading-none tracking-[-0.035em] text-charcoal-text sm:text-[2.45rem] animate-[fadeIn_.7s_ease-out]">
              What's on your<br />
              <span className="italic text-burgundy-primary">heart today?</span>
            </h1>

            <p className="mt-3 max-w-97.5 text-[10px] leading-[1.65] text-cool-gray sm:text-[11px] animate-[fadeIn_.8s_ease-out]">
              Tell us how you're feeling or simply go straight to today's word.
            </p>

            {/* OPTIONS */}
            <div className="mt-5 space-y-2 animate-[fadeIn_.9s_ease-out]">
              
              {/* FEELING */}
              <button onClick={() => onFeeling?.()} className="group flex w-full items-center rounded-[15px] border border-burgundy-primary/10 bg-[#fffaf5] px-3 py-2.5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-burgundy-primary/20 hover:shadow-[0_8px_25px_rgba(80,30,20,0.07)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#f3ded7] text-burgundy-primary">
                  <CloudSun className="w-4 h-4" />
                </span>
                <span className="ml-3 grow">
                  <span className="block text-[13px] font-medium text-charcoal-text">How am I feeling?</span>
                  <span className="mt-0.5 block text-[8px] text-soft-gray">Help me find the right word</span>
                </span>
                <ArrowRight className="mr-1 w-4 h-4 text-burgundy-primary/50 transition group-hover:translate-x-1 group-hover:text-burgundy-primary" />
              </button>

              {/* TODAY */}
              <button onClick={() => onTodayEpisode?.()} className="group flex w-full items-center rounded-[15px] border border-black/10 bg-white px-3 py-2.5 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(80,30,20,0.07)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-soft-gray/30 text-cool-gray">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="ml-3 grow">
                  <span className="block text-[13px] font-medium text-charcoal-text">Take me to today's word</span>
                  <span className="mt-0.5 block text-[8px] text-soft-gray">I just want today's devotional</span>
                </span>
                <ArrowRight className="mr-1 w-4 h-4 text-soft-gray transition group-hover:translate-x-1 group-hover:text-burgundy-primary" />
              </button>

            </div>

            {/* DIVIDER */}
            <div className="my-3 flex items-center gap-3">
              <span className="h-0.5 grow bg-black/10" />
              <span className="text-[7px] font-medium uppercase tracking-[0.25em] text-soft-gray">or</span>
              <span className="h-0.5 grow bg-black/10" />
            </div>

            {/* INPUT FORM */}
            <form onSubmit={submitThought}>
              <div className="flex items-center rounded-[15px] border border-black/10 bg-white p-1 pl-3 transition focus-within:border-burgundy-primary/30 focus-within:shadow-[0_6px_20px_rgba(80,30,20,0.06)]">
                <Sparkles className="mr-2 w-3.5 h-3.5 text-amber-700 shrink-0" />
                <input 
                  type="text" 
                  value={thought} 
                  onChange={(e) => setThought(e.target.value)} 
                  placeholder="Tell me what's on your mind..." 
                  className="min-w-0 grow bg-transparent py-2 text-[9px] text-charcoal-text outline-none placeholder:text-soft-gray sm:text-[10px]" 
                />
                <button type="submit" disabled={!thought.trim()} aria-label="Submit thought" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-burgundy-primary text-white transition hover:scale-105 hover:opacity-90 disabled:opacity-30">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes welcomeCard {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes playfulEntry {
          0% { opacity: 0; transform: translateY(20px) scale(0.9) rotate(-2deg); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.02) rotate(1deg); }
          100% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}