import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import localFallbackImage from '../../assets/images/book1.png';

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textAnimState, setTextAnimState] = useState('idle');
  const [animatingQuote, setAnimatingQuote] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  
  const currentTestimonies = Array.isArray(currentSlide.testimonies) 
    ? currentSlide.testimonies.slice(0, 2) 
    : [
        { quote: currentSlide.testimony || "A transformative word that anchors our faith daily." },
        { quote: currentSlide.testimony_second || "An indispensable guide for spiritual growth and clarity." }
      ];

  const handleReadMore = () => {
    if (currentSlide.devotional_id) {
      navigate(`/devotional/${currentSlide.devotional_id}`);
    } else {
      navigate('/devotionals');
    }
  };

  return (
    <div className="relative w-full">
      <section 
        className="relative w-screen min-h-[620px] sm:min-h-screen left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] m-0 p-0 flex items-center bg-cover bg-[65%_center] lg:bg-center bg-no-repeat overflow-hidden transition-all duration-1000"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        {/* Keep the photo unobstructed on mobile. The copy lives in a slim
            transparent sliding strip anchored to the bottom of the image. */}
        <div className="relative z-10 flex min-h-[620px] w-full max-w-7xl mx-auto items-end px-0 pb-0 sm:min-h-screen sm:px-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-16 lg:py-20">
          
          <div className="w-full space-y-3 border-t border-white/20 bg-[#101A2B]/35 px-5 py-5 text-white backdrop-blur-[2px] sm:px-7 lg:col-span-7 lg:space-y-5 lg:border-0 lg:bg-transparent lg:p-0 lg:text-inherit lg:backdrop-blur-none">
            <div className={`space-y-5 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              textAnimState === 'fade-out' ? 'opacity-0 -translate-x-8 lg:-translate-x-0 lg:-translate-y-4' :
              textAnimState === 'fade-in' ? 'opacity-0 translate-x-8 lg:translate-x-0 lg:translate-y-4' :
              'opacity-100 translate-x-0 lg:translate-y-0'
            }`}>

              <p className="text-white/85 lg:text-[#5A181C] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Highly Sought Episodes
              </p>

              <h1 className="text-[clamp(1.8rem,7vw,2.5rem)] sm:text-3xl lg:text-5xl font-bold tracking-tight text-white lg:text-[#2B2625] leading-[1.12]">
                {currentSlide.title_first} <br />
                <span className="italic font-normal text-white lg:text-[#5A181C]">{currentSlide.title_highlight}</span> {currentSlide.title_rest}
              </h1>

              <p className="text-xs sm:text-sm text-white/90 lg:text-[#6E6563] max-w-lg leading-relaxed font-light whitespace-pre-line">
                {currentSlide.description}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-4">
                <button 
                  onClick={handleReadMore}
                  className="bg-[#5A181C] hover:bg-[#3D0F12] text-[#FBF9F5] font-medium text-xs px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2.5 shadow-md group cursor-pointer"
                >
                  <span>Read more</span>
                  <svg className="w-3.5 h-3.5 text-[#FBF9F5]/80 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="hidden pt-2 max-w-md lg:block">
              <div className={`space-y-2 transition-all duration-500 ease-out ${animatingQuote ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
                {currentTestimonies.map((item, index) => (
                  <div key={index} className="p-3 bg-white/85 backdrop-blur-md border border-[#5A181C]/10 rounded-xl shadow-sm relative flex flex-col justify-between">
                    <div className="flex gap-2 items-start">
                      <div className="text-[#5A181C] text-base leading-none font-semibold select-none">
                        “
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] sm:text-[10px] text-[#2B2625] font-normal leading-relaxed italic whitespace-pre-line">
                          {item.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block" />

        </div>
      </section>
    </div>
  );
}