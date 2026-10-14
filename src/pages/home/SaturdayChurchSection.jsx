
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
  const swipeStart = useRef(null);
  const ignoreNextClick = useRef(false);

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

  const resetToVideo = () => {
    setFlipped(false);
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
      `}</style>

      {/* MOBILE AND TABLET */}
      <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:hidden">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A181C] sm:text-xs">
              Commonwealth Digital Church
            </p>
          </div>
        </div>

        <div
          className="relative w-full touch-pan-y [perspective:1200px]"
          style={{ height: 'clamp(340px, 105vw, 470px)' }}
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
            <div className="absolute inset-0 overflow-hidden rounded-3xl bg-[#171111] shadow-lg [backface-visibility:hidden]">
              {thumbnail && !playMobile && (
                <img
                  src={thumbnail}
                  alt="Featured Commonwealth Digital Church video thumbnail"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {playMobile && embedSrc ? (
                <iframe
                  title="The Commonwealth Digital Church featured video"
                  src={`${embedSrc}?autoplay=1`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {!thumbnail && (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/75">
                      {loading
                        ? 'Loading featured video…'
                        : 'Our featured video is currently unavailable.'}
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10" />

                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                    <div className="min-w-0 text-white">
                      <p className="mt-2 text-xs text-white/80 sm:text-sm">
                        Glean from our messages and join our community.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!videoId}
                      onClick={() => setPlayMobile(true)}
                      aria-label="Play featured church video"
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
            <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-3xl bg-[#5A181C] p-6 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
                The Commonwealth Digital Church
              </p>

              <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
                Our digital church is not a concession to convenience. It is
                the continuation of the apostolic pattern: to reach men where
                they are, while forming them into who they must become in
                Christ.
              </p>

              <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Join us online
                </p>
                <p className="mt-1 text-base font-semibold">
                  Every Saturday · 6:30 pm
                </p>
                <p className="mt-1 text-xs leading-5 text-white/80">
                  Distance cannot dissolve what Christ has joined.
                </p>
              </div>

              <div className="mt-auto flex flex-col items-start gap-3 pt-5">
                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5A181C] transition-colors hover:bg-[#F7EDEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5A181C]"
                >
                  Visit our YouTube →
                </a>
                <p className="text-[10px] text-white/65">
                  Swipe left or right to turn the card.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CLEAR, ACCESSIBLE CARD CONTROL */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={resetToVideo}
            disabled={!flipped && !playMobile}
            className="flex min-h-11 items-center justify-center rounded-xl border border-[#5A181C]/20 bg-white px-3 py-3 text-xs font-semibold text-[#5A181C] transition-colors hover:bg-[#F8F3F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A181C] disabled:cursor-default disabled:opacity-50 sm:text-sm"
          >
            Live Service
          </button>

          <button
            type="button"
            onClick={() => {
              setFlipped((value) => !value);
              setPlayMobile(false);
            }}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5A181C] px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#3D0F12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A181C] focus-visible:ring-offset-2 sm:text-sm"
          >
            {flipped ? 'Get to know us' : 'Get to know us'}
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        <p className="mt-3 text-center text-xs leading-5 text-stone-500">
          Join us online every Saturday at 6:30 pm.
        </p>
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
