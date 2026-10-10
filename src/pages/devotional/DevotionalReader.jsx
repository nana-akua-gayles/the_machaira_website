import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import DevotionalContent from "./devotionalFeatures/DevotionalContent";
import DevotionalDateNav from "./devotionalFeatures/DevotionalDateNav";
import DevotionalSidebar from "./devotionalFeatures/DevotionalSidebar";
import DevotionalPrevNext from "./devotionalFeatures/DevotionalPrevNext";
import DevotionalAudio from "./devotionalFeatures/DevotionalAudio";
import { formatDevotionalTitle, formatDate } from "./devotionalFeatures/formatDevotional";
import { parseDevotionalContent } from "./devotionalFeatures/parseDevotionalContent";
import { getDevotionalById, getDevotionalByDate,  getPreviousDevotional, getNextDevotional, } from "../../lib/devotionalService";
import { recordDevotionalActivity } from "../../lib/recordDevotionalActivity";
import apostleBennieAvatar from "../../assets/images/Apostle1.jpg";
import DevotionalComments from "./devotionalFeatures/DevotionalComments";
import "./devotional.css";

const MIN_READ_MS = 30000;

function DevotionalReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  

  const recordedRef = useRef(false);
  const readEndRef = useRef(null);
  const readStartRef = useRef(Date.now());

  function recordOnce() {
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordDevotionalActivity();
  }

  useEffect(() => {
    recordedRef.current = false;
    readStartRef.current = Date.now();
  }, [id]);

  useEffect(() => {
    const node = readEndRef.current;
    if (!node || !devotional) return;

    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || timer) return;
      const wait = Math.max(0, MIN_READ_MS - (Date.now() - readStartRef.current));
      timer = setTimeout(recordOnce, wait);
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [devotional]);

  useEffect(() => {
    if (searchParams.get("print") !== "1" || loading || !devotional) return;

    const timer = setTimeout(() => {
      window.print();
      setSearchParams({}, { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }, [loading, devotional, searchParams, setSearchParams]);

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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Devotional
          </p>

          <h1 className="mt-5 text-4xl font-semibold text-navy-dark">
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
            Devotional
          </p>

          <h1 className="mt-5 text-4xl font-semibold text-navy-dark">
            {error || "Devotional not found."}
          </h1>

          <Link
            to="/devotional"
            className="mt-8 inline-flex rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#7f0e0e]"
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
              <span className="shrink-0 font-serif text-5xl leading-none text-burgundy-primary">
                “
              </span>

              {parsed.authorMessage && (
                <p className="max-w-140 text-base italic leading-relaxed text-navy-dark md:text-lg">
                  {parsed.authorMessage}
                </p>
              )}
              {!parsed.authorMessage && (
                <p className="text-base font-semibold text-navy-dark md:text-lg">
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
                <p className="text-sm font-semibold text-navy-dark">
                  Apostle Bennie
                </p>
                <p className="text-xs text-cool-gray">Author</p>
              </div>
            </div>

          </div>
        </div>
      )}
      <div className=" bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-6 lg:px-12">

          <Link
            to="/devotional"
            className="inline-flex items-center text-sm font-semibold text-burgundy-primary transition-colors hover:text-[#7f0e0e]"
          >
            ← Back to Devotionals
          </Link>

          <div id="devotional-audio" className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Download devotional"
              title="Download"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 px-3 text-sm font-semibold text-burgundy-primary transition-colors hover:bg-burgundy-primary hover:text-white"
            >
              <span aria-hidden="true">⭳</span>
              <span>Download</span>
            </button>

            {devotional.audio_url && (
              <DevotionalAudio
                variant="topbar"
                audioUrl={devotional.audio_url}
                title={formatted.mainTitle}
                episode={formatted.episodeLabel}
              />
            )}
          </div>

        </div>
      </div>

    <main className="bg-white">
      
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-7 px-4 py-8 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-x-5 sm:px-8 lg:grid-cols-[120px_minmax(0,1fr)_320px] lg:gap-14 lg:px-12 lg:py-16">

          <DevotionalDateNav
            devotional={devotional}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            loading={dateLoading}
            topOffsetClassName="pt-0"
          />

          <div className="contents lg:block">

            {dateNotice && (
              <p className="col-span-2 mb-0 text-sm font-medium text-burgundy-primary lg:mb-4">
                {dateNotice}
              </p>
            )}

            {/* Breadcrumb + actions */}
            <div className="col-start-2 row-start-1 flex min-w-0 flex-col justify-center lg:block">
              <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Link
                  to="/devotional"
                  className="text-burgundy-primary transition-colors hover:text-[#7f0e0e]"
                >
                  Devotional
                </Link>

                <span className="text-[#B9BEC8]">/</span>

                <span className="text-cool-gray">
                  {formatted.episodeLabel || "Reading"}
                </span>
              </div>
            </div>

            {/* Category */}
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy-primary sm:text-sm sm:tracking-[0.25em] lg:mt-8">
              {devotional.category || "Daily Devotional"}
            </p>

            {/* Title */}
            <h1 className="mt-3 max-w-[850px] break-words text-[clamp(1.5rem,6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-navy-dark md:text-5xl lg:mt-4 lg:text-6xl">
              {formatted.mainTitle}
            </h1>

            {/* Accent underline */}
            <div className="mt-4 h-[3px] w-12 bg-burgundy-primary lg:mt-6 lg:w-16" />

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cool-gray sm:text-sm lg:mt-6 lg:gap-x-5">
              {formatted.episodeLabel && (
                <span>{formatted.episodeLabel}</span>
              )}

              <span className="text-[#B9BEC8]">•</span>

              <span>{formatDate(devotional.created_at)}</span>
            </div>

            </div>

            {/* Devotional Content */}
            <article className="col-span-2 mt-2 text-[17px] leading-[2] text-[#374151] lg:mt-14">
              <DevotionalContent
                parsed={parsed}
                fallbackContent={devotional.pure_content}
              />
            </article>

            <div ref={readEndRef} aria-hidden="true" className="col-span-2 h-px lg:col-auto" />

            {/* Bottom navigation */}

            <div className="col-span-2 lg:col-auto"><DevotionalPrevNext previous={prevFormatted} next={nextFormatted} /></div>

            <div className="hidden print:hidden lg:block">
              <DevotionalComments episodeNumber={devotional.episode_number} />
            </div>

          </div>

          <div className="col-span-2 lg:col-auto lg:col-start-3 lg:row-start-1">
          <DevotionalSidebar
            deepDiver={parsed?.deepDiver}
            prayer={parsed?.prayer}
            bibleReading={parsed?.bibleReading}
            declarations={parsed?.declarations}
            audioUrl={devotional.audio_url}
            title={formatted.mainTitle}
            episode={formatted.episodeLabel}
          />
          </div>

          <div className="col-span-2 print:hidden lg:hidden">
            <DevotionalComments episodeNumber={devotional.episode_number} />
          </div>

        </div>
      </section>

    </main>
    </>
  );
}

export default DevotionalReader;