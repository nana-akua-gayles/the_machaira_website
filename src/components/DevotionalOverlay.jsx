import { useState, useEffect, useRef } from 'react';
import { BookOpen, X, Check, ArrowRight } from 'lucide-react';

export default function DevotionalOverlay({ onReadDevotional }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const snoozeTimer = useRef(null);

  // Show the compact reminder 2 minutes after arriving on the screen.
  useEffect(() => {
    const dismissedDate = localStorage.getItem(
      'devotional_prompt_dismissed_date'
    );

    if (dismissedDate === new Date().toDateString()) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsExpanded(false);
      setIsSnoozed(false);
    }, 120000);

    return () => clearTimeout(timer);
  }, []);

  // Expand 30 seconds after the compact reminder appears.
  useEffect(() => {
    if (!isVisible || isExpanded || isSnoozed) return;

    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 30000);

    return () => clearTimeout(expandTimer);
  }, [isVisible, isExpanded, isSnoozed]);

  // Clean up any pending timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (snoozeTimer.current) {
        clearTimeout(snoozeTimer.current);
      }
    };
  }, []);

  const dismissForToday = () => {
    localStorage.setItem(
      'devotional_prompt_dismissed_date',
      new Date().toDateString()
    );

    if (snoozeTimer.current) {
      clearTimeout(snoozeTimer.current);
      snoozeTimer.current = null;
    }

    setIsSnoozed(true);
    setIsVisible(false);
    setIsExpanded(false);
  };

  const handleYes = () => {
    dismissForToday();
  };

  const handleNo = () => {
    dismissForToday();
    onReadDevotional?.();
  };

  // Minimize the reminder and wait a full 2 minutes before reopening it.
  const handleClose = () => {
    setIsSnoozed(true);
    setIsExpanded(false);

    if (snoozeTimer.current) {
      clearTimeout(snoozeTimer.current);
    }

    snoozeTimer.current = setTimeout(() => {
      const dismissedDate = localStorage.getItem(
        'devotional_prompt_dismissed_date'
      );

      if (dismissedDate !== new Date().toDateString()) {
        setIsSnoozed(false);
        setIsExpanded(true);
      }

      snoozeTimer.current = null;
    }, 120000);
  };

  // Open the reminder immediately if the user taps the floating button.
  const handleOpen = () => {
    if (snoozeTimer.current) {
      clearTimeout(snoozeTimer.current);
      snoozeTimer.current = null;
    }

    setIsSnoozed(false);
    setIsExpanded(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes devotionalSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .devotional-slide-up {
          animation: devotionalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .devotional-slide-up {
            animation: none;
          }
        }
      `}</style>

      {!isExpanded ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open today's devotional reminder"
          title="Today's devotional"
          className="devotional-slide-up fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#E8D8D3] bg-[#FAF7F2] text-[#76252B] shadow-[0_8px_25px_rgba(43,20,20,0.16)] transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        >
          <BookOpen size={19} strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#FAF7F2] bg-[#8C3036]" />
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="Daily devotional reminder"
          className="devotional-slide-up fixed bottom-3 left-3 right-3 z-50 overflow-hidden rounded-[20px] border border-[#E9DCD3] bg-[#FCF9F4] text-[#302625] shadow-[0_14px_45px_rgba(43,20,20,0.18)] sm:bottom-5 sm:left-auto sm:right-5 sm:w-[390px] lg:bottom-8 lg:right-8 lg:w-auto lg:max-w-[620px] lg:rounded-[24px]"
        >
          {/* Compact header */}
          <div className="flex items-center gap-3 px-3.5 pb-3 pt-3.5 sm:px-4 sm:pb-3.5 sm:pt-4 lg:gap-4 lg:px-5 lg:py-4">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#76252B] text-[#FFF9F1] shadow-sm sm:h-11 sm:w-11">
              <BookOpen size={19} strokeWidth={1.7} />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#FCF9F4] bg-[#D2A66B]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#8B3438] sm:text-[10px]">
                  A moment with God
                </span>
              </div>
              <p className="text-[13px] font-semibold leading-snug tracking-[-0.02em] text-[#302625] sm:text-sm">
                Have you read today's devotional?
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Minimize reminder for two minutes"
              title="Remind me in two minutes"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9A8880] transition-colors hover:bg-[#F0E7DF] hover:text-[#76252B]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Fine divider */}
          <div className="mx-3.5 h-px bg-[#EDE3DA] sm:mx-4 lg:mx-5" />

          {/* Compact actions */}
          <div className="flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5">
            <button
              type="button"
              onClick={handleYes}
              className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E5DAD0] bg-white/70 px-2.5 py-2 text-[11px] font-semibold text-[#655650] transition-colors hover:bg-[#F0E7DF] sm:text-xs lg:flex-none lg:px-3.5"
            >
              <Check size={13} strokeWidth={2.2} />
              Yes, I have
            </button>

            <button
              type="button"
              onClick={handleNo}
              className="group flex min-h-9 flex-[1.15] items-center justify-center gap-2 rounded-xl bg-[#76252B] px-3 py-2 text-[11px] font-semibold text-[#FFF9F1] shadow-sm transition-colors hover:bg-[#5F1B21] sm:text-xs lg:flex-none lg:px-4"
            >
              Continue reading
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
