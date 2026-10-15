
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
const ALWAYS_SHOW_BANNER = true;

function formatSelectedDate(date) {
  if (!date) return "";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
  const [dateEmptyState, setDateEmptyState] = useState(null);
  const [prevDevotional, setPrevDevotional] = useState(null);
  const [nextDevotional, setNextDevotional] = useState(null);
  const [printJob, setPrintJob] = useState(null);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDevotional() {
      try {
        setLoading(true);
        setError(null);
        setDateNotice(null);
        setDateEmptyState(null);

        const data = await getDevotionalById(id);
        if (cancelled) return;

        if (!data) {
          setError("This devotional could not be found.");
          setPrevDevotional(null);
          setNextDevotional(null);
          return;
        }

        setDevotional(data);
        setSelectedDate(data.created_at.split("T")[0]);

        const [previous, next] = await Promise.all([
          getPreviousDevotional(data.created_at),
          getNextDevotional(data.created_at),
        ]);

        if (cancelled) return;
        setPrevDevotional(previous);
        setNextDevotional(next);
      } catch (err) {
        if (cancelled) return;
        console.error("DEVOTIONAL READER FAILED:", err);
        setError("Unable to load this devotional.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDevotional();
    return () => { cancelled = true; };
  }, [id]);

  const parsed = useMemo(
    () => devotional
      ? parseDevotionalContent(devotional.content, { title: devotional.title })
      : null,
    [devotional]
  );

  const recordedRef = useRef(false);
  const readEndRef = useRef(null);
  const readStartRef = useRef(0);

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

      timer = setTimeout(() => {
        if (recordedRef.current) return;
        recordedRef.current = true;
        recordDevotionalActivity(devotional.created_at);
      }, wait);
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [devotional]);

  useEffect(() => {
    if (!printJob) return;

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
        Promise.all(images.map((img) =>
          img.decode ? img.decode().catch(() => {}) : Promise.resolve()
        )),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (cancelled) return;

      const { mainTitle } = formatDevotionalTitle(printJob.devotional.title);
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
      setPreparing(true);
      setPrintJob({ devotional, at: Date.now() });
      setSearchParams({}, { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }, [loading, devotional, searchParams, setSearchParams]);

  function handlePrint() {
    if (preparing || !devotional) return;
    setPreparing(true);
    setPrintJob({ devotional, at: Date.now() });
  }

  async function handleDateSelect(date) {
    if (!date) return;

    setSelectedDate(date);
    setDateEmptyState(null);
    setDateNotice(`Checking ${formatSelectedDate(date)}...`);
    setDateLoading(true);

    try {
      const data = await getDevotionalByDate(date);

      if (data) {
        setDateNotice(null);
        navigate(`/devotional/${data.id}`);
      } else {
        setDateNotice(null);
        setDateEmptyState({ date, status: "not-found" });
      }
    } catch (err) {
      console.error("DATE DEVOTIONAL LOAD FAILED:", err);
      setDateNotice(null);
      setDateEmptyState({ date, status: "error" });
    } finally {
      setDateLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-225 px-8 py-20 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">Devotional</p>
          <h1 className="mt-5 text-4xl font-semibold text-navy-dark">Loading devotional...</h1>
        </div>
      </main>
    );
  }

  if (error || !devotional) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-225 px-8 py-20 text-center lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">Devotional</p>
          <h1 className="mt-5 text-4xl font-semibold text-navy-dark">{error || "Devotional not found."}</h1>
          <Link to="/devotional" className="mt-8 inline-flex rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#7f0e0e]">
            ← Back to Devotional
          </Link>
        </div>
      </main>
    );
  }

  const formatted = formatDevotionalTitle(devotional.title);

  // A clear empty state replaces the old devotional when the selected date has no entry.
  if (dateEmptyState) {
    const emptyDateLabel = formatSelectedDate(dateEmptyState.date);
    const isLookupError = dateEmptyState.status === "error";

    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-300 px-4 py-8 sm:px-6 lg:px-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link to="/devotional" className="inline-flex items-center text-sm font-semibold text-burgundy-primary transition-colors hover:text-[#7f0e0e]">
              ← Back to Devotionals
            </Link>
            <span className="rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-cool-gray">
              Selected date: {emptyDateLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[120px_minmax(0,1fr)_320px] lg:gap-14">
            <div className="min-w-0">
              <DevotionalDateNav
                devotional={devotional}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                loading={dateLoading}
                topOffsetClassName="pt-0"
              />
            </div>

            <section className="flex min-h-[360px] min-w-0 items-center justify-center rounded-2xl border border-[#eadfda] bg-[#FBF8F6] px-6 py-12 text-center sm:px-10 lg:col-start-2">
              <div className="max-w-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-burgundy-primary shadow-sm" aria-hidden="true">
                  {isLookupError ? "!" : "▦"}
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-burgundy-primary">
                  {isLookupError ? "Unable to check date" : "Devotional archive"}
                </p>

                <h1 className="mt-3 text-2xl font-semibold leading-tight text-navy-dark sm:text-3xl">
                  {isLookupError ? "We couldn't load this date" : "No devotional for this date"}
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-base">
                  {isLookupError
                    ? `We couldn't check for a devotional on ${emptyDateLabel}. Please try selecting this date again.`
                    : `There isn't a devotional published for ${emptyDateLabel}. Choose another date from the calendar to continue reading.`}
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDateSelect(dateEmptyState.date)}
                    disabled={dateLoading}
                    className="inline-flex items-center justify-center rounded-full bg-burgundy-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f0e0e] disabled:cursor-wait disabled:opacity-60"
                  >
                    {dateLoading ? "Checking..." : "Try this date again"}
                  </button>

                  <Link
                    to="/devotional"
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-navy-dark transition-colors hover:border-burgundy-primary hover:text-burgundy-primary"
                  >
                    Browse devotionals
                  </Link>
                </div>
              </div>
            </section>

            <div className="hidden lg:block lg:col-start-3" />
          </div>
        </div>
      </main>
    );
  }

  const showBanner = !!parsed && (
    ALWAYS_SHOW_BANNER || parsed.hasBanner || !!parsed.authorMessage
  );

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
              {parsed.authorMessage ? (
                <p className="max-w-140 leading-relaxed text-navy-dark md:text-sm">{parsed.authorMessage}</p>
              ) : (
                <p className="text-base font-semibold text-navy-dark md:text-sm">
                  The Entrance of thy words giveth light; it giveth understanding unto the simple.{" "}
                  <span className="font-normal">Psalm 119:130</span>
                </p>
              )}
            </div>
            <div className="hidden h-14 w-px shrink-0 bg-black/10 md:block" />
            <div className="flex items-center gap-3">
              <img src={apostleBennieAvatar} alt="Apostle Bennie" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-navy-dark">Apostle Bennie</p>
                <p className="text-xs text-cool-gray">Author</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white">
        <div className="mx-auto flex max-w-300 items-center justify-between gap-3 px-4 py-6 sm:px-6 lg:px-12">
          <Link to="/devotional" className="inline-flex items-center text-sm font-semibold text-burgundy-primary transition-colors hover:text-[#7f0e0e]">
            ← Back to Devotionals
          </Link>
          <div id="devotional-audio" className="flex shrink-0 items-center gap-2 sm:gap-3">
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
          <div className="mx-auto grid max-w-300 grid-cols-[70px_minmax(0,1fr)] gap-x-5 gap-y-8 px-4 py-10 sm:gap-x-6 sm:px-6 lg:grid-cols-[120px_minmax(0,1fr)_320px] lg:gap-x-14 lg:gap-y-0 lg:px-12 lg:py-16">
            <DevotionalDateNav
              devotional={devotional}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              loading={dateLoading}
              topOffsetClassName="pt-0"
            />

            <div className="col-start-2 row-start-1 min-w-0 lg:col-auto lg:row-auto">
              {dateNotice && (
                <p role="status" aria-live="polite" className="mb-4 flex items-center gap-2 rounded-xl border border-[#eadfda] bg-[#FBF8F6] px-4 py-3 text-sm font-medium text-burgundy-primary">
                  {dateLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-burgundy-primary/30 border-t-burgundy-primary" />}
                  {dateNotice}
                </p>
              )}

              <div className="flex min-w-0 flex-col justify-center lg:block">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Link to="/devotional" className="text-burgundy-primary transition-colors hover:text-[#7f0e0e]">Devotional</Link>
                    <span className="text-soft-gray">/</span>
                    <span className="text-cool-gray">{formatted.episodeLabel || "Reading"}</span>
                  </div>
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy-primary sm:text-sm sm:tracking-[0.25em] lg:mt-8">
                  {devotional.category || "Daily Devotional"}
                </p>

                <h1 className="mt-3 max-w-[850px] break-words text-[clamp(1.5rem,6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-navy-dark md:text-5xl lg:mt-4 lg:text-6xl">
                  {formatted.mainTitle}
                </h1>

                <div className="mt-4 h-[3px] w-12 bg-burgundy-primary lg:mt-6 lg:w-16" />

                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cool-gray sm:text-sm lg:mt-6 lg:gap-x-5">
                  {formatted.episodeLabel && <span>{formatted.episodeLabel}</span>}
                  <span className="text-soft-gray">•</span>
                  <span>{formatDate(devotional.created_at)}</span>
                </div>
              </div>

              <article className="mt-5 min-w-0 pl-1 text-[16px] leading-[1.9] text-[#374151] sm:pl-2 sm:text-[17px] sm:leading-[2] lg:mt-14 lg:pl-0 [&_blockquote]:!h-auto [&_blockquote]:!min-h-0 [&_blockquote]:overflow-visible">
                <DevotionalContent parsed={parsed} fallbackContent={devotional.pure_content} />
              </article>

              <div ref={readEndRef} aria-hidden="true" className="h-px" />

              <div className="min-w-0">
                <DevotionalPrevNext previous={prevFormatted} next={nextFormatted} />
              </div>

              <div className="hidden print:hidden lg:block">
                <DevotionalComments episodeNumber={devotional.episode_number} />
              </div>
            </div>

            <div className="col-span-full min-w-0 lg:col-auto lg:col-start-3 lg:row-start-1">
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

            <div className="col-span-full min-w-0 print:hidden lg:hidden">
              <DevotionalComments episodeNumber={devotional.episode_number} />
            </div>
          </div>
        </section>
      </main>

      {printJob && createPortal(
        <DevotionalPrintView devotional={printJob.devotional} />,
        document.body
      )}
    </>
  );
}

export default DevotionalReader;
