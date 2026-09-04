import React from 'react';
import blogImage from "../../assets/images/blog.jpg";
import discussionImage from "../../assets/images/discussion.jpg";
import previousImage from "../../assets/images/previous.jpg";
import testimonyImage from "../../assets/images/testimony.jpg";

export default function ExploreCardsSection() {
  return (
    <section className="pt-6">
      <div className="mb-10 text-center max-w-lg mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2B2625] tracking-tight">Journey Onward</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Card 1: Previous Episodes */}
        <a 
          href="#episodes" 
          className="group relative bg-[#5A181C]/5 border border-[#5A181C]/10 p-6 rounded-2xl transition-all duration-700 hover:bg-white hover:border-[#5A181C]/30 hover:shadow-lg flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '100ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight">Previous Episodes</h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                Missed an episode? You can still revisit, God's word is timeless and always in season.
              </p>
            </div>

            <div className="sm:col-span-5 w-full h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
              <img 
                src={previousImage} 
                alt="Previous Episodes" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center gap-1.5 text-xs font-medium text-[#5A181C] group-hover:translate-x-1 transition-transform">
            <span>Visit Archive</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>

        {/* Card 2: Discussion Forum */}
        <a 
          href="#forum" 
          className="group relative bg-[#5A181C]/5 border border-[#5A181C]/10 p-6 rounded-2xl transition-all duration-700 hover:bg-white hover:border-[#5A181C]/30 hover:shadow-lg flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '200ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight">Discussion Forum</h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                A space to reason together, bear one another and grow into the fullness of Christ.
              </p>
            </div>

            <div className="sm:col-span-5 w-full h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
              <img 
                src={discussionImage}
                alt="Discussion Forum" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center gap-1.5 text-xs font-medium text-[#5A181C] group-hover:translate-x-1 transition-transform">
            <span>Join a Conversation</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>

        {/* Card 3: Ministry Blog */}
        <a 
          href="#blog" 
          className="group relative bg-[#5A181C]/5 border border-[#5A181C]/10 p-6 rounded-2xl transition-all duration-700 hover:bg-white hover:border-[#5A181C]/30 hover:shadow-lg flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '300ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight">Ministry Blog</h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                It's more than information - impartation. Weighty insights, prophetic reflections and truth that shape Christ in you!
              </p>
            </div>

            <div className="sm:col-span-5 w-full h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
              <img 
                src={blogImage}
                alt="Ministry Blog" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center gap-1.5 text-xs font-medium text-[#5A181C] group-hover:translate-x-1 transition-transform">
            <span>Read Articles</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>

        {/* Card 4: Testimonies */}
        <a 
          href="#testimonies" 
          className="group relative bg-[#5A181C]/5 border border-[#5A181C]/10 p-6 rounded-2xl transition-all duration-700 hover:bg-white hover:border-[#5A181C]/30 hover:shadow-lg flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards"
          style={{ animationDelay: '400ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-base font-semibold text-[#2B2625] tracking-tight">Testimonies</h3>
              <p className="text-xs text-[#6E6563] leading-relaxed font-normal">
                And they overcame! Be encouraged by real accounts of breakthroughs, transformation, and answered prayers.
              </p>
            </div>

            <div className="sm:col-span-5 w-full h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
              <img 
                src={testimonyImage}
                alt="Testimonies" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center gap-1.5 text-xs font-medium text-[#5A181C] group-hover:translate-x-1 transition-transform">
            <span>Read Testimonies</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>

      </div>
    </section>
  );
}