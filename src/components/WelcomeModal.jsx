import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import machairaImg from "../assets/images/wave2.png";

const POPULAR_MOODS = [
  { label: "Confidence in God", categoryKey: "Confidence in God" },
  { label: "Overcoming Low Self-Esteem", categoryKey: "Dealing with Low Self-Esteem" },
  { label: "Finding Peace & Joy", categoryKey: "Joy" },
  { label: "Overcoming Fear", categoryKey: "Fear" },
  { label: "Healing & Health", categoryKey: "Healing and Health" },
  { label: "Faith & Strength", categoryKey: "Faith" },
  { label: "Hope in Trials", categoryKey: "Hope" },
  { label: "Depression & Comfort", categoryKey: "Depression" },
];

export default function WelcomeModal({ onTodayEpisode }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => setIsOpen(false);

  const handleMoodClick = (categoryKey) => {
    const categoryMapping = {
      "Confidence in God": "Confidence in God",
      "Dealing with Low Self-Esteem": "Dealing with Low Self-Esteem",
      Joy: "Joy",
      Fear: "Fear",
      "Healing and Health": "Healing and Health",
      Faith: "Faith",
      Hope: "Hope",
      Depression: "Depression",
    };

    const targetCategory = categoryMapping[categoryKey] || categoryKey;

    close();
    navigate(
      `/previous-devotionals?category=${encodeURIComponent(targetCategory)}`
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto overscroll-contain p-3 sm:items-center sm:p-5 lg:p-8">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close welcome modal"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-[#1c0c09]/60 backdrop-blur-md animate-[fadeIn_.3s_ease-out]"
      />

      {/* MODAL CARD */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-heading"
        className="relative z-10 my-3 w-full max-w-[980px] shrink-0 overflow-hidden rounded-2xl bg-[#fdfaf7] shadow-[0_30px_80px_rgba(42,17,14,0.35)] ring-1 ring-white/90 sm:my-auto sm:rounded-3xl lg:rounded-[28px] animate-[welcomeCard_.45s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* AMBIENT GLOW */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-burgundy-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#c9a27a]/10 blur-[80px]" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={close}
          aria-label="Close welcome modal"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-charcoal-text/70 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-white hover:text-charcoal-text sm:right-4 sm:top-4"
        >
          <X className="h-4 w-4" />
        </button>

        {/* RESPONSIVE TWO-COLUMN LAYOUT */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
          {/* LEFT: IMAGE PANEL */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7efe9] via-[#fbf5f0] to-[#f0e4db] px-4 py-5 sm:p-7 lg:p-10">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-white/60 blur-3xl sm:h-64 sm:w-64" />
            </div>

            <div className="relative z-10 flex h-28 w-28 items-center justify-center sm:h-44 sm:w-44 lg:h-64 lg:w-64">
              <img
                src={machairaImg}
                alt="Machaira Waving"
                className="h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(114,47,34,0.2)] animate-[gentleWave_2.2s_ease-in-out_infinite]"
              />
            </div>

            <div className="relative z-10 mt-2 text-center sm:mt-4 lg:mt-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-burgundy-primary">
                Shalom Beloved,
              </span>
              <p className="mt-1 text-[11px] italic text-cool-gray sm:mt-2">
                I'm so excited to see you today!
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/40 sm:rounded-t-3xl lg:rounded-l-[28px] lg:rounded-tr-none" />
          </div>

          {/* RIGHT: CONTENT PANEL */}
          <div className="relative flex min-w-0 flex-col p-4 sm:p-7 lg:p-9">
            {/* HEADING */}
            <div className="border-b border-[#f0e4db]/80 pb-3 pr-8">
              <h1
                id="welcome-heading"
                className="text-[1.3rem] font-normal leading-tight tracking-[-0.03em] text-charcoal-text sm:text-[1.55rem]"
              >
                What if God wrote{" "}
                <span className="italic text-burgundy-primary">
                  you a letter today?
                </span>
              </h1>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 space-y-4">
              {/* TODAY'S DEVOTIONAL */}
              <button
                type="button"
                onClick={() => {
                  onTodayEpisode?.();
                  close();
                }}
                className="group relative flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-burgundy-primary via-[#8a3829] to-[#5e2016] p-3.5 text-left text-white shadow-[0_8px_22px_rgba(114,47,34,0.25)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-[22px] sm:p-5"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex min-w-0 items-center gap-3 sm:gap-4">


                  <div className="min-w-0">
                    <span className="block text-[13px] font-bold leading-snug tracking-tight text-white sm:text-[16px]">
                      Today's Devotional was written with you in mind
                    </span>
                    <span className="mt-1 block text-[10px] font-normal text-white/80 sm:text-[11px]">
                      Click to receive your word for the now
                    </span>
                  </div>
                </div>

                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 sm:ml-2 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4 text-white" />
                </span>
              </button>

              {/* MOOD / TOPIC GRID */}
              <div>
                <div className="mb-2">
                  <span className="block text-[9px] font-bold uppercase leading-relaxed tracking-[0.14em] text-cool-gray/80 sm:text-[10px] sm:tracking-[0.18em]">
                    Or should we first answer the question lingering on your mind?
                  </span>
                </div>

                <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto pr-1 custom-scrollbar sm:max-h-48 sm:grid-cols-2 lg:max-h-52">
                  {POPULAR_MOODS.map((mood) => (
                    <button
                      key={mood.categoryKey}
                      type="button"
                      onClick={() => handleMoodClick(mood.categoryKey)}
                      className="group relative flex min-w-0 cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#eadcd6] bg-white px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy-primary/40 hover:bg-[#fffcf9] hover:shadow-[0_4px_12px_rgba(80,30,20,0.06)]"
                    >
                      <span className="min-w-0 truncate pr-1 text-[11px] font-medium text-charcoal-text">
                        {mood.label}
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-soft-gray transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-burgundy-primary" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-4 border-t border-[#f0e4db]/80 pt-3 sm:mt-auto sm:pt-4">
              <p className="text-center text-[10px] italic leading-relaxed text-cool-gray sm:text-left sm:text-[11px]">
                "Every word is written like a love letter from God to you.
                Machaira with Apostle Bennie is a person you behold."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATIONS AND SCROLLBAR */}
      <style>{`
        @keyframes welcomeCard {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes gentleWave {
          0%, 50%, 100% {
            transform: rotate(0deg);
            transform-origin: 50% 65%;
          }
          25% {
            transform: rotate(4deg);
            transform-origin: 50% 65%;
          }
          75% {
            transform: rotate(-4deg);
            transform-origin: 50% 65%;
          }
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #eadcd6 transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eadcd6;
          border-radius: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[gentleWave_2\\.2s_ease-in-out_infinite\\],
          .animate-\\[welcomeCard_\\.45s_cubic-bezier\\(0\\.16\\,1\\,0\\.3\\,1\\)\\],
          .animate-\\[fadeIn_\\.3s_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
