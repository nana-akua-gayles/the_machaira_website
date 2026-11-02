import { useState, useEffect, useRef } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import devotionalImage from "../assets/images/seated.png";

export default function DevotionalOverlay({ onReadDevotional }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const snoozeTimer = useRef(null);

  useEffect(() => {
    const dismissedDate = localStorage.getItem(
      "devotional_prompt_dismissed_date"
    );

    if (dismissedDate === new Date().toDateString()) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsExpanded(false);
      setIsSnoozed(false);
    }, 120000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || isExpanded || isSnoozed) return;

    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 30000);

    return () => clearTimeout(expandTimer);
  }, [isVisible, isExpanded, isSnoozed]);

  useEffect(() => {
    return () => {
      if (snoozeTimer.current) {
        clearTimeout(snoozeTimer.current);
      }
    };
  }, []);

  const dismissForToday = () => {
    localStorage.setItem(
      "devotional_prompt_dismissed_date",
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
    if (snoozeTimer.current) {
      clearTimeout(snoozeTimer.current);
      snoozeTimer.current = null;
    }

    setIsVisible(false);
    setIsExpanded(false);
    setIsSnoozed(false);

    onReadDevotional?.();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsSnoozed(true);

    if (snoozeTimer.current) {
      clearTimeout(snoozeTimer.current);
    }

    snoozeTimer.current = setTimeout(() => {
      const dismissedDate = localStorage.getItem(
        "devotional_prompt_dismissed_date"
      );

      if (dismissedDate !== new Date().toDateString()) {
        setIsVisible(true);
        setIsSnoozed(false);
        setIsExpanded(true);
      }

      snoozeTimer.current = null;
    }, 120000);
  };

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
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .devotional-slide-up {
          animation: devotionalSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .devotional-reminder-image {
          filter: drop-shadow(0 8px 14px rgba(70, 27, 25, 0.12));
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
          className="devotional-slide-up fixed bottom-5 right-5 z-50 flex h-[140px] w-[140px] items-center justify-center bg-transparent transition-transform duration-300 hover:scale-105 sm:bottom-7 sm:right-7 sm:h-[180px] sm:w-[180px]"
        >
          <img
            src={devotionalImage}
            alt=""
            aria-hidden="true"
            className="devotional-reminder-image h-full w-full object-contain"
          />
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="Daily devotional reminder"
          className="devotional-slide-up fixed bottom-3 left-3 right-3 z-50 max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[26px] border border-[#E9DCD3] bg-[#FCF9F4] text-[#302625] shadow-[0_18px_60px_rgba(43,20,20,0.22)] sm:bottom-6 sm:left-auto sm:right-6 sm:w-[440px] lg:bottom-8 lg:right-8 lg:w-[580px] lg:max-w-[calc(100vw-4rem)]"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8EEE5] via-[#FCF9F4] to-[#F0DFD0] px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">

            <button
              type="button"
              onClick={handleClose}
              aria-label="Minimize reminder for two minutes"
              title="Remind me in two minutes"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E9DCD3] bg-white/85 text-[#76252B] transition-colors hover:bg-white sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            >
              <X size={17} />
            </button>

            <div className="relative z-10 flex items-center gap-4 sm:gap-5 lg:pt-8">
              <div className="min-w-0 flex-1">

                <h2 className="max-w-[290px] text-[21px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#302625] sm:text-[24px]">
                  Have you read today's devotional?
                </h2>

                <p className="mt-3 max-w-[300px] text-[12px] leading-[1.8] text-[#75645D] sm:text-[13px]">
                  Before you face the world, hear from the One who holds it all together.
                  Today has its own challenges. <br />
                   Don't walk into it empty. God left you a word on the table!
                </p>
              </div>

              <div className="relative h-[130px] w-[90px] shrink-0 self-end sm:h-[170px] sm:w-[120px] lg:h-[190px] lg:w-[150px]">
                <div className="absolute inset-y-0 -right-5 flex w-[130px] items-center justify-center sm:-right-7 sm:w-[170px] lg:w-[190px]">
                  <div className="absolute h-[110px] w-[110px] rounded-full bg-white/70 blur-xl sm:h-[150px] sm:w-[150px] lg:h-[170px] lg:w-[170px]" />
                  <img
                    src={devotionalImage}
                    className="devotional-reminder-image relative z-10 h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 px-5 py-4 sm:flex-row sm:gap-3 sm:px-7 sm:py-5">
            <button
              type="button"
              onClick={handleYes}
              className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5DAD0] bg-white px-4 py-3 text-xs font-semibold text-[#655650] transition-colors hover:bg-[#F6EEE7] sm:min-h-[50px] sm:text-[13px]"
            >
              <Check size={15} strokeWidth={2.2} />
              Yes, I have
            </button>

            <button
              type="button"
              onClick={handleNo}
              className="group flex min-h-[46px] flex-[1.25] items-center justify-center gap-2.5 rounded-xl bg-[#76252B] px-4 py-3 text-xs font-semibold text-[#FFF9F1] shadow-[0_5px_14px_rgba(118,37,43,0.16)] transition-all duration-200 hover:bg-[#5F1B21] sm:min-h-[50px] sm:text-[13px]"
            >
              No, take me there
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}