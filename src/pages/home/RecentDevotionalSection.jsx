import React, { useState, useEffect } from 'react';

export default function RecentDevotionalSection({ recentDevotional, formattedDate }) {
  if (!recentDevotional) return null;

  const [charCount, setCharCount] = useState(0);
  const fullText = recentDevotional.excerpt || '';

  useEffect(() => {
    setCharCount(0);
    if (!fullText) return;

    let startTime = null;
    let animationFrameId;
    const speedMsPerChar = 14;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextCount = Math.min(Math.floor(elapsed / speedMsPerChar), fullText.length);
      
      setCharCount(nextCount);

      if (nextCount < fullText.length) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [fullText]);

  const displayedText = fullText.slice(0, charCount);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 font-sans">
      <div className="space-y-4">
        
        {/* Header Label, Title & Date */}
        <div className="space-y-1.5">
          <span className="block text-[11px] tracking-[0.2em] uppercase text-burgundy-primary font-bold">
            Message For the Now
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-text">
            {recentDevotional.title}
          </h2>

          {formattedDate && (
            <span className="block text-xs text-cool-gray font-normal">
              {formattedDate}
            </span>
          )}
        </div>

        {/* Typing Excerpt */}
        <div className="max-w-3xl">
          <p className="text-sm sm:text-base font-normal text-cool-gray leading-relaxed min-h-12">
            {displayedText}
            {charCount < fullText.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-burgundy-primary animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Burgundy Button */}
        <div className="pt-2">
          <a 
            href={`/devotional/${recentDevotional.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-primary text-white hover:opacity-90 text-xs font-bold tracking-widest uppercase transition-opacity rounded-xl shadow-md"
          >
            <span>Read More</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </div>
  );
}