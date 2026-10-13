import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; 
import WaysToPartner from './WaysToPartner';
import PartnershipStories from './PartnershipStories';
import BecomePartner from './BecomePartner';
import './PartnershipMotion.css';

export default function Partnership() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchHeroImages() {
      try {
        const { data, error } = await supabase
          .from('partnership_cards')
          .select('image_url');

        if (error) {
          console.error('Error fetching images:', error.message);
        } else if (data && data.length > 0) {
          const urls = data.map((item) => ({ publicUrl: item.image_url }));
          setHeroImages(urls);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroImages();
  }, []);

  // Automatic Smooth Sliding Effect
  useEffect(() => {
    if (heroImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [heroImages.length, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1));
  };

  return (
    <div className="min-h-screen bg-parchment text-charcoal-text flex flex-col">
      
      {/* 1. HERO CAROUSEL SECTION */}
      <section 
        className="relative w-full h-[68svh] min-h-[470px] max-h-[780px] md:h-120 md:min-h-0 bg-navy-dark overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-soft-gray text-xs tracking-widest animate-pulse">
            LOADING HERO...
          </div>
        ) : heroImages.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-soft-gray text-xs tracking-widest">
            NO IMAGES AVAILABLE
          </div>
        ) : (
          <>
            {/* Background Images with Smooth Transition */}
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out w-full h-full ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={image.publicUrl}
                  alt={`Hero Slide ${index + 1}`}
                  className="w-full h-full object-cover partnership-hero-image"
                />
              </div>
            ))}

            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#101A2B]/80 via-transparent to-[#101A2B]/10" />
            <div className="pointer-events-none absolute bottom-16 left-6 right-6 z-20 md:bottom-14 md:left-16">
              <p className="text-white/70 text-[10px] md:text-xs tracking-[.28em] uppercase mb-3">Machaira / Partnership</p>
              <h1 className="text-white text-[clamp(2.8rem,10vw,6rem)] font-bold tracking-[-.055em] leading-[.95] max-w-3xl">Together, we<br /><span className="text-white/80">carry the Word.</span></h1>
              <p className="text-white/80 text-xs md:text-sm mt-4 max-w-md leading-relaxed">One mission. Many hands. Generations transformed.</p>
            </div>
            <div className="absolute left-0 bottom-0 right-0 z-30 bg-white/15 h-[2px]">
              {!isPaused && <div key={currentIndex} className="partnership-hero-progress" />}
            </div>
            {/* Chevron Navigation Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-dark/60 hover:bg-navy-dark text-parchment flex items-center justify-center backdrop-blur-md transition-all z-30 shadow-md opacity-80 hover:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-dark/60 hover:bg-navy-dark text-parchment flex items-center justify-center backdrop-blur-md transition-all z-30 shadow-md opacity-80 hover:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-5 right-5 md:right-auto md:bottom-4 left-auto md:left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-navy-dark/50 px-3.5 py-2 rounded-full backdrop-blur-md">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? 'w-6 h-2 bg-burgundy-primary'
                      : 'w-2 h-2 bg-soft-gray hover:bg-parchment'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>


      {/* 3. OTHER SECTIONS */}
      <PartnershipStories />

      {/* 2. WAYS TO PARTNER COMPONENT */}
      <WaysToPartner />

      <BecomePartner />

    </div>
  );
}