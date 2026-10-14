
import { useState, useEffect } from 'react';
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
    let active = true;

    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (active && data?.length) setSlides(data);
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSlides();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    let transitionTimer;
    let resetTimer;

    const interval = setInterval(() => {
      setTextAnimState('fade-out');
      setAnimatingQuote(true);

      transitionTimer = setTimeout(() => {
        setCurrentIndex((index) => (index + 1) % slides.length);
        setTextAnimState('fade-in');

        resetTimer = setTimeout(() => {
          setTextAnimState('idle');
          setAnimatingQuote(false);
        }, 450);
      }, 450);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(transitionTimer);
      clearTimeout(resetTimer);
    };
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || {};
  const bannerImage = currentSlide.image || localFallbackImage;

  const currentTestimonies = Array.isArray(currentSlide.testimonies)
    ? currentSlide.testimonies.slice(0, 2)
    : [
        { quote: currentSlide.testimony || 'A transformative word that anchors our faith daily.' },
        { quote: currentSlide.testimony_second || 'An indispensable guide for spiritual growth and clarity.' }
      ];

  const handleReadMore = () => {
    navigate(
      currentSlide.devotional_id
        ? `/devotional/${currentSlide.devotional_id}`
        : '/devotionals'
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60svh] w-full items-center justify-center bg-[#FBF9F5]">
        <span className="animate-pulse text-xs tracking-[0.2em] text-[#6E6563]">
          LOADING...
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex min-h-[600px] w-screen items-end overflow-hidden bg-[#101A2B] sm:min-h-[650px] lg:min-h-0 lg:h-[min(780px,88svh)]">
        
        {/* Background image */}
        <img
          key={bannerImage}
          src={bannerImage}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] sm:object-center"
        />

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101A2B]/95 via-[#101A2B]/45 to-[#101A2B]/10 sm:from-[#101A2B]/90 sm:via-[#101A2B]/30 lg:bg-gradient-to-r lg:from-[#101A2B]/80 lg:via-[#101A2B]/45 lg:to-transparent" />

        {/* Main content */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end px-5 pb-9 pt-36 sm:px-8 sm:pb-12 md:px-12 lg:min-h-full lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-16 lg:py-16 xl:px-20">
          
          <div className="min-w-0 lg:col-span-7 xl:col-span-6">
            <div
              className={`max-w-2xl space-y-4 text-white transition-all duration-500 ease-out sm:space-y-5 ${
                textAnimState === 'fade-out'
                  ? 'translate-y-3 opacity-0'
                  : textAnimState === 'fade-in'
                    ? 'translate-y-0 opacity-0'
                    : 'translate-y-0 opacity-100'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-xs">
                Highly Sought Episodes
              </p>

              <h1 className="break-words text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-[-0.04em]">
                {currentSlide.title_first}
                {currentSlide.title_highlight && (
                  <>
                    {' '}
                    <span className="font-normal text-burgundy-primary">
                      {currentSlide.title_highlight}
                    </span>
                  </>
                )}
                {currentSlide.title_rest && (
                  <>
                    <br className="hidden sm:block" /> {currentSlide.title_rest}
                  </>
                )}
              </h1>

              {currentSlide.description && (
                <p className="max-w-xl whitespace-pre-line text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                  {currentSlide.description}
                </p>
              )}

              <div className="pt-1">
                <button
                  onClick={handleReadMore}
                  className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-[#5A181C] px-5 py-3 text-sm font-semibold text-[#FBF9F5] shadow-lg transition-colors duration-300 hover:bg-[#3D0F12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101A2B]"
                >
                  Read more
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Testimonies: tablet/desktop only */}
            <div className="mt-7 hidden max-w-lg grid-cols-2 gap-3 lg:grid">
              {currentTestimonies.map((item, index) => (
                <div
                  key={`${currentIndex}-${index}`}
                  className={`rounded-xl border border-white/15 bg-[#101A2B]/60 p-4 shadow-lg backdrop-blur-md transition-all duration-500 ${
                    animatingQuote
                      ? 'translate-y-2 opacity-0'
                      : 'translate-y-0 opacity-100'
                  }`}
                >
                  <p className="mb-2 text-xl leading-none text-burgundy-primary" aria-hidden="true">
                    “
                  </p>
                  <p className="line-clamp-4 text-xs italic leading-relaxed text-white/90">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reserved breathing room for the image on desktop */}
          <div className="hidden lg:col-span-5 lg:block xl:col-span-6" />
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2 sm:bottom-6 sm:right-8 lg:bottom-8 lg:right-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setTextAnimState('idle');
                  setAnimatingQuote(false);
                }}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
