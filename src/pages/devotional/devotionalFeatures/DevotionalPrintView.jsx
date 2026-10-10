import { useMemo } from "react";
import DevotionalContent from "./DevotionalContent";
import DevotionalSidebar from "./DevotionalSidebar";
import { formatDevotionalTitle, formatDate } from "./formatDevotional";
import { parseDevotionalContent } from "./parseDevotionalContent";
import apostleBennieAvatar from "../../../assets/images/Apostle1.jpg";
import "../devotional.css";

const PRINT_CSS = `
#devotional-print-root{display:none}
@page{margin:16mm}
@media print{
  body.printing-devotional>*:not(#devotional-print-root){display:none!important}
  body.printing-devotional #devotional-print-root{display:block}
}`;

function DevotionalPrintView({ devotional }) {
  const parsed = useMemo(() => parseDevotionalContent(devotional.content), [devotional]);
  const formatted = formatDevotionalTitle(devotional.title);

  return (
    <div id="devotional-print-root" className="bg-white">
      <style>{PRINT_CSS}</style>

      <div className="mx-auto max-w-200">
        {parsed?.hasBanner && (
          <div className="mb-8 flex items-center gap-6 rounded-2xl border border-black/10 bg-[#FBF8F6] p-6">
            <div className="flex flex-1 items-start gap-4">
              <span className="shrink-0 font-serif text-5xl leading-none text-burgundy-primary">“</span>
              <p className="text-base italic leading-relaxed text-navy-dark">
                {parsed.authorMessage || "Welcome to Today's Machaira"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <img src={apostleBennieAvatar} alt="Apostle Bennie" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-navy-dark">Apostle Bennie</p>
                <p className="text-xs text-cool-gray">Author</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-burgundy-primary">
          {devotional.category || "Machaira with Apostle Bennie"}
        </p>
        <h1 className="mt-4 text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-navy-dark">
          {formatted.mainTitle}
        </h1>
        <div className="mt-6 h-0.75 w-16 bg-burgundy-primary" />
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cool-gray">
          {formatted.episodeLabel && <span>{formatted.episodeLabel}</span>}
          <span className="text-soft-gray">•</span>
          <span>{formatDate(devotional.created_at)}</span>
        </div>

        <article className="mt-10 text-[17px] leading-loose text-[#374151]">
          <DevotionalContent parsed={parsed} fallbackContent={devotional.pure_content} />
        </article>

        <div className="mt-10">
          <DevotionalSidebar
            deepDiver={parsed?.deepDiver}
            prayer={parsed?.prayer}
            bibleReading={parsed?.bibleReading}
            declarations={parsed?.declarations}
          />
        </div>
      </div>
    </div>
  );
}

export default DevotionalPrintView;