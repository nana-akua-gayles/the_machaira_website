import DOMPurify from "dompurify";

// TEXT CLEANUP: fixes small CMS copy/paste damage (undecoded entities,
// glued sentences, stray shortcodes) before extraction runs below.

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

function decodeEntities(str) {
  if (!str) return "";
  const decoded = Object.entries(ENTITY_MAP).reduce(
    (acc, [entity, char]) => acc.split(entity).join(char),
    str
  );
  return decoded.replace(/[‎‏‪-‮⁦-⁩]/g, "");
}

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

function fixGluedWords(str) {
  return (str || "").replace(
    /(?<![A-Z])\b([a-z]{2,})([A-Z][a-z]+)/g,
    (m, b, a) => `${b} ${a}`
  );
}

function fixWordGluedToQuote(str) {
  return (str || "").replace(/([a-z]{2,})(“)/g, (m, word, q) => `${word} ${q}`);
}

function fixMisdirectedClosingQuote(str) {
  if (!str) return str;
  return str.replace(
    new RegExp(`\\.“(\\s*(?:${SCRIPTURE_REF.source}))`, "i"),
    ".”$1"
  );
}

function fixDigitOrParenGluedToCapital(str) {
  return (str || "").replace(/([0-9)\]])([A-Z][a-z]+)/g, (m, b, a) => `${b} ${a}`);
}

function fixWordGluedToDigit(str) {
  return (str || "").replace(/([a-z]{2,})(\d{1,2}\.\s)/g, (m, word, marker) => `${word} ${marker}`);
}

function fixAllCapsGlue(str) {
  return (str || "").replace(/\b([A-Z]{2,})([A-Z][a-z]+)/g, (m, b, a) => `${b} ${a}`);
}

function stripShortcodes(str) {
  return (str || "")
    .replace(/\[\/[a-z0-9_-]+\]/gi, "")
    .replace(/\[([a-z][a-z0-9_-]*)((?:\s+[a-z0-9_-]+=["'][^"']*["'])+)\s*\]/gi, "")
    .trim();
}

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

function findScriptureReference(text) {
  const match = text.match(SCRIPTURE_REF);
  if (!match) return null;
  return { ref: match[1].trim().replace(/\.$/, ""), index: match.index, length: match[0].length };
}

