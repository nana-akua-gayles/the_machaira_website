import React from 'react';
import blogImage from "../../assets/images/blog.jpg";
import discussionImage from "../../assets/images/discussion.jpg";
import testimonyImage from "../../assets/images/testimony.jpg";

export default function ExploreCardsSection() {
  return (
    <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header with subtle fade-in */}
      <div className="mb-10 text-center max-w-md mx-auto space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2625] tracking-tight">
          Journey Onward
        </h2>
        <div className="w-12 h-0.5 bg-[#5A181C]/30 mx-auto rounded-full" />
      </div>

      {/* Grid for 3 Cards - Evenly spread */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        {/* Card 1: Discussion Forum */}
        <a 
          href="/forum" 
          className="group relative bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(90,24,28,0.12)] hover:border-[#5A181C]/30 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '200ms' }}
        >
          {/* Top Image Container - Taller/Longer */}
          <div className="w-full h-48 overflow-hidden bg-stone-100 relative">
            <img 
              src={discussionImage}
              alt="Discussion Forum" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-25 transition-opacity" />
          </div>

          {/* Bottom Content Container */}
          <div className="p-5 flex flex-col grow justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight group-hover:text-[#5A181C] transition-colors duration-300">
                Discussion Forum
              </h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                A space to reason together, bear one another and grow into the fullness of Christ.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#5A181C]/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A181C]">
                Join a Conversation
              </span>
              <div className="w-7 h-7 rounded-full bg-[#5A181C]/5 flex items-center justify-center text-[#5A181C] group-hover:bg-[#5A181C] group-hover:text-white transition-all duration-300 shadow-sm group-hover:rotate-45">
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </a>

        {/* Card 2: Ministry Blog */}
        <a 
          href="/blog" 
          className="group relative bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(90,24,28,0.12)] hover:border-[#5A181C]/30 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '300ms' }}
        >
          {/* Top Image Container - Taller/Longer */}
          <div className="w-full h-48 overflow-hidden bg-stone-100 relative">
            <img 
              src={blogImage}
              alt="Ministry Blog" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-25 transition-opacity" />
          </div>

          {/* Bottom Content Container */}
          <div className="p-5 flex flex-col grow justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight group-hover:text-[#5A181C] transition-colors duration-300">
                Ministry Blog
              </h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                It's more than information - impartation. Weighty insights, prophetic reflections and truth that shape Christ in you!
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#5A181C]/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A181C]">
                Read Articles
              </span>
              <div className="w-7 h-7 rounded-full bg-[#5A181C]/5 flex items-center justify-center text-[#5A181C] group-hover:bg-[#5A181C] group-hover:text-white transition-all duration-300 shadow-sm group-hover:rotate-45">
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </a>

        {/* Card 3: Testimonies */}
        <a 
          href="/testimonies" 
          className="group relative bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(90,24,28,0.12)] hover:border-[#5A181C]/30 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '400ms' }}
        >
          {/* Top Image Container - Taller/Longer */}
          <div className="w-full h-48 overflow-hidden bg-stone-100 relative">
            <img 
              src={testimonyImage}
              alt="Testimonies" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-25 transition-opacity" />
          </div>

          {/* Bottom Content Container */}
          <div className="p-5 flex flex-col grow justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight group-hover:text-[#5A181C] transition-colors duration-300">
                Testimonies
              </h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                And they overcame! Be encouraged by real accounts of breakthroughs, transformation, and answered prayers.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#5A181C]/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A181C]">
                Read Testimonies
              </span>
              <div className="w-7 h-7 rounded-full bg-[#5A181C]/5 flex items-center justify-center text-[#5A181C] group-hover:bg-[#5A181C] group-hover:text-white transition-all duration-300 shadow-sm group-hover:rotate-45">
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </a>

      </div>
    </section>
  );
}