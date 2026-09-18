import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DevotionalContent from "./devotionalFeatures/DevotionalContent";
import DevotionalDateNav from "./devotionalFeatures/DevotionalDateNav";
import {getDevotionalById, getDevotionalByDate} from "../../lib/devotionalService";
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

  useEffect(() => {
    async function loadDevotional() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDevotionalById(id);

        console.log("DEVOTIONAL READER:", data);
        console.log("RAW CONTENT:", JSON.stringify(data.content));

        if (!data) {
          setError("This devotional could not be found.");
          return;
        }

        setDevotional(data);
        setSelectedDate(data.created_at.split("T")[0]);
        setDateNotice(null);
      } catch (err) {
        console.error("DEVOTIONAL READER FAILED:", err);
        setError("Unable to load this devotional.");
      } finally {
        setLoading(false);
      }
    }

    loadDevotional();
  }, [id]);

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

  return (
    <main className="bg-white">

      {/* Header */}
      <section className="border-b border-black/10 bg-[#F8F8F7]">
        <div className="mx-auto flex max-w-[1100px] items-start gap-6 px-8 py-14 lg:px-12">

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
        <div className="mx-auto max-w-[820px] px-8 py-14 lg:px-12 lg:py-20">

          {/* Audio */}
          {devotional.audio_url && (
            <div className="mb-14 rounded-2xl border border-black/10 bg-[#F8F8F7] p-5">
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
              content={devotional.content}
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

        </div>
      </section>

    </main>
  );
}

export default DevotionalReader;