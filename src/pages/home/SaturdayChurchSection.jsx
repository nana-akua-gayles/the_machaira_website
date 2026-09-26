import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Universal helper to extract YouTube ID (handles watch, live, shorts, embed, short links, or raw IDs)
function extractYoutubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function SaturdayChurchSection() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedVideo() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('featured_video')
          .select('youtube_url')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;
        if (data?.youtube_url) {
          setVideoUrl(data.youtube_url);
        }
      } catch (err) {
        console.error("Failed to load featured video:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedVideo();
  }, []);

  const videoId = extractYoutubeId(videoUrl);
  const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
      `}</style>

      <section className="my-28 py-20 px-8 lg:px-16 bg-[#FAF8F5] text-[#2B2625] rounded-[2.5rem] border border-stone-200/80 shadow-xl shadow-stone-200/60 animate-float-slow transition-all duration-700 hover:shadow-2xl hover:border-stone-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#5A181C] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5A181C]"></span>
              <span>The Commonwealth Digital Church</span>
            </div>

            <p className="text-stone-600 text-base font-light leading-relaxed">
              Our digital church is not a concession to convenience. 
              It is the continuation of the apostolic pattern: to reach men where they are, 
              while forming them into who they must become in Christ.
            </p>
            <p>Distance cannot dissolve what Christ has joined. Join us, this and every Saturday at exactly 6:30 pm <a href="https://youtube.com/@christcommonwealthglobal">on Youtube.</a></p></div>

          {/* Right Side: Dynamic YouTube Embed with Interactive Depth */}
          <div className="lg:col-span-7">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-stone-300/60 bg-black flex items-center justify-center transition-transform duration-500 hover:scale-[1.01]">
              {loading ? (
                <div className="w-7 h-7 border-2 border-stone-600 border-t-white rounded-full animate-spin"></div>
              ) : embedSrc ? (
                <iframe
                  className="w-full h-full"
                  src={embedSrc}
                  title="The Commonwealth Digital Church"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p className="text-xs text-stone-400 font-light tracking-wide">Stream unavailable</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}