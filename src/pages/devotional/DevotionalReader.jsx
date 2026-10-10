import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import DevotionalContent from "./devotionalFeatures/DevotionalContent";
import DevotionalDateNav from "./devotionalFeatures/DevotionalDateNav";
import DevotionalSidebar from "./devotionalFeatures/DevotionalSidebar";
import DevotionalPrevNext from "./devotionalFeatures/DevotionalPrevNext";
import DevotionalAudio from "./devotionalFeatures/DevotionalAudio";
import DevotionalPrintView from "./devotionalFeatures/DevotionalPrintView";
import { formatDevotionalTitle, formatDate } from "./devotionalFeatures/formatDevotional";
import { parseDevotionalContent } from "./devotionalFeatures/parseDevotionalContent";
import { getDevotionalById, getDevotionalByDate, getPreviousDevotional, getNextDevotional } from "../../lib/devotionalService";
import { recordDevotionalActivity, isTodaysDevotional } from "../../lib/recordDevotionalActivity";
import apostleBennieAvatar from "../../assets/images/Apostle1.jpg";
import DevotionalComments from "./devotionalFeatures/DevotionalComments";
import "./devotional.css";

const MIN_READ_MS = 30000;

// true  = the author banner card shows on every episode (falls back to the
//         Psalm 119:130 line when the content has no banner message).
// false = only on episodes whose content actually contains a banner.
const ALWAYS_SHOW_BANNER = true;

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

  const [printJob, setPrintJob] = useState(0);
  const [preparing, setPreparing] = useState(false);

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

  // The DB title is passed in so the parser can find and strip the
  // title from the top of the raw CMS content.
  const parsed = useMemo(
    () =>
      devotional
        ? parseDevotionalContent(devotional.content, { title: devotional.title })
        : null,
    [devotional]
  );

  const recordedRef = useRef(false);
  const readEndRef = useRef(null);
  const readStartRef = useRef(Date.now());

  function recordOnce() {
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordDevotionalActivity(devotional?.created_at);
  }

  useEffect(() => {
    recordedRef.current = false;
    readStartRef.current = Date.now();
  }, [id]);

  useEffect(() => {
    const node = readEndRef.current;
    if (!node || !devotional || !isTodaysDevotional(devotional.created_at)) return;

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
    if (printJob === 0 || !devotional) return;

    const previousTitle = document.title;
    let cancelled = false;

    function finish() {
      document.body.classList.remove("printing-devotional");
      document.title = previousTitle;
      window.removeEventListener("afterprint", finish);
      setPreparing(false);
    }

    async function run() {
      const root = document.getElementById("devotional-print-root");
      const images = root ? [...root.querySelectorAll("img")] : [];
      await Promise.race([
        Promise.all(images.map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
      if (cancelled) return;

      const { mainTitle } = formatDevotionalTitle(devotional.title);
      document.title = `${mainTitle} - Machaira`;
      document.body.classList.add("printing-devotional");
      window.addEventListener("afterprint", finish);
      setPreparing(false);
      window.print();
    }

    run();
    return () => {
      cancelled = true;
      finish();
    };
  }, [printJob]);

  useEffect(() => {
    if (searchParams.get("print") !== "1" || loading || !devotional) return;

    const timer = setTimeout(() => {
      handlePrint();
      setSearchParams({}, { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }, [loading, devotional, searchParams, setSearchParams]);

  function handlePrint() {
    if (preparing || !devotional) return;
    setPreparing(true);
    setPrintJob((n) => n + 1);
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
        <div className="mx-auto max-w-225 px-8 py-20 lg:px-12">
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
        <div className="mx-auto max-w-225 px-8 py-20 text-center lg:px-12">
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

  const showBanner = !!parsed && (ALWAYS_SHOW_BANNER || parsed.hasBanner || !!parsed.authorMessage);

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
      {showBanner && (
        <div className="mx-auto max-w-300 px-8 pt-8 lg:px-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-[#FBF8F6] p-6 md:flex-row md:items-center md:gap-8 md:p-8">

            <div className="flex flex-1 items-start gap-4">
              <span className="shrink-0 font-serif text-5xl leading-none text-burgundy-primary">
                “
              </span>

              {parsed.authorMessage && (
                <p className="max-w-140 leading-relaxed text-navy-dark md:text-sm">
                  {parsed.authorMessage}
                </p>
              )}
              {!parsed.authorMessage && (
                <p className="text-base font-semibold text-navy-dark md:text-sm">
                  The Entrance of thy words giveth light; it giveth understanding unto the simple. <span className="font-normal">Psalm 119:130</span>
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

      <div className="bg-white">
        <div className="mx-auto flex max-w-300 items-center justify-between px-8 py-6 lg:px-12">

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
              disabled={preparing}
              aria-label="Download devotional"
              title="Download"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/10 px-3 text-sm font-semibold text-burgundy-primary transition-colors hover:bg-burgundy-primary hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <span aria-hidden="true">{preparing ? "…" : "⭳"}</span>
              <span>{preparing ? "Preparing..." : "Download"}</span>
            </button>

            {devotional.audio_url && (
              <DevotionalAudio
                variant="topbar"
                audioUrl={devotional.audio_url}
                title={formatted.mainTitle}
                episode={formatted.episodeLabel}
                publishedAt={devotional.created_at}
              />
            )}
          </div>

        </div>
      </div>

      <main className="bg-white">

        <section className="bg-white">
          <div className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-8 py-14 lg:grid-cols-[120px_1fr_320px] lg:gap-14 lg:px-12 lg:py-16">

            <DevotionalDateNav
              devotional={devotional}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              loading={dateLoading}
              topOffsetClassName="pt-0"
            />

            <div>

              {dateNotice && (
                <p className="mb-4 text-sm font-medium text-burgundy-primary">
                  {dateNotice}
                </p>
              )}

              {/* Breadcrumb + actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Link
                    to="/devotional"
                    className="text-burgundy-primary transition-colors hover:text-[#7f0e0e]"
                  >
                    Devotional
                  </Link>

                  <span className="text-soft-gray">/</span>

                  <span className="text-cool-gray">
                    {formatted.episodeLabel || "Reading"}
                  </span>
                </div>
              </div>

              {/* Category */}
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-burgundy-primary">
                {devotional.category || "Machaira with Apostle Bennie"}
              </p>

              {/* Title */}
              <h1 className="mt-4 max-w-212.5 text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-navy-dark md:text-3xl lg:text-5xl">
                {formatted.mainTitle}
              </h1>

              {/* Accent underline */}
              <div className="mt-6 h-0.75 w-16 bg-burgundy-primary" />

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cool-gray">
                {formatted.episodeLabel && (
                  <span>{formatted.episodeLabel}</span>
                )}

                <span className="text-soft-gray">•</span>

                <span>{formatDate(devotional.created_at)}</span>
              </div>

              {/* Devotional Content */}
              <article className="mt-12 text-[11px] leading-loose text-[#374151]">
                <DevotionalContent
                  parsed={parsed}
                  fallbackContent={devotional.pure_content}
                />
              </article>

              <div ref={readEndRef} aria-hidden="true" />

              {/* Bottom navigation */}
              <DevotionalPrevNext previous={prevFormatted} next={nextFormatted} />

              <div className="print:hidden">
                <DevotionalComments episodeNumber={devotional.episode_number} />
              </div>

            </div>

            <DevotionalSidebar
              deepDiver={parsed?.deepDiver}
              prayer={parsed?.prayer}
              bibleReading={parsed?.bibleReading}
              declarations={parsed?.declarations}
              audioUrl={devotional.audio_url}
              title={formatted.mainTitle}
              episode={formatted.episodeLabel}
              publishedAt={devotional.created_at}
            />

          </div>
        </section>

      </main>

      {printJob > 0 && createPortal(<DevotionalPrintView devotional={devotional} />, document.body)}
    </>
  );
}

export default DevotionalReader;
