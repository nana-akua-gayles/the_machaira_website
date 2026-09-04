import React from 'react';

export default function ScriptureCard({ quoteItem, animatingQuote }) {
  if (!quoteItem) return null;

  return (
    <div className="max-w-md">
      <div className="p-6 bg-white/85 backdrop-blur-md border border-[#5A181C]/10 rounded-2xl shadow-sm relative">
        <div className={`transition-all duration-400 ease-out ${animatingQuote ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex gap-4 items-start">
            <div className="font-serif text-[#5A181C] text-3xl leading-none font-semibold select-none">
              “
            </div>
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm text-[#2B2625] font-normal leading-relaxed italic">
                {quoteItem.quote}
              </p>
              <p className="text-[11px] font-semibold text-[#5A181C] tracking-wider uppercase">— {quoteItem.reference}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}