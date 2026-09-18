import DOMPurify from "dompurify";

function extractSections(html) {
  const sectionPattern =
    /DIG DEEPER\s*(?:\((.*?)\))?\s*WE PRAY\s*(.*?)\s*BIBLE READING IN THE YEAR\s*(\d{4})\s*(.*?)\s*DECLARE THESE WORDS:\s*(.*)$/is;

  const match = html.match(sectionPattern);

  if (!match) {
    return {
      mainContent: html,
      deepDiver: null,
      prayer: null,
      bibleReading: null,
      declarations: null,
    };
  }

  const [
    fullMatch,
    deepDiverText,
    prayerText,
    bibleYear,
    biblePlans,
    declarationsText,
  ] = match;

  const mainContent = html.replace(fullMatch, "");

  const deepDiver = deepDiverText
    ? deepDiverText
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const oneYearMatch = biblePlans.match(
    /1\s+YEAR\s+PLAN\s*(.*?)(?=2\s+YEARS?\s+PLAN|$)/is
  );

  const twoYearMatch = biblePlans.match(
    /2\s+YEARS?\s+PLAN\s*(.*)$/is
  );

const declarations = declarationsText
  ? (() => {
      const rawParts = declarationsText
        .split(/[\u2013\u2014]\s*/)
        .map((s) => s.trim())
        .filter(Boolean);

      const merged = [];
      for (const part of rawParts) {
        const looksLikeNewDeclaration = /^[A-Z]/.test(part);
        if (!looksLikeNewDeclaration && merged.length > 0) {
          merged[merged.length - 1] =
            `${merged[merged.length - 1]} \u2014 ${part}`;
        } else {
          merged.push(part);
        }
      }
      return merged;
    })()
  : [];

  return {
    mainContent,
    deepDiver,
    prayer: prayerText?.trim(),
    bibleReading: {
      year: bibleYear,
      oneYear: oneYearMatch?.[1]?.trim() || "",
      twoYear: twoYearMatch?.[1]?.trim() || "",
    },
    declarations,
  };
}

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const WEEKDAYS = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";

const datePattern = new RegExp(
  `(${WEEKDAYS}),\\s*\\d{1,2}(?:st|nd|rd|th)\\s+(?:${MONTHS}),?\\s*\\d{4}`,
  "i"
);

function extractBannerTitleAndVerse(html) {
  const dateMatch = html.match(datePattern);

  if (!dateMatch) {
    return {
      authorMessage: null,
      hasBanner: false,
      titleText: null,
      memoryVerse: null,
      content: html,
    };
  }

  const preamble = html.slice(0, dateMatch.index);
  const afterDateIndex = dateMatch.index + dateMatch[0].length;
  const afterDate = html.slice(afterDateIndex);

  const downloadIdx = preamble.search(/Download PDF/i);
  const hasBanner = downloadIdx !== -1;
  let authorMessage = null;

  if (hasBanner) {
    let afterDownload = preamble.slice(downloadIdx + "Download PDF".length);
    afterDownload = afterDownload.replace(/^\s*<\/a>/i, "");

    const authorIdx = afterDownload.search(/Apostle Bennie/i);
    const quoteRaw =
      authorIdx === -1 ? afterDownload : afterDownload.slice(0, authorIdx);

    authorMessage = quoteRaw.replace(/\s+/g, " ").trim() || null;
  }

  const openQuoteIndex = afterDate.indexOf("\u201C");

  if (openQuoteIndex === -1) {
    return {
      authorMessage,
      hasBanner,
      titleText: null,
      memoryVerse: null,
      content: afterDate,
    };
  }

  const titleText = afterDate.slice(0, openQuoteIndex).trim() || null;
  const afterOpenQuote = afterDate.slice(openQuoteIndex + 1);
  const closeQuoteIndex = afterOpenQuote.indexOf("\u201D");

  if (closeQuoteIndex === -1) {
    return {
      authorMessage,
      hasBanner,
      titleText,
      memoryVerse: null,
      content: afterDate.slice(openQuoteIndex),
    };
  }

  const verseText = afterOpenQuote.slice(0, closeQuoteIndex).trim();
  const afterCloseQuote = afterOpenQuote.slice(closeQuoteIndex + 1);

  const citationMatch = afterCloseQuote.match(/^\s*([^\n]+?)\s*\n\s*\n/);
  let citation = null;
  let bodyStart = afterCloseQuote;

  if (citationMatch) {
    citation = citationMatch[1].trim();
    bodyStart = afterCloseQuote.slice(citationMatch[0].length);
  }

  return {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse: { text: verseText, citation },
    content: bodyStart.trim(),
  };
}

function DevotionalContent({ parsed, fallbackContent }) {
  if (!parsed) {
    if (fallbackContent) {
      return (
        <div className="devotional-content whitespace-pre-line">
          {fallbackContent}
        </div>
      );
    }

    return (
      <p className="text-[#6B7280]">
        The content for this devotional is not available yet.
      </p>
    );
  }

  const { hasBanner, authorMessage, titleText, memoryVerse, mainContent } =
    parsed;

  return (
    <>
      {hasBanner && (
        <div className="devotional-author-banner">
          <p className="devotional-author-org">
            CHRIST COMMONWEALTH-COMMUNITY
          </p>
          <p className="devotional-author-tagline">The Love-Life Agency</p>

          {authorMessage && (
            <p className="devotional-author-quote">{authorMessage}</p>
          )}

          <div className="devotional-author-meta">
            <span className="devotional-author-name">Apostle Bennie</span>
            <span className="devotional-author-role">Author</span>
          </div>
        </div>
      )}

      <div className="devotional-content">
        {titleText && <h2>{titleText}</h2>}

        {memoryVerse && (
          <blockquote className="devotional-memory-verse">
            {memoryVerse.text}
            {memoryVerse.citation && (
              <cite className="devotional-memory-verse-citation">
                {memoryVerse.citation}
              </cite>
            )}
          </blockquote>
        )}

        <div
          className="devotional-article-body"
          dangerouslySetInnerHTML={{
            __html: mainContent,
          }}
        />
      </div>
    </>
  );
}

export default DevotionalContent;