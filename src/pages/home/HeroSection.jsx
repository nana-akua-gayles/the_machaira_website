import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import localFallbackImage from '../../assets/images/book1.png';

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textAnimState, setTextAnimState] = useState('idle');
  const [animatingQuote, setAnimatingQuote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setTextAnimState('fade-out');
      setAnimatingQuote(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setTextAnimState('fade-in');

        setTimeout(() => {
          setTextAnimState('idle');
          setAnimatingQuote(false);
        }, 400);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#FBF9F5]">Loading...</div>;
  }

  const currentSlide = slides[currentIndex] || {};
  const bannerImage = currentSlide.image || localFallbackImage;

  return (
    <div className="relative w-full">
      <section 
        className="relative w-screen min-h-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] m-0 p-0 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden transition-all duration-1000"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
          
          <div className="lg:col-span-7 space-y-6">
            <div className={`space-y-6 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              textAnimState === 'fade-out' ? 'opacity-0 -translate-y-4 scale-[0.99]' :
              textAnimState === 'fade-in' ? 'opacity-0 translate-y-4 scale-[0.99]' :
              'opacity-100 translate-y-0 scale-100'
            }`}>

              <p className="text-[#5A181C] text-xs font-bold tracking-[0.25em] uppercase">
                Highly Sought Episodes
              </p>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2B2625] leading-[1.08]">
                {currentSlide.title_first} <br />
                <span className="italic font-normal text-[#5A181C]">{currentSlide.title_highlight}</span> {currentSlide.title_rest}
              </h1>

              <p className="text-sm sm:text-base text-[#6E6563] max-w-lg leading-relaxed font-light whitespace-pre-line">
                {currentSlide.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button className="bg-[#5A181C] hover:bg-[#3D0F12] text-[#FBF9F5] font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-md group">
                  <span>Read more</span>
                  <svg className="w-4 h-4 text-[#FBF9F5]/80 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="pt-2 max-w-md">
              <div className="p-6 bg-white/80 backdrop-blur-md border border-[#5A181C]/10 rounded-2xl shadow-sm relative">
                <div className={`transition-all duration-500 ease-out ${animatingQuote ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex gap-4 items-start">
                    <div className="text-[#5A181C] text-2xl leading-none font-semibold select-none">
                      “
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] sm:text-xs text-[#2B2625] font-normal leading-relaxed italic whitespace-pre-line">
                        {currentSlide.testimony}
                      </p>
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