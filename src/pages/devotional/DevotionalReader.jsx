import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DevotionalContent from "./devotionalFeatures/DevotionalContent";
import DevotionalDateNav from "./devotionalFeatures/DevotionalDateNav";
import DevotionalSidebar from "./devotionalFeatures/DevotionalSidebar";
import DevotionalPrevNext from "./devotionalFeatures/DevotionalPrevNext";
import { formatDevotionalTitle, formatDate } from "./devotionalFeatures/formatDevotional";
import { parseDevotionalContent } from "./devotionalFeatures/parseDevotionalContent";
import { getDevotionalById, getDevotionalByDate,  getPreviousDevotional, getNextDevotional, } from "../../lib/devotionalService";
import apostleBennieAvatar from "../../assets/images/Apostle1.jpg";
import DevotionalComments from "./devotionalFeatures/DevotionalComments";
import "./devotional.css";

function DevotionalReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateLoading, setDateLoading] = useState(false);
  const [dateNotice, setDateNotice] = useState(null);

  const [prevDevotional, setPrevDevotional] = useState(null);
  const [nextDevotional, setNextDevotional] = useState(null);

  useEffect(() => {
    async function loadDevotional() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDevotionalById(id);

        if (!data) {
          setError("This devotional could not be found.");
          setPrevDevotional(null);
          setNextDevotional(null);
          return;
        }

        setDevotional(data);
        setSelectedDate(data.created_at.split("T")[0]);
        setDateNotice(null);

        const [previous, next] = await Promise.all([
          getPreviousDevotional(data.created_at),
          getNextDevotional(data.created_at),
        ]);

        setPrevDevotional(previous);
        setNextDevotional(next);
      } catch (err) {
        console.error("DEVOTIONAL READER FAILED:", err);
        setError("Unable to load this devotional.");
      } finally {
        setLoading(false);
      }
    }

    loadDevotional();
  }, [id]);

  // Hooks must run unconditionally, on every render, in the same
  // order — so this has to sit above the loading/error early returns
  // below, not after them.
  const parsed = useMemo(
    () => (devotional ? parseDevotionalContent(devotional.content) : null),
    [devotional]
  );

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying((prev) => !prev);
  }

  function handlePrint() {
    window.print();
  }

  async function handleDateSelect(date) {
    setSelectedDate(date);
    setDateNotice(null);
    setDateLoading(true);

    try {
      const data = await getDevotionalByDate(date);

      if (data) {
        navigate(`/devotional/${data.id}`);
      } else {
        setDateNotice("No devotional was published on this date.");
      }
    } catch (err) {
      console.error("DATE DEVOTIONAL LOAD FAILED:", err);
      setDateNotice("Unable to load the devotional for this date.");
    } finally {
      setDateLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[900px] px-8 py-20 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
            Devotional
          </p>

          <h1 className="mt-5 text-4xl font-semibold text-[#101A2B]">
            Loading devotional...
          </h1>
        </div>
      </main>
    );
  }

  if (error || !devotional) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[900px] px-8 py-20 text-center lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
            Devotional
          </p>

          <h1 className="mt-5 text-4xl font-semibold text-[#101A2B]">
            {error || "Devotional not found."}
          </h1>

          <Link
            to="/devotional"
            className="mt-8 inline-flex rounded-full bg-[#991313] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#7f0e0e]"
          >
            ← Back to Devotional
          </Link>
        </div>
      </main>
    );
  }

  const formatted = formatDevotionalTitle(devotional.title);
  const prevFormatted = prevDevotional
    ? {
        id: prevDevotional.id,
        title: formatDevotionalTitle(prevDevotional.title).mainTitle,
        date: formatDate(prevDevotional.created_at),
      }
    : null;

  const nextFormatted = nextDevotional
    ? {
        id: nextDevotional.id,
        title: formatDevotionalTitle(nextDevotional.title).mainTitle,
        date: formatDate(nextDevotional.created_at),
      }
    : null;

  return (
    <>
      {parsed?.hasBanner && (
        <div className="mx-auto max-w-[1200px] px-8 pt-8 lg:px-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-[#FBF8F6] p-6 md:flex-row md:items-center md:gap-8 md:p-8">

            <div className="flex flex-1 items-start gap-4">
              <span className="shrink-0 font-serif text-5xl leading-none text-[#991313]">
                “
              </span>

              {parsed.authorMessage && (
                <p className="max-w-[560px] text-base italic leading-relaxed text-[#101A2B] md:text-lg">
                  {parsed.authorMessage}
                </p>
              )}
              {!parsed.authorMessage && (
                <p className="text-base font-semibold text-[#101A2B] md:text-lg">
                  Welcome to Today's Machaira
                </p>
              )}
            </div>

            <div className="hidden h-14 w-px shrink-0 bg-black/10 md:block" />
            <div className="flex items-center gap-3">
              <img
                src={apostleBennieAvatar}
                alt="Apostle Bennie"
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#101A2B]">
                  Apostle Bennie
                </p>
                <p className="text-xs text-[#4D5057]">Author</p>
              </div>
            </div>

          </div>
        </div>
      )}
      <div className=" bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-6 lg:px-12">

          <Link
            to="/devotional"
            className="inline-flex items-center text-sm font-semibold text-[#991313] transition-colors hover:text-[#7f0e0e]"
          >
            ← Back to Devotionals
          </Link>

          <div id="devotional-audio" className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Download devotional"
              title="Download"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 px-3 text-sm font-semibold text-[#991313] transition-colors hover:bg-[#991313] hover:text-white"
            >
              <span aria-hidden="true">⭳</span>
              <span>Download</span>
            </button>

            {devotional.audio_url && (
              <button
                type="button"
                onClick={toggleAudio}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                title={isPlaying ? "Pause" : "Listen"}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#991313] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e]"
              >
                <span aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
                <span>{isPlaying ? "Pause" : "Listen"}</span>
              </button>
            )}
          </div>

        </div>
      </div>

    <main className="bg-white">
      
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-8 py-14 lg:grid-cols-[120px_1fr_320px] lg:gap-14 lg:px-12 lg:py-16">

          <DevotionalDateNav
            devotional={devotional}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            loading={dateLoading}
            topOffsetClassName="pt-0"
          />

          <div>

            {dateNotice && (
              <p className="mb-4 text-sm font-medium text-[#991313]">
                {dateNotice}
              </p>
            )}

            {/* Breadcrumb + actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Link
                  to="/devotional"
                  className="text-[#991313] transition-colors hover:text-[#7f0e0e]"
                >
                  Devotional
                </Link>

                <span className="text-[#B9BEC8]">/</span>

                <span className="text-[#4D5057]">
                  {formatted.episodeLabel || "Reading"}
                </span>
              </div>
            </div>

            {/* Category */}
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
              {devotional.category || "Daily Devotional"}
            </p>

            {/* Title */}
            <h1 className="mt-4 max-w-[850px] text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#101A2B] md:text-5xl lg:text-6xl">
              {formatted.mainTitle}
            </h1>

            {/* Accent underline */}
            <div className="mt-6 h-[3px] w-16 bg-[#991313]" />

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#4D5057]">
              {formatted.episodeLabel && (
                <span>{formatted.episodeLabel}</span>
              )}

              <span className="text-[#B9BEC8]">•</span>

              <span>{formatDate(devotional.created_at)}</span>
            </div>

            {devotional.audio_url && (
              <audio
                ref={audioRef}
                src={devotional.audio_url}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            {/* Devotional Content */}
            <article className="mt-14 text-[17px] leading-[2] text-[#374151]">
              <DevotionalContent
                parsed={parsed}
                fallbackContent={devotional.pure_content}
              />
            </article>

            {/* Bottom navigation */}

            <DevotionalPrevNext previous={prevFormatted} next={nextFormatted} />

            <DevotionalComments episodeNumber={devotional.episode_number} />

          </div>

          <DevotionalSidebar
            deepDiver={parsed?.deepDiver}
            prayer={parsed?.prayer}
            bibleReading={parsed?.bibleReading}
            declarations={parsed?.declarations}
          />

        </div>
      </section>

    </main>
    </>
  );
}

export default DevotionalReader;