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

    return () => {
      active = false;
    };
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
        {
          quote:
            currentSlide.testimony ||
            'A transformative word that anchors our faith daily.',
        },
        {
          quote:
            currentSlide.testimony_second ||
            'An indispensable guide for spiritual growth and clarity.',
        },
      ];

  const handleReadMore = () => {
    navigate(
      currentSlide.devotional_id
        ? `/devotional/${currentSlide.devotional_id}`
        : '/devotionals'
    );
  };

  const handleSlideChange = (index) => {
    setCurrentIndex(index);
    setTextAnimState('idle');
    setAnimatingQuote(false);
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
    <div className="relative w-full min-w-0">
      <section className="relative isolate flex min-h-[560px] w-full min-w-0 items-end overflow-hidden bg-black sm:min-h-[600px] lg:min-h-[640px] lg:items-center xl:min-h-[680px]">
        {/* Background image */}
        <img
          key={bannerImage}
          src={bannerImage}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] sm:object-center"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-black/10" />

        {/* Main content */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] min-w-0 grid-cols-1 items-end gap-8 px-5 pb-16 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:px-12 lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-10 lg:py-20 xl:gap-10 xl:px-16 2xl:px-20">
          <div className="min-w-0 max-w-full lg:col-span-8 xl:col-span-7">
            <div
              className={`w-full min-w-0 max-w-3xl space-y-4 text-white transition-all duration-500 ease-out sm:space-y-5 ${
                textAnimState === 'fade-out'
                  ? 'translate-y-3 opacity-0'
                  : textAnimState === 'fade-in'
                    ? 'translate-y-0 opacity-0'
                    : 'translate-y-0 opacity-100'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 [overflow-wrap:anywhere] sm:text-xs sm:tracking-[0.22em]">
                Highly Sought Episodes
              </p>

              <h1 className="max-w-full [overflow-wrap:anywhere] text-[clamp(2rem,4.2vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.035em] sm:text-[clamp(2.5rem,4vw,4.5rem)] lg:text-[clamp(2.75rem,3.5vw,4.25rem)]">
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
                    <br className="hidden sm:block" />{' '}
                    {currentSlide.title_rest}
                  </>
                )}
              </h1>

              {currentSlide.description && (
                <p className="max-w-2xl whitespace-pre-line [overflow-wrap:anywhere] text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-[1.05rem]">
                  {currentSlide.description}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleReadMore}
                  className="group inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-lg bg-[#5A181C] px-5 py-3 text-sm font-semibold text-[#FBF9F5] shadow-lg transition-colors duration-300 hover:bg-[#3D0F12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span>Read more</span>

                  <svg
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
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

            {/* Testimonies without glassmorphism */}
            <div className="mt-7 hidden w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid">
              {currentTestimonies.map((item, index) => (
                <div
                  key={`${currentIndex}-${index}`}
                  className={`min-w-0 max-w-full rounded-xl border border-white/15 bg-black/70 p-3 shadow-lg transition-all duration-500 sm:p-4 ${
                    animatingQuote
                      ? 'translate-y-2 opacity-0'
                      : 'translate-y-0 opacity-100'
                  }`}
                >
                  <p
                    className="mb-2 text-xl leading-none text-burgundy-primary"
                    aria-hidden="true"
                  >
                    “
                  </p>

                  <p className="line-clamp-4 [overflow-wrap:anywhere] text-xs italic leading-relaxed text-white/90 sm:text-sm">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flexible image space on desktop */}
          <div className="hidden min-w-0 lg:col-span-4 lg:block xl:col-span-5" />
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-end gap-2 sm:bottom-6 sm:right-8 lg:bottom-8 lg:right-10 xl:right-12">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : undefined}
                className={`h-2 shrink-0 rounded-full transition-all duration-300 ${
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