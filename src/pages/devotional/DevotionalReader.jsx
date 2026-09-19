import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DevotionalContent from "./devotionalFeatures/DevotionalContent";
import DevotionalDateNav from "./devotionalFeatures/DevotionalDateNav";
import DevotionalSidebar from "./devotionalFeatures/DevotionalSidebar";
import DevotionalPrevNext from "./devotionalFeatures/DevotionalPrevNext";
import { parseDevotionalContent } from "./devotionalFeatures/parseDevotionalContent";
import { getDevotionalById, getDevotionalByDate,  getPreviousDevotional, getNextDevotional, } from "../../lib/devotionalService";
import devotionalHero from "../../assets/devotionalImages/devotional-hero.png";
import biblecoffee from "../../assets/devotionalImages/biblecoffee.jpg";
import "./devotional.css";

function formatDevotionalTitle(title) {
  if (!title) {
    return {
      mainTitle: "Devotional",
      episodeLabel: "",
    };
  }

  const match = title.match(/^EPISODE\s+(\d+)\s*-\s*(.+)$/i);

  if (match) {
    return {
      mainTitle: match[2].trim(),
      episodeLabel: `Episode ${match[1]}`,
    };
  }

  return {
    mainTitle: title,
    episodeLabel: "",
  };
}

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Accra",
  });
}

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
    <main className="bg-white">

{/* Header */}
<section className="relative overflow-hidden border-b border-[#B9BEC8]/20 bg-[#FFFFFF]">
  {/* Modern Decorative Background Elements */}
  <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
    {/* Subtle Crimson/Burgundy Glow Accent */}
    <div className="absolute -top-24 right-0 h-[400px] w-[500px] rounded-full bg-gradient-to-bl from-[#991313]/10 via-[#991313]/5 to-transparent blur-3xl" />
    
    {/* Deep Navy Radial Glow for Depth */}
    <div className="absolute -bottom-20 left-1/3 h-[300px] w-[400px] rounded-full bg-gradient-to-tr from-[#101A2B]/5 to-transparent blur-2xl" />

    {/* Elegant Background Image / Subtle Watercolor Texture Overlay */}
<div
  className="absolute inset-0 bg-right-top bg-no-repeat bg-contain"
  style={{
    backgroundImage: `url(${biblecoffee})`,
    maskImage:
      "radial-gradient(ellipse at center, black 55%, transparent 100%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, black 55%, transparent 100%)",
  }}
/>
    </div>

  <div className="relative z-10 mx-auto flex max-w-[1100px] items-start gap-6 px-8 py-14 lg:px-12">

    <DevotionalDateNav
      devotional={devotional}
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      loading={dateLoading}
      topOffsetClassName="pt-0"
    />

    <div className="flex-1">

      {dateNotice && (
        <p className="mb-4 text-sm font-medium text-[#991313]">
          {dateNotice}
        </p>
      )}

      {/* Breadcrumb */}
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

    </div>

  </div>
</section>

      {/* Reader */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-8 py-14 lg:grid-cols-[1fr_320px] lg:px-12 lg:py-20">

          <div>

            {/* Audio */}
            {devotional.audio_url && (
              <div
                id="devotional-audio"
                className="mb-14 rounded-2xl border border-black/10 bg-[#F8F8F7] p-5"
              >
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#991313]">
                    Listen
                  </p>

                  <p className="mt-1 text-sm text-[#4D5057]">
                    Listen to this devotional while you read.
                  </p>
                </div>

                <audio
                  controls
                  src={devotional.audio_url}
                  className="w-full"
                />
              </div>
            )}

            {/* Devotional Content */}
            <article className="text-[17px] leading-[2] text-[#374151]">
              <DevotionalContent
                parsed={parsed}
                fallbackContent={devotional.pure_content}
              />
            </article>

            {/* Bottom navigation */}
            <div className="mt-16 border-t border-black/10 pt-8">
              <Link
                to="/devotional"
                className="inline-flex items-center text-sm font-semibold text-[#991313] transition-colors hover:text-[#7f0e0e]"
              >
                ← Back to Devotionals
              </Link>
            </div>

            {/* Previous/Next navigation */}
            <DevotionalPrevNext previous={prevFormatted} next={nextFormatted} />

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
  );
}

export default DevotionalReader;