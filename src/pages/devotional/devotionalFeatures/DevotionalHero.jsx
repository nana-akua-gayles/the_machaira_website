import { useState } from "react";
import DevotionalDateNav from "./DevotionalDateNav";
import DevotionalAudio from "./DevotionalAudio";
import heroImage from "../../../assets/devotionalImages/devotional-hero.png";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

function formatDevotionalTitle(title) {
  if (!title) {
    return {
      mainTitle: "Today's Devotional",
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
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white lg:min-h-142.5">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/60 sm:bg-white/45 lg:bg-white/30" />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex max-w-360 flex-row items-start gap-3 px-3 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:min-h-127.5 lg:items-stretch lg:gap-0 lg:px-12 lg:py-0">

        {/* Date navigation */}
        <DevotionalDateNav
          devotional={devotional}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          loading={loading}
        />

        {/* Main devotional content */}
        <div className="flex min-w-0 flex-1 items-center">

          <div className="min-w-0 w-full max-w-140 lg:pt-8">

            {loading ? (
              <>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
                  Daily Devotional
                </p>

                <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-navy-dark sm:text-5xl lg:text-6xl">
                  Loading today's
                  <br />
                  devotional...
                </h1>
              </>
            ) : error ? (
              <>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
                  Devotional
                </p>

                <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-navy-dark sm:text-5xl lg:text-6xl">
                  Something went
                  <br />
                  wrong.
                </h1>

                <p className="mt-6 max-w-125 text-base leading-7 text-[#374151] sm:text-lg sm:leading-8">
                  We couldn't load today's devotional. Please try again.
                </p>
              </>
            ) : hasDevotional ? (
              <>
                {/* Category */}
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
                  {devotional.category || "Daily Devotional"}
                </p>

                {/* Title */}
                <h1 className="max-w-140 text-[clamp(1.4rem,6vw,1.875rem)] font-semibold leading-[1.12] break-words tracking-[-0.04em] text-navy-dark sm:text-4xl lg:text-5xl">
                  {formatted.mainTitle}
                </h1>

                {/* Episode */}
                {formatted.episodeLabel && (
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-cool-gray">
                    {formatted.episodeLabel}
                  </p>
                )}

                {/* Accent line */}
                <div className="my-5 h-0.5 w-12 bg-burgundy-primary sm:my-7" />

                {/* Description */}
                <p className="max-w-125 text-base leading-7 text-[#374151] sm:text-lg sm:leading-8">
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
                            className="font-semibold text-burgundy-primary transition-colors duration-200 hover:text-[#7f0e0e]"
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
                <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4 sm:mt-9">

                <button
                  type="button"
                  onClick={() => navigate(`/devotional/${devotional.id}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#7f0e0e] hover:shadow-lg"
                >
                  <BookOpen size={18} strokeWidth={2} />
                  Read
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
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-burgundy-primary">
                  Your Journey Continues
                </p>

                <h1 className="max-w-140 text-[clamp(1.4rem,6vw,1.875rem)] font-semibold leading-tight tracking-[-0.04em] text-navy-dark lg:text-3xl">
                  Recap Your
                  <br />
                  Learning Experience
                </h1>

                <div className="my-5 h-0.5 w-12 bg-burgundy-primary sm:my-7" />

                <p className="max-w-125 text-base leading-7 text-[#374151] sm:text-lg sm:leading-8">
                  There isn't a new devotional for today yet. Take a moment
                  to revisit the lessons and wisdom from previous Machaira
                  devotionals.
                </p>

                <div className="mt-7 sm:mt-9">
                  <button
                    type="button" onClick={() => navigate("/previous-devotionals")}
                    className="rounded-full bg-burgundy-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#7f0e0e] hover:shadow-lg"
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

      </div>
    </section>
  );
}

export default DevotionalHero;