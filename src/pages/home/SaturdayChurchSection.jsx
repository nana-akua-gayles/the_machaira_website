import React, { useState, useEffect, useRef } from 'react';
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
  const [flipped, setFlipped] = useState(false);
  const [playMobile, setPlayMobile] = useState(false);
  const swipeStart = useRef(null);
  const ignoreNextClick = useRef(false);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('button, a, iframe')) return;
    ignoreNextClick.current = false;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    // Horizontal swipe only; allow ordinary vertical page scrolling.
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;

    ignoreNextClick.current = true;
    setFlipped(deltaX < 0);
    setPlayMobile(false);
  };

  const handleCardClick = (event) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (event.target.closest('button, a, iframe')) return;
    if (!playMobile) setFlipped((current) => !current);
  };

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

      {/* Mobile flashcard: video thumbnail first, ministry message on the reverse. */}
      <section className="my-14 lg:hidden px-1" aria-label="Commonwealth Digital Church flashcard">
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5A181C]">The Commonwealth Digital Church</span>
          <span className="shrink-0 rounded-full bg-[#5A181C]/10 px-3 py-1 text-[11px] font-semibold text-[#5A181C]">Tap to flip ↻</span>
        </div>
        <div
          className="relative h-[min(116vw,480px)] min-h-[345px] w-full [perspective:1200px] touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { swipeStart.current = null; }}
          onClick={handleCardClick}
        >
          <div className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#171111] shadow-xl [backface-visibility:hidden]">
              {videoId ? (
                playMobile ? (
                  <iframe title="The Commonwealth Digital Church" src={`${embedSrc}?autoplay=1`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Featured Commonwealth Digital Church video" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/70">{loading ? 'Loading featured video…' : 'Video unavailable'}</div>
              )}
              {!playMobile && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />}
              {!playMobile && <div aria-hidden="true" className="absolute inset-0 z-0 cursor-pointer" />}
              {!playMobile && <div className="pointer-events-none absolute inset-x-5 bottom-6 flex items-end justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-widest text-white/80">Watch with us</p><p className="mt-1 text-xl font-bold text-white">A Church Without Distance</p></div>
                <button type="button" disabled={!videoId} onClick={() => setPlayMobile(true)} aria-label="Play featured video" className="pointer-events-auto relative z-10 flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-white text-[#5A181C] shadow-lg disabled:opacity-40">▶</button>
              </div>}
            </div>
            <div className="absolute inset-0 flex flex-col justify-center gap-5 overflow-y-auto rounded-[28px] bg-[#5A181C] px-7 py-8 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">The Commonwealth Digital Church</span>
              <h3 className="font-serif text-2xl leading-snug">A church beyond walls.</h3>
              <p className="text-sm leading-7 text-white/90">Our digital church is not a concession to convenience. It is the continuation of the apostolic pattern: to reach men where they are, while forming them into who they must become in Christ.</p>
              <p className="text-sm leading-6 text-white/85">Distance cannot dissolve what Christ has joined. Join us every Saturday at 6:30 pm.</p>
              <a href="https://youtube.com/@christcommonwealthglobal" target="_blank" rel="noopener noreferrer" className="w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5A181C]">Visit our YouTube →</a>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => { setFlipped((value) => !value); setPlayMobile(false); }} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#5A181C]/20 bg-white px-5 text-sm font-semibold text-[#5A181C] shadow-sm">
          <span aria-hidden="true">↻</span> {flipped ? 'Turn back to video' : 'Flip card to discover our church'}
        </button>
      </section>

      <section className="hidden lg:block my-28 py-20 px-8 lg:px-16 bg-[#FAF8F5] text-[#2B2625] rounded-[2.5rem] border border-stone-200/80 shadow-xl shadow-stone-200/60 animate-float-slow transition-all duration-700 hover:shadow-2xl hover:border-stone-300">
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