// PREAMBLE / TITLE / VERSE EXTRACTION: ported from the mobile app's
// formatDevotionalHtml.js (more tolerant of CMS format variance than a
// web-only version was). hasBanner/authorMessage are web-only fields,
// extracted separately below before this stripping removes that text.

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collapseWhitespace(str) {
  return (str || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function fuzzyFind(haystack, needle) {
  if (!needle) return null;
  const pattern = escapeRegExp(needle.trim())
    .replace(/\s+/g, "\\s+")
    .replace(/['\u2018\u2019]/g, "['\u2018\u2019]")
    .replace(/["\u201c\u201d]/g, '["\u201c\u201d]');
  const match = haystack.match(new RegExp(pattern, "i"));
  return match ? { index: match.index, length: match[0].length } : null;
}

function isStructured(content) {
  return /^\s*<(h3|h4|p|div)[\s>]/i.test(content);
}

const QUOTE_CHARS = new Set(['"', "'", "\u201c", "\u201d", "\u2018", "\u2019"]);
const CONTRACTION_TAILS = /^(s|t|re|ve|ll|d|m)(?![A-Za-z])/i;

function isWordInternalApostrophe(text, i) {
  const prev = text[i - 1];
  if (!prev || !/[A-Za-z]/.test(prev)) return false;
  return CONTRACTION_TAILS.test(text.slice(i + 1));
}

function matchCapsTitleRun(text) {
  let pos = 0;
  let lastGoodEnd = 0;
  while (pos < text.length) {
    let start = pos;
    while (start < text.length && /\s/.test(text[start])) start++;
    if (start >= text.length) break;
    if (text[start] === "(") {
      const closeIdx = text.indexOf(")", start);
      if (closeIdx === -1) break;
      pos = closeIdx + 1;
      lastGoodEnd = pos;
      continue;
    }
    let end = start;
    while (end < text.length) {
      const ch = text[end];
      if (/\s/.test(ch)) break;
      if (QUOTE_CHARS.has(ch) && !isWordInternalApostrophe(text, end)) {
        const restOfText = text.slice(end);
        const quoteWordMatch = restOfText.match(/^(["'\u201c\u2018])([A-Z][A-Z']*)(["'\u201d\u2019])/);
        if (quoteWordMatch) {
          end += quoteWordMatch[0].length;
          continue;
        }
        break;
      }
      end++;
    }
    if (end === start) break;
    const token = text.slice(start, end);
    const core = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
    const hasLetters = /[A-Za-z]/.test(core);
    const isAllCaps = hasLetters && core === core.toUpperCase();
    const isNumericOrPunctOnly = core.length > 0 && !hasLetters;
    if (core.length === 0) {
      const isConnectorOnly = /^[-\s\u2010\u2011\u2012\u2013\u2014:;,.\u2026]+$/.test(token);
      if (isConnectorOnly) {
        pos = end;
        lastGoodEnd = pos;
        continue;
      }
      break;
    }
    if (isAllCaps || isNumericOrPunctOnly) {
      pos = end;
      lastGoodEnd = pos;
      continue;
    }
    break;
  }
  return lastGoodEnd;
}

const JUNK_TEXT_PATTERNS = [
  /CHRIST\s+COMMONWEALTH[-\s]+COMMUNITY/gi,
  /The\s+Love[-\s]+Life\s+Agency/gi,
  /Download\s+PDF/gi,
  /\bBy\b(?=\s*(<a[^>]*>[\s\S]*?<\/a>\s*)?\(Pronounced)/g,
  /\(Pronounced\s*makh['\u2019]-ahee-rah\)\s*Daily\s*revelatory\s*thoughts\s*to\s*sharpen\s*you\s*and\s*to\s*help\s*you\s*grow\s*in\s*deep\s*spiritual\s*understanding\s*and\s*knowledge\.?\s*Daily\s*Christ-centered\s*and\s*apostolic-prophetic\s*prayers\.?/gi,
  /_{5,}/g,
  /To\s+be\s+a\s+part\s+of\s+the\s+gospel\s+financiers,?\s*send\s+us\s+a\s+mail\s+on\s*(<a[^>]*>[\s\S]*?<\/a>)?\.?/gi,
];
const ANCHOR_SEARCH_WINDOW = 500;
const KNOWN_AUTHOR_NAME_PREFIX = "(?:Apostle\\s+Bennie|APOSTLE\\s+BENJAMIN\\s+NANA\\s+AMISSAH\\s+ANSAH)\\s+";

function extendCapsRunWithSubtitle(text, capsEnd) {
  const rest = text.slice(capsEnd);
  const connectorMatch = rest.match(/^\s*[\u2013\u2014\u2010-]?\s*/);
  const afterConnector = rest.slice(connectorMatch[0].length);
  const subtitleMatch = afterConnector.match(/^([A-Za-z][A-Za-z\s\u2010\u2011!?-]*?)(\s*\d{1,2})?(?=["'\u2018\u201c])/);
  if (!subtitleMatch) return capsEnd;
  const subtitleWords = subtitleMatch[1].trim().split(/\s+/).filter(Boolean);
  if (subtitleWords.length < 2) return capsEnd;
  if (!/^[A-Z]/.test(subtitleWords[0])) return capsEnd;
  const midTextBoundary = /[.!?]\s+[A-Za-z]/.test(subtitleMatch[1]);
  if (midTextBoundary) return capsEnd;
  return capsEnd + connectorMatch[0].length + subtitleMatch[0].length;
}

function matchTitleWithOptionalSubtitle(text) {
  const capsEnd = matchCapsTitleRun(text);
  if (capsEnd === 0) return 0;
  return extendCapsRunWithSubtitle(text, capsEnd);
}

function stripStructuredPreamble(content) {
  let result = content.trim();
  const LEADING_BLOCK = /^\s*<(h3|p)([^>]*)>([\s\S]*?)<\/\1>\s*/i;
  while (true) {
    const match = result.match(LEADING_BLOCK);
    if (!match) break;
    const [full, tag, attrs, inner] = match;
    const innerText = stripTags(inner).trim();
    const hasDownloadLink = /download/i.test(attrs) || /<a[^>]*download/i.test(inner);
    const isDateStyle = /text-align:\s*right/i.test(attrs);
    const isEmptyish = innerText.length === 0;
    if (tag.toLowerCase() === "h3" || hasDownloadLink || isDateStyle || isEmptyish) {
      result = result.slice(full.length);
      continue;
    }
    break;
  }
  return { content: result.trim(), titleConfidence: "n/a-structural", droppedHead: null };
}

function stripFlatPreamble(content, { title } = {}) {
  let result = content;
  JUNK_TEXT_PATTERNS.forEach((re) => {
    result = result.replace(re, "");
  });
  result = result.replace(/<a[^>]*role=["']button["'][^>]*>\s*<\/a>/gi, "");
  result = result.replace(/<a[^>]*download[^>]*>[\s\S]*?<\/a>/gi, "");
  result = result.replace(/<a[^>]*>\s*<\/a>/gi, "");
  const searchZone = result.slice(0, ANCHOR_SEARCH_WINDOW);
  const dateMatch = searchZone.match(
    /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*(?:\d{1,2}(st|nd|rd|th)?,?\s*[A-Za-z]+,?\s*\d{4}|[A-Za-z]+\s+\d{1,2},?\s*\d{4})/
  );
  const authorMatch = !dateMatch
    ? searchZone.match(
        new RegExp(
          `(?:${KNOWN_AUTHOR_NAME_PREFIX})?(?<!\\bthe\\s)(?<!\\ban\\s)(?<!\\bour\\s)(?<!\\byour\\s)(?<!\\bhis\\s)(?<!\\bher\\s)(?<!\\bmy\\s)\\bAuthor\\b[\\s\\u00A0]+`,
          "i"
        )
      )
    : null;

  const anchorMatch = dateMatch || authorMatch;
  if (!anchorMatch) {
    const capsEnd = matchTitleWithOptionalSubtitle(result);
    let droppedHead = "";
    if (capsEnd > 0) {
      droppedHead = result.slice(0, capsEnd);
      result = result.slice(capsEnd);
    } else if (title) {
      const found = fuzzyFind(result, title);
      if (found) {
        droppedHead = result.slice(0, found.index + found.length);
        result = result.slice(found.index + found.length);
      }
    }
    return finalizeFlatResult(result, title, droppedHead);
  }
  let before = result.slice(0, anchorMatch.index);
  const afterAnchor = result.slice(anchorMatch.index + anchorMatch[0].length);
  if (dateMatch) {
    const authorInBefore = before.match(
      new RegExp(
        `(?:${KNOWN_AUTHOR_NAME_PREFIX})?(?<!\\bthe\\s)(?<!\\ban\\s)(?<!\\bour\\s)(?<!\\byour\\s)(?<!\\bhis\\s)(?<!\\bher\\s)(?<!\\bmy\\s)\\bAuthor\\b[\\s\\u00A0]+`,
        "i"
      )
    );
    if (authorInBefore) {
      before = before.slice(0, authorInBefore.index) + before.slice(authorInBefore.index + authorInBefore[0].length);
    }
  }
  const capsEnd = matchTitleWithOptionalSubtitle(afterAnchor);
  let titleSpan = "";
  let afterTitle = afterAnchor;
  if (capsEnd > 0) {
    titleSpan = afterAnchor.slice(0, capsEnd);
    afterTitle = afterAnchor.slice(capsEnd);
  } else if (title) {
    const found = fuzzyFind(afterAnchor, title);
    if (found) {
      titleSpan = afterAnchor.slice(0, found.index + found.length);
      afterTitle = afterAnchor.slice(found.index + found.length);
    }
  }
  const droppedHead = collapseWhitespace(`${anchorMatch[0]} ${titleSpan}`);
  const beforeTrimmed = before.trim();
  const spliced = beforeTrimmed ? `${beforeTrimmed}\u241E${afterTitle.trim()}` : afterTitle.trim();
  return finalizeFlatResult(spliced, title, droppedHead);
}

function isInsideOpenQuote(text, matchIndex) {
  const OPEN_QUOTES = new Set(["\u201c", "\u2018"]);
  const CLOSE_QUOTES = new Set(["\u201d", "\u2019", '"', "'"]);
  for (let i = matchIndex - 1; i >= 0; i--) {
    const ch = text[i];
    if (CLOSE_QUOTES.has(ch)) return false;
    if (OPEN_QUOTES.has(ch)) return true;
  }
  return false;
}

function finalizeFlatResult(content, title, droppedHead) {
  if (title) {
    const searchZone = content.slice(0, 400);
    const found = fuzzyFind(searchZone, title);
    if (found && !isInsideOpenQuote(searchZone, found.index)) {
      const before = content.slice(0, found.index).trim();
      const after = content.slice(found.index + found.length).trim();
      content = before ? `${before} ${after}` : after;
      droppedHead = collapseWhitespace(`${droppedHead} ${title}`);
    }
  }
  let titleConfidence = "unknown";
  if (title) {
    const normalizeQuotes = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
    const normalizedTitle = normalizeQuotes(collapseWhitespace(title).toLowerCase());
    const normalizedDropped = normalizeQuotes(collapseWhitespace(droppedHead).toLowerCase());
    titleConfidence = normalizedDropped.includes(normalizedTitle) ? "high" : "low";
  }
  return { content: content.trim(), titleConfidence, droppedHead: collapseWhitespace(droppedHead) };
}

function stripPreamble(content, { title } = {}) {
  return isStructured(content) ? stripStructuredPreamble(content) : stripFlatPreamble(content, { title });
}

// Finds the memory verse (quoted or bare) and its citation. Handles
// straight and curly quotes, and verses with no quote marks at all.
function extractOpeningScripture(content) {
  const h4Match = content.match(/^\s*<h4[^>]*>([\s\S]*?)<\/h4>\s*/i);
  if (h4Match) {
    const innerText = collapseWhitespace(stripTags(h4Match[1]));
    const found = findScriptureReference(innerText);
    if (found) {
      const quoteText = innerText.slice(0, found.index).trim().replace(/^[\u201c"]+|[\u201d"]+$/g, "").trim();
      return {
        keyVerseText: quoteText,
        keyVerseRef: found.ref,
        status: "found",
        leading: "",
        rest: content.slice(h4Match[0].length).trim(),
      };
    }
    const rest = content.slice(h4Match[0].length);
    const nextMatch = rest.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>\s*/i);
    if (nextMatch) {
      const nextText = collapseWhitespace(stripTags(nextMatch[1]));
      const nextFound = findScriptureReference(nextText);
      if (nextFound && nextText.length < 60) {
        const quoteText = innerText.replace(/^[\u201c"]+|[\u201d"]+$/g, "").trim();
        return {
          keyVerseText: quoteText,
          keyVerseRef: nextFound.ref,
          status: "found",
          leading: "",
          rest: rest.slice(nextMatch[0].length).trim(),
        };
      }
    }
    return { keyVerseText: null, keyVerseRef: null, status: "ambiguous-h4-no-ref", leading: "", rest: content };
  }
  const SEARCH_WINDOW = 800;
  const windowRaw = content.slice(0, SEARCH_WINDOW);
  const window = windowRaw.replace(/<[a-z0-9]+\s+[^>]*>/gi, (tag) => tag.replace(/["']/g, "\u0000"));
  const openMatch = window.match(/(^|\s|\d|\.)(["'\u201c\u2018\u201d])/);
  const quoteStart = openMatch ? openMatch.index + openMatch[1].length : -1;
  const earlyBareFound = findScriptureReference(window);
  const preferBarePath = earlyBareFound && earlyBareFound.index <= 220 && (quoteStart === -1 || quoteStart > earlyBareFound.index);
  if (quoteStart !== -1 && !preferBarePath) {
    const leading = content.slice(0, quoteStart).trim();
    const afterQuote = content.slice(quoteStart + 1, SEARCH_WINDOW);
    const closeRe = /["'\u2018\u201c\u201d\u2019]/g;
    let closeMatch;
    const closeCandidates = [];
    while ((closeMatch = closeRe.exec(afterQuote))) {
      closeCandidates.push(closeMatch.index);
    }
    let found = null;
    let usedCloseIdx = -1;
    for (let i = 0; i < closeCandidates.length; i++) {
      const idx = closeCandidates[i];
      const candidate = findScriptureReference(afterQuote.slice(idx + 1));
      if (candidate && candidate.index <= 40) {
        if (!found || candidate.index < found.index) {
          found = candidate;
          usedCloseIdx = idx;
        }
      }
    }
    if (found) {
      const rawQuoteText = afterQuote.slice(0, usedCloseIdx).trim();
      const quoteText = rawQuoteText.replace(/["'\u2018\u2019\u201c\u201d]/g, "").trim();
      const consumedLength = quoteStart + 1 + usedCloseIdx + 1 + found.index + found.length;
      return {
        keyVerseText: quoteText,
        keyVerseRef: found.ref,
        status: "found",
        leading,
        rest: content.slice(consumedLength).trim(),
      };
    }
    const unclosedRefFound = findScriptureReference(afterQuote);
    if (unclosedRefFound && unclosedRefFound.index <= 260) {
      const quoteText = afterQuote.slice(0, unclosedRefFound.index).trim();
      const consumedLength = quoteStart + 1 + unclosedRefFound.index + unclosedRefFound.length;
      return {
        keyVerseText: quoteText,
        keyVerseRef: unclosedRefFound.ref,
        status: "found",
        leading,
        rest: content.slice(consumedLength).trim(),
      };
    }
    return { keyVerseText: null, keyVerseRef: null, status: "ambiguous-unclosed-quote", leading: "", rest: content };
  }
  const bareFound = findScriptureReference(window);
  if (bareFound && bareFound.index <= 220) {
    const quoteText = content.slice(0, bareFound.index).trim();
    return {
      keyVerseText: quoteText,
      keyVerseRef: bareFound.ref,
      status: "found-unquoted",
      leading: "",
      rest: content.slice(bareFound.index + bareFound.length).trim(),
    };
  }
  return { keyVerseText: null, keyVerseRef: null, status: "not-found", leading: "", rest: content };
}

function stripTags(str) {
  return (str || "").replace(/<[^>]+>/g, "");
}

function stripEmptyTags(content) {
  let prev;
  let result = content;
  do {
    prev = result;
    result = result
      .replace(/<(h3|h4|p|em|strong|span|div)[^>]*>(\s|<br\s*\/?>|&nbsp;)*<\/\1>/gi, "")
      .replace(/<a(?![^>]*download)[^>]*>\s*<\/a>/gi, "");
  } while (result !== prev);
  return result;
}

function boldScriptureRefs(text) {
  const refRe = new RegExp(SCRIPTURE_REF.source, "gi");
  return text.replace(refRe, (match) => `<strong>${match}</strong>`);
}

function isEpisodeNavLink(href) {
  if (!href) return false;
  const hasEpisodePattern = /episode-\d+/i.test(href);
  const looksLikeFileDownload = /\.(pdf|docx?|xlsx?|zip|mp3|mp4)(\?|$)/i.test(href);
  return hasEpisodePattern && !looksLikeFileDownload;
}

function stripNonEpisodeLinks(html) {
  const stripped = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, inner) => {
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : null;
    if (isEpisodeNavLink(href)) return match;
    return inner;
  });
  const parensCleaned = stripped.replace(/\(\s*\.?\s*\)\.?/g, "");
  return parensCleaned.replace(/[ \t]{2,}/g, " ");
}

function convertMarkerRun(text, markerRe, matchOffset, stripMarker, tag, maxGap = 260) {
  const markers = [];
  let m;
  while ((m = markerRe.exec(text))) {
    let num = null;
    if (m[1] && /^\d+$/.test(m[1])) {
      num = parseInt(m[1], 10);
    } else if (m[1] && /^[a-z]$/.test(m[1])) {
      num = m[1].charCodeAt(0) - "a".charCodeAt(0) + 1;
    }
    markers.push({ start: m.index + matchOffset(m), end: m.index + m[0].length, num });
  }
  if (markers.length < 2) return text;

  const runs = [];
  let current = [markers[0]];
  for (let i = 1; i < markers.length; i++) {
    const withinGap = markers[i].start - markers[i - 1].start <= maxGap;
    const isSequenceReset =
      markers[i].num !== null && markers[i - 1].num !== null && markers[i].num <= markers[i - 1].num;
    if (withinGap && !isSequenceReset) {
      current.push(markers[i]);
    } else {
      if (current.length >= 2) runs.push(current);
      current = [markers[i]];
    }
  }
  if (current.length >= 2) runs.push(current);
  if (runs.length === 0) return text;

  const replacements = [];
  const runLastItemEnds = [];

  runs.forEach((run, runIndex) => {
    const firstMarker = run[0].start;
    const lastMarkerEnd = run[run.length - 1].end;
    const nextRunFirstMarker = runIndex + 1 < runs.length ? runs[runIndex + 1][0].start : text.length;
    const afterLastMarker = text.slice(lastMarkerEnd, nextRunFirstMarker);

    const blockBoundaryMatch = afterLastMarker.match(/<(blockquote|h3|h4|p)[\s>]/i);
    const searchWindow = blockBoundaryMatch
      ? afterLastMarker.slice(0, blockBoundaryMatch.index)
      : afterLastMarker;

    const blankLineMatch = searchWindow.match(/\n\s*\n/);
    const endMatch = blankLineMatch ? null : searchWindow.match(/[.!?](?=\s+[A-Z]|\s*$)/);
    const lastItemEnd = blankLineMatch
      ? lastMarkerEnd + blankLineMatch.index
      : endMatch
      ? lastMarkerEnd + endMatch.index + 1
      : blockBoundaryMatch
      ? lastMarkerEnd + blockBoundaryMatch.index
      : nextRunFirstMarker;
    runLastItemEnds.push(lastItemEnd);

    const before = text.slice(0, firstMarker);
    const isScriptureColon = (idx) => {
      const windowStart = Math.max(0, idx - 40);
      const window = text.slice(windowStart, idx);
      const refMatch = window.match(new RegExp(`${SCRIPTURE_REF.source}$`, "i"));
      return !!refMatch;
    };
    let colonIdx = before.lastIndexOf(":");
    while (colonIdx !== -1 && isScriptureColon(colonIdx)) {
      colonIdx = before.lastIndexOf(":", colonIdx - 1);
    }
    const previousRunEnd = runIndex > 0 ? runLastItemEnds[runIndex - 1] : -1;
    let introEnd =
      colonIdx !== -1 && colonIdx >= previousRunEnd && firstMarker - colonIdx < 150 ? colonIdx + 1 : firstMarker;
    const betweenIntroAndMarker = text.slice(introEnd, firstMarker);
    const closingTagMatches = [...betweenIntroAndMarker.matchAll(/<\/(blockquote|h3|h4|p)>/gi)];
    if (closingTagMatches.length > 0) {
      const lastClose = closingTagMatches[closingTagMatches.length - 1];
      introEnd = introEnd + lastClose.index + lastClose[0].length;
    }

    const listBlock = text.slice(introEnd, lastItemEnd);
    const localMarkers = run.map((mk) => mk.start - introEnd).filter((idx) => idx >= 0 && idx <= listBlock.length);

    const anchorSpans = [];
    const anchorRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
    let am;
    while ((am = anchorRe.exec(listBlock))) {
      anchorSpans.push({ start: am.index, end: am.index + am[0].length });
    }
    const wouldTearAnchor = localMarkers.some((idx) => anchorSpans.some((span) => idx > span.start && idx < span.end));
    if (wouldTearAnchor) {
      return;
    }

    const BLOCK_TAG_RE = /<(blockquote|h3|h4|p)[\s>]/i;
    const segments = [];
    let currentItems = [];
    for (let i = 0; i < localMarkers.length; i++) {
      const start = localMarkers[i];
      const end = i + 1 < localMarkers.length ? localMarkers[i + 1] : listBlock.length;
      const rawSpan = listBlock.slice(start, end);
      const blockMatch = i < localMarkers.length - 1 ? rawSpan.match(BLOCK_TAG_RE) : null;

      if (!blockMatch) {
        const cleaned = stripMarker(rawSpan.trim()).trim();
        if (cleaned) currentItems.push(cleaned);
        continue;
      }

      const itemTextRaw = rawSpan.slice(0, blockMatch.index).trim();
      const itemCleaned = stripMarker(itemTextRaw).trim();
      if (itemCleaned) currentItems.push(itemCleaned);

      if (currentItems.length >= 2) {
        segments.push({ type: "list", items: currentItems });
      } else if (currentItems.length === 1) {
        segments.push({ type: "raw", html: currentItems[0] });
      }
      currentItems = [];

      const closeTagRe = new RegExp(`</${blockMatch[1]}>`, "i");
      const afterBlockStart = rawSpan.slice(blockMatch.index);
      const closeMatch = afterBlockStart.match(closeTagRe);
      const blockHtml = closeMatch
        ? afterBlockStart.slice(0, closeMatch.index + closeMatch[0].length)
        : afterBlockStart;
      segments.push({ type: "raw", html: blockHtml.trim() });

      const trailing = closeMatch ? afterBlockStart.slice(closeMatch.index + closeMatch[0].length).trim() : "";
      if (trailing) segments.push({ type: "raw", html: trailing });
    }
    if (currentItems.length >= 2) {
      segments.push({ type: "list", items: currentItems });
    } else if (currentItems.length === 1) {
      segments.push({ type: "raw", html: currentItems[0] });
    }

    if (segments.length === 1 && segments[0].type === "list") {
      const listHtml = `<${tag}>${segments[0].items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`;
      replacements.push({ start: introEnd, end: lastItemEnd, html: listHtml });
      return;
    }

    const hasRealList = segments.some((s) => s.type === "list");
    if (!hasRealList) return;

    const combinedHtml = segments
      .map((s) => (s.type === "list" ? `<${tag}>${s.items.map((i) => `<li>${i}</li>`).join("")}</${tag}>` : s.html))
      .join("");
    replacements.push({ start: introEnd, end: lastItemEnd, html: combinedHtml });
  });

  if (replacements.length === 0) return text;

  replacements.sort((a, b) => a.start - b.start);
  const safeReplacements = [];
  let lastEnd = -1;
  replacements.forEach((r) => {
    if (r.start < lastEnd) return;
    safeReplacements.push(r);
    lastEnd = r.end;
  });

  let result = text;
  safeReplacements
    .slice()
    .reverse()
    .forEach(({ start, end, html }) => {
      result = result.slice(0, start) + " " + html + result.slice(end);
    });
  return result;
}

function convertDashLists(text) {
  const listedDash = convertMarkerRun(
    text,
    /(\S)([\u2013\u2014-])(?=\s)/g,
    (m) => m[1].length,
    (raw) => raw.replace(/^[\u2013\u2014-]\s*/, ""),
    "ul"
  );
  const listedLineDash = convertMarkerRun(
    listedDash,
    /(^|\n|>)\s*[\u2013\u2014-]\s+(?=[A-Z])/g,
    (m) => m[1].length,
    (raw) => raw.replace(/^[\u2013\u2014-]\s*/, ""),
    "ul",
    2000
  );
  const listedNumeric = convertMarkerRun(
    listedLineDash,
    /\b(\d{1,2})\.\s+(?=[A-Z<])/g,
    () => 0,
    (raw) => raw.replace(/^\d{1,2}\.\s*/, ""),
    "ol",
    1200
  );
  const listedLettered = convertMarkerRun(
    listedNumeric,
    /(?<![a-z]\.)\b([a-f])\.\s+(?=[A-Z<])(?![a-z]\.\s)/g,
    () => 0,
    (raw) => raw.replace(/^[a-f]\.\s*/, ""),
    "ol",
    400
  );
  return listedLettered;
}

function splitBlocks(html) {
  return html
    .split(/(<blockquote[\s\S]*?<\/blockquote>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<h3[\s\S]*?<\/h3>|<h4[\s\S]*?<\/h4>|<p[\s\S]*?<\/p>)/gi)
    .filter((part) => part.trim().length);
}

const CLOSING_WORDS_RE = /^(Shalom|Hallelujah|Selah|Glory to God|Oh Hallelujah)[.!?\s]*$/i;

function isAllCapsSentence(text) {
  const stripped = text.replace(/<[^>]+>/g, "");
  const core = stripped.replace(/[^A-Za-z]/g, "");
  return core.length >= 3 && core === core.toUpperCase();
}

function isLinkSentence(text) {
  return /<a[\s>]/i.test(text);
}

function isClosingWordSentence(text) {
  const stripped = text.replace(/<[^>]+>/g, "").trim();
  return CLOSING_WORDS_RE.test(stripped);
}

function findScriptureQuoteSpans(text) {
  const spans = [];
  const openRe = /["'\u2018\u201c\u201d]/g;
  let m;
  let searchFrom = 0;
  while ((m = openRe.exec(text))) {
    if (m.index < searchFrom) continue;
    const precedingChar = text[m.index - 1];
    if (precedingChar && /[A-Za-z]/.test(precedingChar)) continue;
    const openIdx = m.index;
    const closeRe = /["'\u2018\u201c\u201d]/g;
    closeRe.lastIndex = openIdx + 1;
    let closeMatch;
    let found = null;
    let usedCloseIdx = -1;
    while ((closeMatch = closeRe.exec(text))) {
      if (closeMatch.index - openIdx > 1500) break;
      const candidate = text.slice(closeMatch.index + 1, closeMatch.index + 1 + 60).match(new RegExp(SCRIPTURE_REF.source, "i"));
      if (candidate && candidate.index <= 40) {
        found = candidate;
        usedCloseIdx = closeMatch.index;
        break;
      }
    }
    if (found) {
      const refStart = usedCloseIdx + 1 + found.index;
      const refEnd = refStart + found[0].length;
      spans.push({ start: openIdx, end: refEnd });
      searchFrom = refEnd;
      openRe.lastIndex = refEnd;
    }
  }
  return spans;
}

function groupSentenceChunks(text) {
  const PERIOD_MASK = "\u0001";
  const textWithMaskedAnchorPeriods = text.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchorTag) =>
    anchorTag.replace(/\./g, PERIOD_MASK)
  );
  const textWithMaskedMarkerPeriods = textWithMaskedAnchorPeriods
    .replace(/(^|[\s>])(\d{1,2})\.(\s+[A-Z])/g, (m, pre, num, post) => `${pre}${num}${PERIOD_MASK}${post}`)
    .replace(/(^|[\s>])([a-f])\.(\s+[A-Z])/g, (m, pre, letter, post) => `${pre}${letter}${PERIOD_MASK}${post}`);

  const spans = findScriptureQuoteSpans(textWithMaskedMarkerPeriods);
  const MARKER_LEADIN_RE = new RegExp(`(?:^|[\\s>])(?:\\d{1,2}|[a-f])${PERIOD_MASK}\\s+[A-Za-z][A-Za-z\\s]{0,30}$`);
  spans.forEach((span) => {
    const before = textWithMaskedMarkerPeriods.slice(0, span.start);
    const leadInMatch = before.match(MARKER_LEADIN_RE);
    if (leadInMatch) {
      const leadInStart = before.length - leadInMatch[0].length + (leadInMatch[0].match(/^[\s>]/) ? 1 : 0);
      span.start = leadInStart;
    }
  });

  const protectedUnits = [];
  let working = textWithMaskedMarkerPeriods;
  let offset = 0;
  spans.forEach((span, i) => {
    const adjStart = span.start - offset;
    const adjEnd = span.end - offset;
    const unit = working.slice(adjStart, adjEnd);
    protectedUnits.push(unit);
    const token = `@@SCRIPT${i}@@`;
    working = working.slice(0, adjStart) + token + working.slice(adjEnd);
    offset += (adjEnd - adjStart) - token.length;
  });

  const sentences = working
    .split(
      /(?<=[.!?:])\s+(?=[A-Z"\u201c(@]|<(?!\/))|(?<=@@SCRIPT\d+@@)\s*(?=[A-Za-z"\u201c\u2018])|(?<=[a-zA-Z:])\s*(?=@@SCRIPT\d+@@)/
    )
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = [];
  let current = [];
  let fullstopCount = 0;
  const flush = () => {
    if (current.length) {
      chunks.push(current.join(" "));
      current = [];
      fullstopCount = 0;
    }
  };
  const restoreTokens = (s) =>
    s.replace(/@@SCRIPT(\d+)@@/g, (_, i) => protectedUnits[Number(i)]).replace(new RegExp(PERIOD_MASK, "g"), ".");

  sentences.forEach((rawSentence) => {
    if (!rawSentence) return;
    const sentence = restoreTokens(rawSentence);
    const isProtectedUnit = /@@SCRIPT\d+@@/.test(rawSentence);
    if (isLinkSentence(sentence) || isAllCapsSentence(sentence) || isClosingWordSentence(sentence)) {
      flush();
      chunks.push(sentence);
      return;
    }
    const endsInQuestion = /\?\s*$/.test(sentence);
    if (endsInQuestion && !isProtectedUnit) {
      current.push(sentence);
      flush();
      return;
    }
    const periodsHere = (sentence.match(/\./g) || []).length;
    if (current.length > 0 && fullstopCount + periodsHere > 3) {
      flush();
    }
    current.push(sentence);
    fullstopCount += periodsHere;
    if (fullstopCount > 3) {
      flush();
    }
  });
  flush();
  return chunks;
}

function splitAdjacentAnchorChunks(chunks) {
  const result = [];
  chunks.forEach((chunk) => {
    const pieces = chunk.split(/(?<=<\/a>)\s*(?=<a\b)/gi).map((p) => p.trim()).filter(Boolean);
    pieces.forEach((p) => result.push(p));
  });
  return result;
}

function paragraphizeText(text) {
  return splitAdjacentAnchorChunks(groupSentenceChunks(text)).map((chunk) => `<p>${chunk}</p>`);
}

function breakSentencesForList(text) {
  return groupSentenceChunks(text).join("<br/><br/>");
}

function breakLongListItems(listHtml) {
  return listHtml.replace(/<li>([\s\S]*?)<\/li>/gi, (match, inner) => {
    const plainLength = inner.replace(/<[^>]+>/g, "").length;
    if (plainLength < 200) return match;
    return `<li>${breakSentencesForList(inner)}</li>`;
  });
}

function paragraphize(bodyHtml) {
  const parts = splitBlocks(bodyHtml);
  const htmlParts = [];
  parts.forEach((part) => {
    const trimmed = part.trim();
    if (/^<(ol|ul)/i.test(trimmed)) {
      htmlParts.push(breakLongListItems(trimmed));
      return;
    }
    if (/^<(blockquote|h3|h4)/i.test(trimmed)) {
      htmlParts.push(trimmed);
      return;
    }
    if (/^<p/i.test(trimmed)) {
      const text = trimmed.replace(/^<p[^>]*>/i, "").replace(/<\/p>$/i, "");
      htmlParts.push(...paragraphizeText(text));
      return;
    }
    htmlParts.push(...paragraphizeText(trimmed));
  });
  return htmlParts.join("");
}

function formatDevotionalBody(mainContent) {
  if (!mainContent) return "";
  let content = stripNonEpisodeLinks(mainContent);
  content = stripEmptyTags(content);
  const listed = convertDashLists(content);
  const bolded = boldScriptureRefs(listed);
  return paragraphize(bolded);
}

// Captures the web-only banner card data. Must run on the ORIGINAL
// html, before stripPreamble removes the "Download PDF" text it needs.
function extractBannerInfo(html) {
  const downloadMatch = html.match(/Download\s*PDF/i);
  const hasBanner = !!downloadMatch;
  let authorMessage = null;

  if (hasBanner) {
    let afterDownload = html.slice(downloadMatch.index + downloadMatch[0].length);
    afterDownload = afterDownload.replace(/^\s*<\/a>/i, "");

    const authorIdx = afterDownload.search(/Apostle Bennie/i);
    const quoteRaw = authorIdx === -1 ? afterDownload : afterDownload.slice(0, authorIdx);

    authorMessage = quoteRaw.replace(/\s+/g, " ").trim() || null;
  }

  return { hasBanner, authorMessage };
}

// Strips the preamble and finds the opening memory verse. titleText is
// always null now -- the UI renders the title from Supabase's `title`
// column instead, so it's never used.
function extractBannerTitleAndVerse(html) {
  const { hasBanner, authorMessage } = extractBannerInfo(html);

  const stripped = stripPreamble(html, {});
  const verse = extractOpeningScripture(stripped.content);
  const hasKeyVerse = verse.status === "found" || verse.status === "found-unquoted";
  const memoryVerse = hasKeyVerse ? { text: verse.keyVerseText, citation: verse.keyVerseRef } : null;

  // Text before the verse's opening quote ("leading") is still real
  // body content -- prepend it so nothing gets dropped.
  const bodyContent = hasKeyVerse
    ? verse.leading
      ? `${verse.leading} ${verse.rest}`.trim()
      : verse.rest
    : stripped.content;

  return {
    authorMessage,
    hasBanner,
    titleText: null,
    memoryVerse,
    content: bodyContent,
  };
}

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

  // Separator is "-" or an en/em-dash, but only when followed by a
  // space + capital letter -- distinguishes a real separator from a
  // mid-word hyphen like "self-control", which has no space after it.
  const rawParts = declarationsText
    .split(/\s*[\u2013\u2014-]\s+(?=[A-Z])/)
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

  const formattedMainContent = formatDevotionalBody(mainContent);

  return {
    authorMessage,
    hasBanner,
    titleText,
    memoryVerse,
    mainContent: formattedMainContent,
    deepDiver,
    prayer,
    bibleReading,
    declarations,
  };
}
