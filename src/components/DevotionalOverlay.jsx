import React, { useState, useEffect } from 'react';
import { BookOpen, X, Check, ArrowRight } from 'lucide-react';

export default function DevotionalOverlay({ onReadDevotional }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if the user already completed/dismissed it today
    const dismissedDate = localStorage.getItem('devotional_prompt_dismissed_date');
    const today = new Date().toDateString();

    if (dismissedDate === today) {
      setIsVisible(false);
      return;
    }

    // Initial show delay: show the collapsed book icon after 3 seconds of browsing
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsExpanded(false); // Start collapsed as just the icon
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Automatically expand the badge into the full card after it appears
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 1500); 
      return () => clearTimeout(expandTimer);
    }
  }, [isVisible]);

  // Handle "Yes" (User has read it -> Hide for the rest of the day)
  const handleYes = () => {
    const today = new Date().toDateString();
    localStorage.setItem('devotional_prompt_dismissed_date', today);
    setIsVisible(false);
  };

  // Handle "No" (User wants to read it -> Mark as read for today and take them there)
  const handleNo = () => {
    const today = new Date().toDateString();
    localStorage.setItem('devotional_prompt_dismissed_date', today);
    setIsVisible(false);
    
    if (onReadDevotional) {
      onReadDevotional();
    }
  };

  // Handle "Close/X" (Collapse back down to just the icon, snooze for 2 mins)
  const handleClose = () => {
    setIsExpanded(false);
    
    // 2 minutes in milliseconds = 120,000
    setTimeout(() => {
      const dismissedDate = localStorage.getItem('devotional_prompt_dismissed_date');
      const today = new Date().toDateString();
      if (dismissedDate !== today) {
        setIsVisible(true);
        setIsExpanded(true);
      }
    }, 120000);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Collapsed: Floating Red Book Icon Badge */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#FAF8F5] text-burgundy-primary border border-stone-200 shadow-xl shadow-stone-300/40 flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up group"
          title="Open today's devotional prompt"
        >
          <BookOpen size={20} className="transition-transform duration-300 group-hover:rotate-6" />
          {/* Red status indicator ping dot */}
          <span className="absolute top-2 right-2 w-3 h-3 bg-burgundy-primary rounded-full ring-2 ring-[#FAF8F5]"></span>
        </button>
      ) : (
        /* Expanded: Full Classy Prompt Card with Red Accents */
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-5 bg-[#FAF8F5] text-[#2B2625] px-6 py-4 rounded-[1.75rem] border border-stone-200/80 shadow-2xl shadow-stone-300/50 backdrop-blur-md animate-slide-up">
          
          {/* Icon */}
          <div className="w-10 h-10 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center text-burgundy-primary shrink-0">
            <BookOpen size={18} />
          </div>

          {/* Prompt Text */}
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold tracking-widest text-burgundy-primary uppercase">Daily Reflection</p>
            <p className="text-sm font-medium text-[#2B2625]">Have you read today's devotional?</p>
          </div>

          {/* Action Buttons (Yes / No) */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <button
              onClick={handleYes}
              className="flex items-center gap-1.5 bg-stone-200/70 hover:bg-stone-300 text-[#2B2625] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              title="Hide for today"
            >
              <Check size={13} className="text-stone-700" />
              <span>Yes</span>
            </button>

            <button
              onClick={handleNo}
              className="flex items-center gap-1.5 bg-[#2B2625] hover:bg-burgundy-primary text-[#FAF8F5] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm cursor-pointer group"
            >
              <span>No</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-700 p-1 -mr-2 transition-colors cursor-pointer"
            title="Minimize"
          >
            <X size={16} />
          </button>

        </div>
      )}
    </>
  );
}