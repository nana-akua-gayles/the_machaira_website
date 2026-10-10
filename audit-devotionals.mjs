#!/usr/bin/env node
// Audits every devotional through parseDevotionalContent and reports what is still messy.
//
// Setup:   npm i -D jsdom
// Data:    node fetch-devotionals.mjs      (creates devotionals.json)
// Run:     node audit-devotionals.mjs --input devotionals.json \
//            --parser src/pages/devotional/devotionalFeatures/parseDevotionalContent.js
// Output:  audit-output/report.json and audit-output/report.csv (+ console summary)

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const input = flag("input", "devotionals.json");
const parserPath = path.resolve(
  flag("parser", "src/pages/devotional/devotionalFeatures/parseDevotionalContent.js")
);
const outDir = flag("out", "audit-output");

// DOMPurify needs a DOM; give it one BEFORE the parser is imported.
globalThis.window = new JSDOM("").window;
const { parseDevotionalContent } = await import(pathToFileURL(parserPath).href);

let rows = JSON.parse(fs.readFileSync(input, "utf8"));
if (!Array.isArray(rows)) rows = rows.data || rows.rows || [];

// ---------- helpers ----------
const stripTags = (s) => (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const alnumLen = (s) => (s || "").replace(/&[#\w]+;/g, "").replace(/[^\p{L}\p{N}]/gu, "").length;
const snip = (s, i, n = 90) => s.slice(Math.max(0, i - 30), i + n).replace(/\s+/g, " ");
const before = rows.length; 
rows = rows.filter((r) => /episode/i.test(r.title || "") && stripTags(r.content).length > 300); 
console.log(`Skipping ${before - rows.length} non-episode or very short rows.`);


const HTML_RULES = [
  ["empty-paragraph", "warn", /<p>\s*<\/p>/],
  ["wp-comment-left", "warn", /<!--/],
  ["br-run", "warn", /(<br\s*\/?>\s*){3,}/],
  ["href-has-space", "error", /href="[^"]*\s[^"]*"/],
  ["nested-strong", "warn", /<strong>(?:(?!<\/strong>)[\s\S])*<strong>/],
  ["inline-style-left", "warn", /\sstyle=/],
];

const TEXT_RULES = [
  ["entity-left", "error", /&#?\w+;/],
  // Real shortcodes only: [/button] or [button text="..."]. Plain [brackets] in Bible quotes are fine.
  ["shortcode-left", "error", /\[\/[a-z][\w-]*\]|\[[a-z][\w-]*\s+[\w-]+=/i],
  ["section-header-leaked", "error", /DIG DEEPER|WE PRAY|BIBLE READING|DECLARE THESE WORDS/],
  ["plain-url-left", "warn", /https?:\/\/\S+/],
  ["glued-words", "warn", /\b[a-z]{2,}[A-Z][a-z]+/],
  ["missing-sentence-space", "warn", /[a-z][.!?][A-Z]/],
  ["unconverted-number-marker", "warn", /(^|\s)\d{1,2}\.\s+[A-Z]/],
  ["double-space", "warn", / {2,}/],
];

const TAGS = ["p", "ul", "ol", "li", "strong", "em", "blockquote", "h3", "h4"];

function auditRow(row) {
  const issues = [];
  const add = (code, severity, sample = "") => issues.push({ code, severity, sample });
  const raw = row.content || "";

  let parsed;
  try {
    // Pass the DB title: the parser uses it to find and strip the title in the header.
    parsed = parseDevotionalContent(raw, { title: row.title });
  } catch (e) {
    add("parse-crash", "error", String(e.message));
    return issues;
  }
  if (!parsed) {
    add("empty-content", "error");
    return issues;
  }

  // structure: did the header / sections get extracted?
  if (!parsed.hasBanner) add("no-banner", "info");
  if (!parsed.titleText) add("no-title-extracted", "warn");
  // Older episodes legitimately have no memory verse, so this is informational only.
  if (!parsed.memoryVerse) add("no-memory-verse", "info");
  else if (!parsed.memoryVerse.citation) add("no-verse-citation", "warn", parsed.memoryVerse.text?.slice(0, 80));
  if (parsed.deepDiver === null) {
    add("sections-not-matched", "error", "DIG DEEPER/WE PRAY/BIBLE READING/DECLARE block not found");
  } else {
    if (!parsed.prayer) add("no-prayer", "warn");
    if (!parsed.declarations?.length) add("no-declarations", "warn");
    if (!parsed.bibleReading?.oneYear && !parsed.bibleReading?.twoYear) add("no-bible-plans", "warn");
  }

  const main = parsed.mainContent || "";
  if (alnumLen(stripTags(main)) < 200) add("main-content-tiny", "error", stripTags(main).slice(0, 80));

  // HTML-level checks
  for (const [code, sev, re] of HTML_RULES) {
    const m = main.match(re);
    if (m) add(code, sev, snip(main, m.index));
  }

  const text = main 
  .replace(/<h4>[\s\S]*?<\/h4>/g, "\n") .replace(/<br\s*\/?>/gi, "\n") 
    .replace(/<\/(p|li|h3|h4|blockquote)>/gi, "\n") .replace(/<[^>]+>/g, "");


  const open = (t) => (main.match(new RegExp(`<${t}[\\s>]`, "gi")) || []).length;
  const close = (t) => (main.match(new RegExp(`</${t}>`, "gi")) || []).length;
  TAGS.forEach((t) => {
    if (open(t) !== close(t)) add("unbalanced-tag", "error", `<${t}> opens=${open(t)} closes=${close(t)}`);
  });

  // paragraph + list shape
  for (const m of main.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const len = stripTags(m[1]).length;
    if (len > 1500) add("very-long-paragraph", "warn", `${len} chars: ${stripTags(m[1]).slice(0, 70)}…`);
    if (len > 0 && len < 4) add("tiny-paragraph", "warn", stripTags(m[1]));
  }
  for (const m of main.matchAll(/<(ul|ol)>([\s\S]*?)<\/\1>/g)) {
    const items = (m[2].match(/<li>/g) || []).length;
    if (items < 2) add("single-item-list", "warn", stripTags(m[2]).slice(0, 70));
  }

  // did the parser drop text? compare raw vs everything it returned
  const pieces = [
    parsed.authorMessage,
    parsed.titleText,
    parsed.memoryVerse?.text,
    parsed.memoryVerse?.citation,
    main,
    ...(parsed.deepDiver || []),
    parsed.prayer,
    parsed.bibleReading?.oneYear,
    parsed.bibleReading?.twoYear,
    ...(parsed.declarations || []),
    parsed.closing,
  ]
    .map(stripTags)
    .join(" ");
  const ratio = alnumLen(pieces) / Math.max(1, alnumLen(stripTags(raw)));
  if (ratio < 0.8) add("possible-content-loss", "error", `output keeps ${(ratio * 100).toFixed(0)}% of source text`);

  return issues;
}

// ---------- run ----------
const report = rows.map((row) => ({
  id: row.id,
  title: (row.title || "").slice(0, 80),
  date: (row.created_at || "").split("T")[0],
  issues: auditRow(row),
}));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = ["id,date,title,severity,issue,sample"];
report.forEach((r) =>
  r.issues.forEach((i) => csv.push([r.id, r.date, r.title, i.severity, i.code, i.sample].map(esc).join(",")))
);
fs.writeFileSync(path.join(outDir, "report.csv"), csv.join("\n"));

// ---------- console summary ----------
const counts = {};
report.forEach((r) => {
  new Set(r.issues.map((i) => `${i.severity.padEnd(5)} ${i.code}`)).forEach((k) => (counts[k] = (counts[k] || 0) + 1));
});
console.log(`\nAudited ${report.length} devotionals. Devotionals affected per issue:\n`);
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, n]) => console.log(String(n).padStart(5), " ", k));

console.log("\nWorst 15 devotionals (errors weighted x3):\n");
report
  .map((r) => ({
    ...r,
    score: r.issues.reduce((s, i) => s + (i.severity === "error" ? 3 : i.severity === "warn" ? 1 : 0), 0),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 15)
  .forEach((r) => console.log(String(r.score).padStart(4), " ", r.id, r.date, r.title));

console.log(`\nFull detail: ${path.join(outDir, "report.csv")}\n`);
