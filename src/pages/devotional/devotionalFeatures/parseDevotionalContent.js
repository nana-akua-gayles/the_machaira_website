import DOMPurify from "dompurify";

// ---------------------------------------------------------------------
// TEXT CLEANUP
// The CMS content often has small copy/paste damage: HTML entity codes
// left undecoded, missing spaces where two sentences got glued together,
// stray shortcode tags, etc. These run once, right after sanitizing,
// before any of the banner/title/verse/section extraction below.
// ---------------------------------------------------------------------

const ENTITY_MAP = {
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&nbsp;": " ",
  "&amp;": "&",
  "&#8230;": "…",
};

// Decodes leftover numeric HTML entities the CMS didn't convert, and
// strips invisible bidi-control characters that sometimes get pasted in.
function decodeEntities(str) {
  if (!str) return "";
  const decoded = Object.entries(ENTITY_MAP).reduce(
    (acc, [entity, char]) => acc.split(entity).join(char),
    str
  );
  return decoded.replace(/[‎‏‪-‮⁦-⁩]/g, "");
}

// Strips a leftover CSS comment block (and any rule blocks right after
// it) if the CMS accidentally pasted raw CSS at the very start of the
// content.
function stripLeadingCss(str) {
  if (!str) return str;
  const cssCommentRe = /^\s*\/\*[\s\S]*?\*\/\s*/;
  const commentMatch = str.match(cssCommentRe);
  if (!commentMatch) return str;
  let rest = str.slice(commentMatch[0].length);
  const ruleBlockRe = /^\s*[^{}\n]{1,150}\{[^{}]*\}\s*/;
  let consumed = 0;
  while (true) {
    const m = rest.slice(consumed).match(ruleBlockRe);
    if (!m) break;
    consumed += m[0].length;
  }
  return rest.slice(consumed);
}

// Removes stray plain-text YouTube URLs that leaked into the body
// outside of a real <a> link (leaves URLs that are already inside a
// link alone).
function stripBarePlainTextUrls(html) {
  const parts = html.split(/(<[^>]+>)/g);
  let insideAnchor = false;
  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<a\b/i.test(part)) insideAnchor = true;
        if (/^<\/a>/i.test(part)) insideAnchor = false;
        return part;
      }
      if (insideAnchor) return part;
      let result = part.replace(
        /https?:\/\/(?:www\.)?youtu\.be\/[A-Za-z0-9_-]{11}(?:&(?:(?!DIG|WE\s+PRAY|BIBLE|DECLARE)[^\s])*)?/g,
        " "
      );
      result = result.replace(
        /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}(?:&(?:(?!DIG|WE\s+PRAY|BIBLE|DECLARE)[^\s])*)?/g,
        " "
      );
      return result.replace(/[ \t]{2,}/g, " ");
    })
    .join("");
}

const COMMON_ABBREVIATIONS_WITH_SPACE = ["U.S. ", "U.K. ", "B.C. ", "A.D. ", "U.N. ", "D.C. "];

// Adds a missing space after . ! ? when the CMS glued two sentences
// together ("word.Next sentence" -> "word. Next sentence"), without
// breaking common abbreviations like "U.S." or "A.D.".
function fixMissingSentenceSpaces(str) {
  const MASK = "\u0002";
  let masked = str || "";
  COMMON_ABBREVIATIONS_WITH_SPACE.forEach((abbr, i) => {
    masked = masked.split(abbr).join(`${MASK}${i}${MASK}`);
  });
  let fixed = masked.replace(
    /([.!?])(["'”’]?)(?=[A-Z“])/g,
    (m, p, q) => `${p}${q} `
  );
  COMMON_ABBREVIATIONS_WITH_SPACE.forEach((abbr, i) => {
    fixed = fixed.split(`${MASK}${i}${MASK}`).join(abbr);
  });
  return fixed;
}

// Splits words glued together where a lowercase run bumps straight into
// an uppercase letter ("wordWord" -> "word Word").
function fixGluedWords(str) {
  return (str || "").replace(
    /(?<![A-Z])\b([a-z]{2,})([A-Z][a-z]+)/g,
    (m, b, a) => `${b} ${a}`
  );
}

// Splits a word glued directly to an opening curly quote.
function fixWordGluedToQuote(str) {
  return (str || "").replace(/([a-z]{2,})(“)/g, (m, word, q) => `${word} ${q}`);
}

// Fixes a closing quote mark that landed on the wrong side of a
// scripture citation (uses the same SCRIPTURE_REF pattern defined
// below).
function fixMisdirectedClosingQuote(str) {
  if (!str) return str;
  return str.replace(
    new RegExp(`\\.“(\\s*(?:${SCRIPTURE_REF.source}))`, "i"),
    ".”$1"
  );
}

// Splits a digit or closing bracket glued directly to a capital letter.
function fixDigitOrParenGluedToCapital(str) {
  return (str || "").replace(/([0-9)\]])([A-Z][a-z]+)/g, (m, b, a) => `${b} ${a}`);
}

// Splits a word glued directly to a following number marker.
function fixWordGluedToDigit(str) {
  return (str || "").replace(/([a-z]{2,})(\d{1,2}\.\s)/g, (m, word, marker) => `${word} ${marker}`);
}

// Splits an ALL CAPS run glued directly to the next word.
function fixAllCapsGlue(str) {
  return (str || "").replace(/\b([A-Z]{2,})([A-Z][a-z]+)/g, (m, b, a) => `${b} ${a}`);
}

// Strips leftover CMS shortcode tags like [button]...[/button].
function stripShortcodes(str) {
  return (str || "")
    .replace(/\[\/[a-z0-9_\-]+\]/gi, "")
    .replace(/\[([a-z][a-z0-9_\-]*)((?:\s+[a-z0-9_\-]+=["'][^"']*["'])+)\s*\]/gi, "")
    .trim();
}

