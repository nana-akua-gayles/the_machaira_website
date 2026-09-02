import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroQuotes, setHeroQuotes] = useState([]);
  const [recentDevotional, setRecentDevotional] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const [textAnimState, setTextAnimState] = useState('visible'); 
  const [imageAnimState, setImageAnimState] = useState('visible'); 
  const [animatingQuote, setAnimatingQuote] = useState(false);

  // Fetch all home data strictly from Supabase without fallbacks
  useEffect(() => {
    let isMounted = true;

    async function fetchHomeData() {
      try {
        setLoading(true);
        setFetchError(false);

        const [slidesRes, quotesRes, devotionalRes] = await Promise.all([
          supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
          supabase.from('hero_quotes').select('*').order('display_order', { ascending: true }),
          supabase.from('devotionals').select('id, title, excerpt, created_at').order('created_at', { ascending: false }).limit(1).maybeSingle()
        ]);

        if (!isMounted) return;

        if (slidesRes.error) throw slidesRes.error;
        if (quotesRes.error) throw quotesRes.error;

        setHeroSlides(slidesRes.data || []);
        setHeroQuotes(quotesRes.data || []);
        setRecentDevotional(devotionalRes.data || null);
      } catch (err) {
        console.error("Failed to load content from Supabase:", err.message);
        if (isMounted) {
          setFetchError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sophisticated Asynchronous Cinematic Transitions for Hero
  useEffect(() => {
    if (heroSlides.length <= 1 || heroQuotes.length === 0) return;

    const rotationInterval = setInterval(() => {
      setTextAnimState('fade-out');

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTextAnimState('fade-in');
        setTimeout(() => setTextAnimState('visible'), 50);
      }, 500);

      setTimeout(() => {
        setImageAnimState('fade-out');
        setTimeout(() => {
          setImageAnimState('fade-in');
          setTimeout(() => setImageAnimState('visible'), 50);
        }, 500);
      }, 300);

    }, 8000);

    const quoteTimer = setInterval(() => {
      setAnimatingQuote(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % heroQuotes.length);
        setAnimatingQuote(false);
      }, 400);
    }, 9500);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(quoteTimer);
    };
  }, [heroSlides.length, heroQuotes.length]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-burgundy-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError || heroSlides.length === 0 || heroQuotes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 text-center space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-navy-dark">Unable to load content</h2>
        <p className="text-sm text-cool-gray max-w-md mx-auto">
          Please check your Supabase connection, environment variables, or ensure data exists in your database tables.
        </p>
      </div>
    );
  }

  const slide = heroSlides[currentSlide] || heroSlides[0];
  const quoteItem = heroQuotes[currentQuote] || heroQuotes[0];

  const formattedDate = recentDevotional?.created_at 
    ? new Date(recentDevotional.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 space-y-24 overflow-hidden">

      {/* ================= BREATHTAKING CINEMATIC HERO SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <div className="lg:col-span-7 space-y-8 z-10">
          <div className={`space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            textAnimState === 'fade-out' ? 'opacity-0 -translate-y-4 scale-[0.98]' :
            textAnimState === 'fade-in' ? 'opacity-0 translate-y-4 scale-[0.98]' :
            'opacity-100 translate-y-0 scale-100'
          }`}>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] text-navy-dark">
              {slide.title_first} <br />
              <span className="font-serif italic font-normal text-burgundy-primary">{slide.title_highlight}</span> {slide.title_rest}
            </h1>

            <p className="text-base sm:text-lg text-cool-gray max-w-xl leading-relaxed">
              {slide.description}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button className="bg-burgundy-primary hover:bg-navy-dark text-white font-medium text-sm px-8 py-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-3 group">
                <span>{slide.button_text}</span>
                <svg className="w-4 h-4 text-white/90 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-2 max-w-md">
            <div className="p-5 bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-900/5 rounded-3xl relative">
              <div className={`transition-all duration-400 ease-out ${animatingQuote ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-burgundy-primary/10 flex items-center justify-center text-burgundy-primary shrink-0 font-serif font-bold text-sm shadow-inner">
                    “
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-charcoal-text font-medium leading-relaxed">
                      {quoteItem?.quote}
                    </p>
                    <p className="text-[11px] font-semibold text-cool-gray tracking-wider uppercase">— {quoteItem?.reference}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            
            <div className="absolute -inset-10 bg-linear-to-tr from-burgundy-primary/20 via-transparent to-navy-dark/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            
            <div className="relative overflow-visible">
              <div className="w-full relative overflow-hidden">
                <img 
                  src={slide.image} 
                  alt={slide.image_alt} 
                  className={`w-full h-auto object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    imageAnimState === 'fade-out' ? 'opacity-0 scale-105' :
                    imageAnimState === 'fade-in' ? 'opacity-0 scale-95' :
                    'opacity-100 scale-100'
                  }`}
                />
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ================= ULTRA-PREMIUM TODAY'S DEVOTIONAL SUMMARY SECTION ================= */}
      {recentDevotional && (
        <section className="pt-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-white/95 via-white/70 to-white/40 backdrop-blur-3xl border border-white/90 p-8 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] group">
            
            {/* Editorial backdrop typography watermark */}
            <div className="absolute right-[-2%] bottom-[-15%] font-serif italic text-[10rem] lg:text-[14rem] font-bold text-burgundy-primary/3 select-none pointer-events-none leading-none">
              M
            </div>

            {/* Ambient luxury radial glow */}
            <div className="absolute -left-32 -top-32 w-96 h-96 bg-burgundy-primary/10 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover:bg-burgundy-primary/20"></div>

            <div className="relative z-10 max-w-3xl space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-burgundy-primary tracking-widest uppercase">
                  The Word for the Now
                </span>
                {formattedDate && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-cool-gray tracking-wider uppercase bg-slate-100/80 px-3 py-1 rounded-lg">
                      {formattedDate}
                    </span>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy-dark leading-[1.15]">
                  {recentDevotional.title}
                </h2>
                
                <p className="text-sm sm:text-base text-cool-gray/90 leading-relaxed font-normal max-w-2xl">
                  {recentDevotional.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-6">
                <a 
                  href={`/devotional/${recentDevotional.id}`} 
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-burgundy-primary hover:bg-navy-dark text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-burgundy-primary/25 hover:shadow-2xl hover:-translate-y-0.5 group/btn"
                >
                  <span>Read Devotional</span>
                  <svg className="w-4 h-4 text-white/90 transition-transform duration-300 group-hover/btn:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ================= FEATURE CARDS GRID ================= */}
      <section className="pt-12 border-t border-slate-100/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 hover:border-burgundy-primary/30 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-burgundy-primary/10 text-burgundy-primary flex items-center justify-center transition-colors group-hover:bg-burgundy-primary group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-navy-dark">Daily Devotional</h3>
                <p className="text-xs text-cool-gray leading-relaxed">
                  Be refreshed daily with God's Word and practical insights for your life.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-28 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop" alt="Devotional" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="pt-4">
              <a href="#devotional" className="text-xs font-semibold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Today's Devotional &rarr;
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 hover:border-burgundy-primary/30 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-burgundy-primary/10 text-burgundy-primary flex items-center justify-center transition-colors group-hover:bg-burgundy-primary group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-navy-dark">Previous Episodes</h3>
                <p className="text-xs text-cool-gray leading-relaxed">
                  Watch or listen to powerful teachings that will build your faith.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-28 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop" alt="Episodes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="pt-4">
              <a href="#episodes" className="text-xs font-semibold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Episodes &rarr;
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 hover:border-burgundy-primary/30 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-burgundy-primary/10 text-burgundy-primary flex items-center justify-center transition-colors group-hover:bg-burgundy-primary group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-navy-dark">Community Forum</h3>
                <p className="text-xs text-cool-gray leading-relaxed">
                  Join meaningful discussions, ask questions, and grow together.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-28 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop" alt="Forum" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="pt-4">
              <a href="#forum" className="text-xs font-semibold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Join the Conversation &rarr;
              </a>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/80 hover:border-burgundy-primary/30 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-burgundy-primary/10 text-burgundy-primary flex items-center justify-center transition-colors group-hover:bg-burgundy-primary group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-navy-dark">Church Blog</h3>
                <p className="text-xs text-cool-gray leading-relaxed">
                  Stay updated with inspiring stories, announcements, and ministry updates.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-28 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500&auto=format&fit=crop" alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="pt-4">
              <a href="#blog" className="text-xs font-semibold text-burgundy-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read the Latest &rarr;
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}