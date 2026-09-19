import DOMPurify from "dompurify";

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const WEEKDAYS = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";

const datePattern = new RegExp(
  `(${WEEKDAYS}),\\s*\\d{1,2}(?:st|nd|rd|th)\\s+(?:${MONTHS}),?\\s*\\d{4}`,
  "i"
);

// Splits the CMS's glued-together header block into the banner data,
// the duplicate title, and the opening memory verse + citation. Returns
// whatever's left as `content` for extractSections to work on.
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

// Splits off DIG DEEPER / WE PRAY / BIBLE READING / DECLARE THESE WORDS
// from the end of the article body.
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
    ? deepDiverText.split(";").map((item) => item.trim()).filter(Boolean)
    : [];

  const oneYearMatch = biblePlans.match(
    /1\s+YEAR\s+PLAN\s*(.*?)(?=2\s+YEARS?\s+PLAN|$)/is
  );
  const twoYearMatch = biblePlans.match(/2\s+YEARS?\s+PLAN\s*(.*)$/is);

  // A real declaration always starts a new sentence (capital letter).
  // If a fragment after splitting on a dash starts lowercase, it's
  // probably a mid-sentence em-dash aside, not a new bullet, merge it
  // back into the previous declaration.
  const rawParts = declarationsText
    .split(/[\u2013\u2014]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const declarations = [];
  for (const part of rawParts) {
    const looksLikeNewDeclaration = /^[A-Z]/.test(part);
    if (!looksLikeNewDeclaration && declarations.length > 0) {
      declarations[declarations.length - 1] =
        `${declarations[declarations.length - 1]} \u2014 ${part}`;
    } else {
      declarations.push(part);
    }
  }

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

// Public entry point. Takes the raw `content` field from Supabase and
// returns every piece the Reader needs: the banner, the title, the
// memory verse, the article body, and the four special sections.
// Returns null if there's no content to parse.
export function parseDevotionalContent(rawContent) {
  if (!rawContent) {
    return null;
  }

  const cleanContent = DOMPurify.sanitize(rawContent, {
    FORBID_ATTR: ["style"],
  });

  const normalizedContent = cleanContent.replace(/&nbsp;/g, " ");

  const {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse,
    content: afterHeader,
  } = extractBannerTitleAndVerse(normalizedContent);

  const { mainContent, deepDiver, prayer, bibleReading, declarations } =
    extractSections(afterHeader);

  return {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse,
    mainContent,
    deepDiver,
    prayer,
    bibleReading,
    declarations,
  };
}