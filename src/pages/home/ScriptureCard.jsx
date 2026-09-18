import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ScriptureCard() {
  const [testimonies, setTestimonies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingQuote, setAnimatingQuote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('id, testimony');

        if (error) throw error;
        if (data && data.length > 0) {
          setTestimonies(data);
        }
      } catch (err) {
        console.error('Error fetching testimonies:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonies();
  }, []);

  useEffect(() => {
    if (testimonies.length <= 1) return;

    const interval = setInterval(() => {
      setAnimatingQuote(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
        setAnimatingQuote(false);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonies.length]);

  if (loading || testimonies.length === 0) {
    return null;
  }

  const currentTestimony = testimonies[currentIndex]?.testimony;

  return (
    <div className="max-w-md">
      <div className="p-6 bg-white/85 backdrop-blur-md border border-[#5A181C]/10 rounded-2xl shadow-sm relative">
        <div className={`transition-all duration-400 ease-out ${animatingQuote ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex gap-4 items-start">
            <div className="text-[#5A181C] text-3xl leading-none font-semibold select-none">
              “
            </div>
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm text-[#2B2625] font-normal leading-relaxed italic whitespace-pre-line">
                {currentTestimony}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}