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
    .split(/[–—]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

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

// The CMS content starts with site branding + a "Download PDF" button
// + a short daily quote from Apostle Bennie + his name/role, then the
// date, then a duplicate of the devotional title, all glued together.
// This pulls the quote out as `authorMessage` (for the banner) and
// turns the duplicate title into a proper heading, dropping the
// branding/date text since both are shown elsewhere on the page.
function extractBannerAndTitle(html) {
  const dateMatch = html.match(datePattern);

  if (!dateMatch) {
    return { authorMessage: null, content: html };
  }

  const preamble = html.slice(0, dateMatch.index);
  const afterDateIndex = dateMatch.index + dateMatch[0].length;
  const afterDate = html.slice(afterDateIndex);

  let authorMessage = null;
  const downloadIdx = preamble.search(/Download PDF/i);

  if (downloadIdx !== -1) {
    let afterDownload = preamble.slice(downloadIdx + "Download PDF".length);
    afterDownload = afterDownload.replace(/^\s*<\/a>/i, "");

    const authorIdx = afterDownload.search(/Apostle Bennie/i);
    const quoteRaw =
      authorIdx === -1 ? afterDownload : afterDownload.slice(0, authorIdx);

    authorMessage = quoteRaw.replace(/\s+/g, " ").trim() || null;
  }

  const quoteMarkIndex = afterDate.indexOf("\u201C");
  let content;

  if (quoteMarkIndex === -1) {
    content = afterDate;
  } else {
    const titleText = afterDate.slice(0, quoteMarkIndex).trim();
    const rest = afterDate.slice(quoteMarkIndex);
    const titleHtml = titleText ? `<h2>${titleText}</h2>` : "";
    content = `${titleHtml}${rest}`;
  }

  return { authorMessage, content };
}

function DevotionalContent({ content, fallbackContent }) {
  if (!content) {
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

const cleanContent = DOMPurify.sanitize(content, {
  FORBID_ATTR: ["style"],
});

const normalizedContent = cleanContent.replace(/&nbsp;/g, " ");
const { authorMessage, content: preparedContent } =
  extractBannerAndTitle(normalizedContent);

const {
  mainContent,
  deepDiver,
  prayer,
  bibleReading,
  declarations,
} = extractSections(preparedContent);

  return (
    <>
    {authorMessage && (
      <div className="devotional-author-banner">
        <p className="devotional-author-quote">{authorMessage}</p>
        <div className="devotional-author-meta">
          <span className="devotional-author-name">Apostle Bennie</span>
          <span className="devotional-author-role">Author</span>
        </div>
      </div>
    )}
    
    <div className="devotional-content">

      {/* Main devotional article */}
      <div
        dangerouslySetInnerHTML={{
          __html: mainContent,
        }}
      />

      {/* DIG DEEPER */}
      {deepDiver && deepDiver.length > 0 && (
        <section className="devotional-section devotional-deep-dive">
          <div className="devotional-section-heading">
            <span className="devotional-section-icon">▣</span>

            <h2>DIG DEEPER</h2>
          </div>

          <div className="devotional-reference-list">
            {deepDiver.map((reference) => (
              <div
                key={reference}
                className="devotional-reference"
              >
                <span className="devotional-reference-dot" />
                <span>{reference}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WE PRAY */}
      {prayer && (
        <section className="devotional-section devotional-prayer">
          <div className="devotional-section-heading">
            <span className="devotional-section-icon">♧</span>

            <h2>WE PRAY</h2>
          </div>

          <p>{prayer}</p>
        </section>
      )}

      {/* BIBLE READING */}
      {bibleReading && (
        <section className="devotional-section devotional-bible-reading">
          <div className="devotional-section-heading">
            <span className="devotional-section-icon">▤</span>

            <h2>
              BIBLE READING
              <span>IN THE YEAR {bibleReading.year}</span>
            </h2>
          </div>

          <div className="devotional-reading-plans">

            <div className="devotional-reading-plan">
              <span>1 YEAR PLAN</span>
              <p>{bibleReading.oneYear}</p>
            </div>

            <div className="devotional-reading-plan">
              <span>2 YEARS PLAN</span>
              <p>{bibleReading.twoYear}</p>
            </div>

          </div>
        </section>
      )}

      {/* DECLARE THESE WORDS */}
      {declarations && declarations.length > 0 && (
        <section className="devotional-section devotional-declarations">
          <div className="devotional-section-heading">
            <h2>DECLARE THESE WORDS</h2>
          </div>

          <div className="devotional-declaration-list">
            {declarations.map((declaration) => (
              <div
                key={declaration}
                className="devotional-declaration"
              >
                <span>–</span>
                <p>{declaration}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
    </>
  );
}

export default DevotionalContent;