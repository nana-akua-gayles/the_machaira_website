import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const YOUTUBE_CHANNEL = 'https://youtube.com/@christcommonwealthglobal';

function extractYoutubeId(input) {
  if (!input || typeof input !== 'string') return null;

  const value = input.trim();

  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(
      /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value) ? value : `https://${value}`
    );

    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const id =
        url.searchParams.get('v') ||
        url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1];

      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function SaturdayChurchSection() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [playMobile, setPlayMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const swipeStart = useRef(null);
  const ignoreNextClick = useRef(false);
  const flipRef = useRef(null);

  useEffect(() => {
    const node = flipRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchFeaturedVideo() {
      try {
        const { data, error } = await supabase
          .from('featured_video')
          .select('youtube_url')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        if (active && data?.youtube_url) {
          setVideoUrl(data.youtube_url);
        }
      } catch (err) {
        console.error('Failed to load featured video:', err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchFeaturedVideo();

    return () => {
      active = false;
    };
  }, []);

  const videoId = extractYoutubeId(videoUrl);
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : null;
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const showPlayer = Boolean(embedSrc) && (playMobile || (inView && !flipped));

  const resetToVideo = () => {
    setFlipped(false);
    setPlayMobile(false);
  };

  const showAbout = () => {
    setFlipped(true);
    setPlayMobile(false);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('button, a, iframe')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    ignoreNextClick.current = false;
    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (
      Math.abs(deltaX) < 55 ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.3
    ) {
      return;
    }

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

    if (!playMobile) {
      setFlipped((current) => !current);
    }
  };

  return (
    <section
      aria-labelledby="digital-church-heading"
      className="my-12 w-full sm:my-16 lg:my-20"
    >
      <style>{`
        @keyframes churchFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .church-desktop-card:hover {
            animation: churchFloat 4s ease-in-out infinite;
          }
        }

        @keyframes churchGlow {
          0% { box-shadow: 0 0 0 0 rgba(184, 134, 59, 0.55); }
          70%, 100% { box-shadow: 0 0 0 12px rgba(184, 134, 59, 0); }
        }
        .church-bead {
          background: radial-gradient(circle at 35% 35%, #E8C58F, #5A181C 70%);
          transition: left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: churchGlow 2.4s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .church-bead { transition: none; animation: none; }
        }
      `}</style>

      {/* MOBILE AND TABLET */}
      <div className="lg:hidden">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
          <h2
            id="digital-church-heading"
            className="text-[28px] font-extrabold uppercase leading-[1.1] tracking-[0.06em] text-[#5A181C] sm:text-4xl"
          >
            The Commonwealth Digital Church
          </h2>
        </div>

        <div
          ref={flipRef}
          className="relative mt-5 w-full touch-pan-y overflow-hidden transition-[height] duration-500 ease-in-out [perspective:1200px] motion-reduce:transition-none"
          style={{ height: flipped ? 'clamp(400px, 125vw, 640px)' : '56.25vw' }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
          onClick={handleCardClick}
        >
          <div
            className={`relative h-full w-full [transform-style:preserve-3d] motion-reduce:transition-none ${
              flipped ? '[transform:rotateY(180deg)]' : ''
            } transition-transform duration-500 ease-in-out`}
          >
            {/* FRONT: VIDEO */}
            <div className="absolute inset-0 overflow-hidden bg-[#171111] [backface-visibility:hidden]">
              {thumbnail && !showPlayer && (
                <img
                  src={thumbnail}
                  alt="Featured Commonwealth Digital Church video thumbnail"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {showPlayer ? (
                <iframe
                  title="Live Coverage"
                  src={`${embedSrc}?autoplay=1&playsinline=1${playMobile ? '' : '&mute=1'}`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {!thumbnail && (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/75">
                      {loading
                        ? 'Loading live...'
                        : 'Our live video is currently unavailable.'}
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10" />

                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                    <button
                      type="button"
                      disabled={!videoId}
                      onClick={() => setPlayMobile(true)}
                      aria-label="Play live video"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#5A181C] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5A181C] disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* BACK: CHURCH INFORMATION */}
            <div className="absolute inset-0 flex flex-col overflow-y-auto bg-[#5A181C] px-6 py-8 text-white [backface-visibility:hidden] [transform:rotateY(180deg)] sm:px-10 sm:py-10">
              <p className="text-[15px] leading-7 text-white/90 sm:text-base sm:leading-8">
                Our digital church is not a concession to convenience. It is
                the continuation of the apostolic pattern: to reach men where
                they are, while forming them into who they must become in
                Christ.
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C58F]/80">
                  Join us online
                </p>
                <p className="mt-1.5 text-xl font-semibold leading-7 text-white">
                  Every Saturday · 6:30 pm
                </p>
                <p className="mt-3 text-sm italic leading-6 text-white/75">
                  Distance cannot dissolve what Christ has joined.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5A181C]"
                >
                  <span className="border-b border-white/40 pb-0.5 transition-colors group-hover:border-white">
                    Visit our YouTube
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              onClick={resetToVideo}
              aria-pressed={!flipped}
              className={`min-h-11 shrink-0 text-sm font-semibold tracking-wide transition-colors duration-500 focus-visible:outline-none focus-visible:text-[#5A181C] ${
                flipped ? 'text-stone-400' : 'text-[#5A181C]'
              }`}
            >
              Live Service
            </button>

            <div className="relative h-6 flex-1" aria-hidden="true">
              <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#5A181C]/10 via-[#5A181C]/40 to-[#5A181C]/10" />
              <span
                className="church-bead absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
                style={{ left: flipped ? 'calc(100% - 0.75rem)' : '0px' }}
              />
            </div>

            <button
              type="button"
              onClick={showAbout}
              aria-pressed={flipped}
              className={`min-h-11 shrink-0 text-sm font-semibold tracking-wide transition-colors duration-500 focus-visible:outline-none focus-visible:text-[#5A181C] ${
                flipped ? 'text-[#5A181C]' : 'text-stone-400'
              }`}
            >
              Get to know us
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="mx-auto hidden w-full max-w-[1280px] px-6 lg:block xl:px-10">
        <div className="church-desktop-card grid grid-cols-12 items-center gap-8 rounded-3xl border border-stone-200/80 bg-[#FAF8F5] p-8 shadow-lg shadow-stone-200/40 transition-shadow duration-300 hover:shadow-xl xl:gap-12 xl:p-12">
          <div className="col-span-5 min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5A181C]">
              <span className="h-2 w-2 rounded-full bg-[#5A181C]" />
              The Commonwealth Digital Church
            </div>

            <p className="mt-5 max-w-lg text-sm leading-7 text-stone-600 xl:text-base">
              Our digital church is not a concession to convenience. It is
              the continuation of the apostolic pattern: to reach men where
              they are, while forming them into who they must become in Christ.
            </p>

            <div className="mt-6 border-l-2 border-[#5A181C]/30 pl-4">
              <p className="text-sm font-medium leading-6 text-[#2B2625]">
                Distance cannot dissolve what Christ has joined.
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Join us every Saturday at 6:30 pm.
              </p>
            </div>

            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-xl bg-[#5A181C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3D0F12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A181C] focus-visible:ring-offset-2"
            >
              Visit our YouTube channel
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="col-span-7 min-w-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-stone-300/60 bg-[#171111] shadow-xl">
              {loading ? (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  role="status"
                >
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  <span className="sr-only">Loading live video</span>
                </div>
              ) : embedSrc ? (
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  src={embedSrc}
                  title="The Commonwealth Digital Church featured video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                  <p className="text-base font-semibold">
                    Live video currently unavailable
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                    You can still visit our YouTube channel to watch our
                    messages and join us online.
                  </p>
                  <a
                    href={YOUTUBE_CHANNEL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5A181C] hover:bg-stone-100"
                  >
                    Open YouTube →
                  </a>
                </div>
              )}
            </div>

            <p className="mt-3 text-right text-xs text-stone-500">
              Commonwealth Digital Church · Saturdays at 6:30 pm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}