// Runs every text-cleanup fix above, in order, on the sanitized content.
function cleanupContentText(html) {
  let result = html;
  result = stripLeadingCss(result);
  result = stripBarePlainTextUrls(result);
  result = decodeEntities(result);
  result = fixMisdirectedClosingQuote(result);
  result = fixMissingSentenceSpaces(result);
  result = fixGluedWords(result);
  result = fixWordGluedToQuote(result);
  result = fixWordGluedToDigit(result);
  result = fixDigitOrParenGluedToCapital(result);
  result = fixAllCapsGlue(result);
  result = stripShortcodes(result);
  return result;
}

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const WEEKDAYS = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";

const datePattern = new RegExp(
  `(${WEEKDAYS}),\\s*\\d{1,2}(?:st|nd|rd|th)\\s+(?:${MONTHS}),?\\s*\\d{4}`,
  "i"
);

// Canonical Bible book names/abbreviations, used to find a scripture
// citation ("1 Thessalonians 5:13 (Amplified Bible)") by recognizing the
// book name itself, rather than assuming it sits alone on its own line.
const BOOKS = [
  "Genesis|Gen\\.?", "Exodus|Ex\\.?|Exod\\.?", "Leviticus|Lev\\.?", "Numbers|Num\\.?", "Deuteronomy|Deut\\.?",
  "Joshua|Josh\\.?", "Judges|Judg\\.?", "Ruth", "1 Samuel|1 Sam\\.?", "2 Samuel|2 Sam\\.?", "1 Kings|1 Kgs\\.?", "2 Kings|2 Kgs\\.?",
  "1 Chronicles|1 Chron\\.?|1 Chr\\.?", "2 Chronicles|2 Chron\\.?|2 Chr\\.?", "Ezra", "Nehemiah|Neh\\.?", "Esther|Esth\\.?", "Job",
  "Psalms?|Ps\\.?|Psa\\.?", "Proverbs|Prov\\.?", "Ecclesiastes|Eccl\\.?", "Songs? of Solomon|Song of Songs",
  "Isaiah|Isa\\.?", "Jeremiah|Jer\\.?", "Lamentations|Lam\\.?", "Ezekiel|Ezek\\.?", "Daniel|Dan\\.?", "Hosea|Hos\\.?", "Joel",
  "Amos", "Obadiah|Obad\\.?", "Jonah|Jon\\.?", "Micah|Mic\\.?", "Nahum|Nah\\.?", "Hab[b]?akkuk|Habbakuk|Hab\\.?", "Zephaniah|Zeph\\.?",
  "Haggai|Hag\\.?", "Zechariah|Zech\\.?", "Malachi|Mal\\.?", "Matthew|Matt\\.?", "Mark|Mk\\.?", "Luke|Lk\\.?", "John|Jn\\.?",
  "Acts", "Romans|Rom\\.?", "1 Corinthians|1 Cor\\.?", "2 Corinthians|2 Cor\\.?", "Galatians|Gal\\.?",
  "Ephesians|Eph\\.?", "Philippia?ns|Phil\\.?", "Colossians|Col\\.?", "1 Thessalonians|1 Thess\\.?",
  "2 Thessalonians|2 Thess\\.?", "1 Timothy|1 Tim\\.?", "2 Timothy|2 Tim\\.?", "Titus|Tit\\.?", "Philemon|Philem\\.?",
  "Hebrews|Heb\\.?", "James|Jas\\.?", "1 Peter|1 Pet\\.?", "2 Peter|2 Pet\\.?", "1 John|1 Jn\\.?", "2 John|2 Jn\\.?", "3 John|3 Jn\\.?",
  "Jude", "Revelation|Rev\\.?",
];

const BOOK_PATTERN = BOOKS
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((b) => b.replace(/\s+/g, "\\s+"))
  .join("|");

const SCRIPTURE_REF = new RegExp(
  `\\b((?:${BOOK_PATTERN})\\s+\\d{1,3}(?:\\s*:\\s*\\d{1,3}(?:\\s*[\\u2010\\u2013\\u2014-]\\s*\\d{1,3})?)?(?:\\s*\\([^)]{1,40}\\))?\\.?)`,
  "i"
);

// Finds the first scripture reference in a block of text, e.g. matches
// "1 Thessalonians 5:13 (Amplified Bible)" wherever it appears, not just
// on its own line.
function findScriptureReference(text) {
  const match = text.match(SCRIPTURE_REF);
  if (!match) return null;
  return { ref: match[1].trim().replace(/\.$/, ""), index: match.index, length: match[0].length };
}

// Looks for a citation in the text right after the memory verse's closing
// quote. Searches a 300-character window (citations are short) instead of
// requiring a blank line, so it works whether the citation sits on its own
// line, is followed by a single newline, or is separated by a dash.
function extractCitation(afterCloseQuote) {
  const searchWindow = afterCloseQuote.slice(0, 300);
  const found = findScriptureReference(searchWindow);

  if (!found) {
    return { citation: null, bodyStart: afterCloseQuote.trim() };
  }

  return {
    citation: found.ref,
    bodyStart: afterCloseQuote.slice(found.index + found.length).trim(),
  };
}

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

  const { citation, bodyStart } = extractCitation(afterCloseQuote);

  return {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse: { text: verseText, citation },
    content: bodyStart,
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
  const cleanedUpContent = cleanupContentText(normalizedContent);

  const {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse,
    content: afterHeader,
  } = extractBannerTitleAndVerse(cleanedUpContent);

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