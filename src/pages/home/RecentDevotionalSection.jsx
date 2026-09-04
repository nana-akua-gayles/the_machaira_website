import React from 'react';

export default function RecentDevotionalSection({ recentDevotional, formattedDate }) {
  if (!recentDevotional) return null;

  return (
    <section className="pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#3D0F12] text-[#FBF9F5] p-8 sm:p-12 lg:p-14 shadow-xl border border-white/10 group">
        
        {/* Dynamic ambient background mesh gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute -right-12 -bottom-16 font-sans italic text-[12rem] lg:text-[14rem] font-bold text-white/3 select-none pointer-events-none leading-none transition-transform duration-700 group-hover:scale-105">
          M
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-stone-200">
              Message For the Now
            </span>
            {formattedDate && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-[11px] font-medium text-stone-300 tracking-wider uppercase">
                  {formattedDate}
                </span>
              </>
            )}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white leading-snug">
              {recentDevotional.title}
            </h2>
            
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
              {recentDevotional.excerpt}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-6">
            <a 
              href={`/devotional/${recentDevotional.id}`} 
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#5A181C] hover:bg-[#F0ECE1] text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-xl shadow-lg hover:-translate-y-0.5 group/btn"
            >
              <span>Read Devotional</span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}