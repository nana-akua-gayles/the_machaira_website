import React from 'react';
import localFallbackImage from '../../assets/images/book1.png';

export default function HeroSection({ slide, quoteItem, textAnimState, animatingQuote }) {
  const bannerImage = slide?.image || localFallbackImage;

  return (
    <div className="relative w-full">
      <section 
        className="relative w-screen min-h-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] m-0 p-0 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
          
          <div className="lg:col-span-7 space-y-8">
            <div className={`space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              textAnimState === 'fade-out' ? 'opacity-0 -translate-y-3' :
              textAnimState === 'fade-in' ? 'opacity-0 translate-y-3' :
              'opacity-100 translate-y-0'
            }`}>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-[#2B2625] leading-[1.08]">
                {slide.title_first} <br />
                <span className="font-serif italic font-normal text-[#5A181C]">{slide.title_highlight}</span> {slide.title_rest}
              </h1>

              <p className="text-base sm:text-lg text-[#6E6563] max-w-lg leading-relaxed font-light">
                {slide.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button className="bg-[#5A181C] hover:bg-[#3D0F12] text-[#FBF9F5] font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-md group">
                  <span>{slide.button_text}</span>
                  <svg className="w-4 h-4 text-[#FBF9F5]/80 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Floating Quote Box matching mockup */}
            <div className="pt-2 max-w-md">
              <div className="p-6 bg-white/80 backdrop-blur-md border border-[#5A181C]/10 rounded-2xl shadow-sm relative">
                <div className={`transition-all duration-400 ease-out ${animatingQuote ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex gap-4 items-start">
                    <div className="font-serif text-[#5A181C] text-2xl leading-none font-semibold select-none">
                      “
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs sm:text-sm text-[#2B2625] font-normal leading-relaxed italic">
                        {quoteItem?.quote}
                      </p>
                      <p className="text-[11px] font-semibold text-[#5A181C] tracking-wider uppercase">— {quoteItem?.reference}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block" />

        </div>
      </section>
    </div>
  );
}