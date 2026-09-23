import { useEffect } from "react";
import { X } from "lucide-react";
import TestimonyCommentsSection from "./TestimonyCommentsSection";

export default function TestimonyModal({ testimony, onClose }) {
  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!testimony) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [testimony]);

  // Close on Escape
  useEffect(() => {
    if (!testimony) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [testimony, onClose]);

  if (!testimony) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c0c09]/55 backdrop-blur-md animate-[fadeIn_.25s_ease-out]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[28px] bg-[#fdfaf7] shadow-[0_30px_80px_rgba(42,17,14,0.35)] ring-1 ring-white/90 animate-[modalIn_.35s_cubic-bezier(0.16,1,0.3,1)]">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#991313]/8 blur-[70px]" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#101A2B]/60 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-black/10 hover:text-[#101A2B]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto px-7 pb-7 pt-9 sm:px-10 sm:pb-10 sm:pt-11 custom-scrollbar">

          {/* Big quote mark */}
          <div className="font-serif text-6xl leading-none text-[#991313]">“</div>

          {/* Full testimony text */}
          <p className="mt-3 font-serif text-[17px] leading-8 text-[#202735] sm:text-[18px]">
            {testimony.content}
          </p>

          {/* Attached image (if any) */}
          {testimony.attachedImageUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <img
                src={testimony.attachedImageUrl}
                alt=""
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 border-t border-[#E5E7EB]" />

          {/* Author row */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E7E7] text-sm font-semibold text-[#991313]">
                {testimony.avatarUrl ? (
                  <img
                    src={testimony.avatarUrl}
                    alt={testimony.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  testimony.initials
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#101A2B]">
                  {testimony.name}
                </p>
                <p className="mt-0.5 text-xs text-[#991313]">
                  {testimony.category}
                </p>
              </div>
            </div>

            <span className="text-xs text-[#6B7280]">{testimony.date}</span>
          </div>

          {/* Engagement row */}
          <div className="mt-5 flex items-center gap-5 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7C3.2 5.6 5.3 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4c2.5 0 4.6 1.6 4.6 4.7Z" />
              </svg>
              {testimony.likes}
            </span>
          </div>

          <TestimonyCommentsSection testimonyId={testimony.id} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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