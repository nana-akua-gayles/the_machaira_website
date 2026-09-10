import { useState } from "react";
import DevotionalDateNav from "./DevotionalDateNav";
import DevotionalAudio from "./DevotionalAudio";
import heroImage from "../../../assets/devotionalImages/devotional-hero.png";

function formatDevotionalTitle(title) {
  if (!title) {
    return {
      mainTitle: "Today's Devotional",
      episodeLabel: "",
    };
  }

  // Example:
  // EPISODE 1327 - IS ANYTHING TOO HARD FOR THE LORD?
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

function DevotionalHero({
    devotional,
    loading,
    error,
    selectedDate,
    onDateSelect,
  }) {
  const [showFullExcerpt, setShowFullExcerpt] = useState(false);
  const formatted = formatDevotionalTitle(devotional?.title);
  const hasDevotional = Boolean(devotional);

  return (
    <section className="relative min-h-[570px] overflow-hidden bg-white">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-8 pt-10 lg:px-12">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-lg text-[#991313]">
            ⌂
          </span>

          <span className="text-[#B9BEC8]">
            /
          </span>

          <span className="text-[#374151]">
            Devotional
          </span>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex min-h-[510px] max-w-[1440px] px-8 lg:px-12">

        {/* Date navigation */}
        <DevotionalDateNav
          devotional={devotional}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          loading={loading}
        />

        {/* Main devotional content */}
        <div className="flex flex-1 items-center">

          <div className="max-w-[560px] pt-8">

            {loading ? (
              <>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
                  Daily Devotional
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#101A2B] lg:text-6xl">
                  Loading today's
                  <br />
                  devotional...
                </h1>
              </>
            ) : error ? (
              <>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
                  Devotional
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#101A2B] lg:text-6xl">
                  Something went
                  <br />
                  wrong.
                </h1>

                <p className="mt-6 max-w-[500px] text-lg leading-8 text-[#374151]">
                  We couldn't load today's devotional. Please try again.
                </p>
              </>
            ) : hasDevotional ? (
              <>
                {/* Category */}
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
                  {devotional.category || "Daily Devotional"}
                </p>

                {/* Title */}
                <h1 className="max-w-[560px] text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#101A2B] lg:text-6xl">
                  {formatted.mainTitle}
                </h1>

                {/* Episode */}
                {formatted.episodeLabel && (
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#4D5057]">
                    {formatted.episodeLabel}
                  </p>
                )}

                {/* Accent line */}
                <div className="my-7 h-[2px] w-12 bg-[#991313]" />

                {/* Description */}
                <p className="max-w-[500px] text-lg leading-8 text-[#374151]">
                  {devotional.excerpt ? (
                    <>
                      {showFullExcerpt
                        ? devotional.excerpt
                        : `${devotional.excerpt.slice(0, 100)}${
                            devotional.excerpt.length > 100 ? "..." : ""
                          }`}

                      {devotional.excerpt.length > 100 && (
                        <>
                          {" "}
                          <button
                            type="button"
                            onClick={() => setShowFullExcerpt((prev) => !prev)}
                            className="font-semibold text-[#991313] transition-colors duration-200 hover:text-[#7f0e0e]"
                          >
                            {showFullExcerpt ? "See less" : "See more"}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    "Take time today to reflect on God's word and discover fresh strength for your walk with Him."
                  )}
                </p>

                {/* Actions */}
                <div className="mt-9 flex flex-wrap items-center gap-4">

                  <button
                    type="button"
                    className="rounded-full bg-[#991313] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#7f0e0e] hover:shadow-lg"
                  >
                    <span className="mr-2">
                      ▢
                    </span>

                    Read Devotional
                  </button>

                  <DevotionalAudio
                    audioUrl={devotional.audio_url}
                    duration="8 min"
                  />

                </div>
              </>
            ) : (
              <>
                {/* No devotional today */}
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#991313]">
                  Your Journey Continues
                </p>

                <h1 className="max-w-[560px] text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#101A2B] lg:text-6xl">
                  Recap Your
                  <br />
                  Learning Experience
                </h1>

                <div className="my-7 h-[2px] w-12 bg-[#991313]" />

                <p className="max-w-[500px] text-lg leading-8 text-[#374151]">
                  There isn't a new devotional for today yet. Take a moment
                  to revisit the lessons and wisdom from previous Machaira
                  devotionals.
                </p>

                <div className="mt-9">
                  <button
                    type="button"
                    className="rounded-full bg-[#991313] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#7f0e0e] hover:shadow-lg"
                  >
                    Explore Previous Devotionals
                    <span className="ml-2">
                      →
                    </span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Scripture */}
        {hasDevotional && (
          <div className="hidden w-[300px] -translate-x-8 items-center justify-center lg:flex">
            <div className="relative flex h-[240px] w-[240px] items-center justify-center rounded-full border border-[#9CA3AF]/50">

              <div className="max-w-[180px]">
                <p className="text-base italic leading-7 text-[#111827]">
                  "The Lord is my strength and my shield; my heart trusts in Him."
                </p>

                <p className="mt-3 text-sm font-semibold text-[#991313]">
                  — Psalm 28:7
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default DevotionalHero;