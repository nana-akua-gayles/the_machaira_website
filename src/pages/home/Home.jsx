import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import HeroSection from "./HeroSection";
import RecentDevotionalSection from "./RecentDevotionalSection";
import ExploreCardsSection from "./ExploreCardsSection";
import NewsfeedSection from "./NewsfeedSection";

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

  useEffect(() => {
    if (heroSlides.length <= 1 || heroQuotes.length === 0) return;

    // Simultaneous text and background image crossfade transition
    const rotationInterval = setInterval(() => {
      setTextAnimState('fade-out');
      setImageAnimState('fade-out');

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTextAnimState('fade-in');
        setImageAnimState('fade-in');
        setTimeout(() => {
          setTextAnimState('visible');
          setImageAnimState('visible');
        }, 50);
      }, 500);

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
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-32 flex justify-center items-center bg-[#FBF9F5]">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-[#5A181C] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError || heroSlides.length === 0 || heroQuotes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-32 text-center space-y-4 bg-[#FBF9F5]">
        <h2 className="text-xl font-medium tracking-tight text-[#2B2625]">Unable to load content</h2>
        <p className="text-sm text-[#6E6563] max-w-md mx-auto">
          Please check your internet connection.
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
    <div className="bg-[#FBF9F5] text-[#2B2625] min-h-screen overflow-x-hidden font-sans">
      
      {/* Hero section is pulled completely outside the max-w container to guarantee true 100vw edge-to-edge full screen coverage */}
      <HeroSection 
        slide={slide} 
        quoteItem={quoteItem} 
        textAnimState={textAnimState} 
        imageAnimState={imageAnimState}
        animatingQuote={animatingQuote} 
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-28">
        <RecentDevotionalSection 
          recentDevotional={recentDevotional} 
          formattedDate={formattedDate} 
        />

        <ExploreCardsSection />

        <NewsfeedSection />
      </div>

    </div>
  );
}