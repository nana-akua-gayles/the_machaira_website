#!/usr/bin/env node
// Looks closely at individual episodes: the raw ending, what the parser got out
// of the footer, and which pieces of text were lost.
//
// Run:  node inspect-episode.mjs 20074 24169 35229 39962
// Needs devotionals.json (from fetch-devotionals.mjs) and jsdom.
// Output is printed AND saved to audit-output/inspect.txt so you can copy it.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const ids = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const input = flag("input", "devotionals.json");
const parserPath = path.resolve(
  flag("parser", "src/pages/devotional/devotionalFeatures/parseDevotionalContent.js")
);

globalThis.window = new JSDOM("").window;
const { parseDevotionalContent } = await import(pathToFileURL(parserPath).href);

let rows = JSON.parse(fs.readFileSync(input, "utf8"));
if (!Array.isArray(rows)) rows = rows.data || rows.rows || [];

const stripTags = (s) => (s || "").replace(/<[^>]+>/g, " ");
const decode = (s) =>
  (s || "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#\d+;/g, " ");
const lettersOnly = (s) => (s || "").toLowerCase().replace(/[^\p{L}]/gu, "");

const out = [];
const log = (s = "") => out.push(s);

for (const id of ids) {
  const row = rows.find((r) => String(r.id) === String(id));
  if (!row) {
    log(`\n##### ${id}: not found in ${input}`);
    continue;
  }
  const raw = row.content || "";
  const parsed = parseDevotionalContent(raw, { title: row.title });
  log(`\n##### ${row.id}  ${row.title}`);
  log(`raw length: ${raw.length}`);

  log(`\n--- RAW START (first 700 chars) ---`);
  log(raw.slice(0, 700).replace(/\s+/g, " "));

  log(`\n--- RAW ENDING (last 900 chars) ---`);
  log(raw.slice(-900).replace(/\s+/g, " "));

  if (parsed) {
    log(`\n--- WHAT THE PARSER GOT FROM THE FOOTER ---`);
    log(`deepDiver:    ${JSON.stringify(parsed.deepDiver)}`);
    log(`prayer:       ${JSON.stringify(parsed.prayer)}`);
    log(`bibleReading: ${JSON.stringify(parsed.bibleReading)}`);
    log(`declarations: ${(parsed.declarations || []).length} item(s) ${JSON.stringify((parsed.declarations || []).slice(0, 2))}`);
    log(`closing:      ${JSON.stringify(parsed.closing)}`);

    // Which raw text is missing from the output?
    const outText = lettersOnly(
      [
        parsed.authorMessage, parsed.titleText, parsed.memoryVerse?.text, parsed.memoryVerse?.citation,
        stripTags(parsed.mainContent), ...(parsed.deepDiver || []), parsed.prayer,
        parsed.bibleReading?.oneYear, parsed.bibleReading?.twoYear,
        ...(parsed.declarations || []), parsed.closing,
      ].join(" ")
    );
    const words = decode(stripTags(raw)).split(/\s+/).filter((w) => /\p{L}/u.test(w));
    const WIN = 8;
    const missing = [];
    for (let i = 0; i < words.length; i += WIN) {
      const chunk = words.slice(i, i + WIN);
      if (!outText.includes(lettersOnly(chunk.join(" ")))) missing.push({ i, chunk });
    }
    log(`\n--- TEXT IN THE SOURCE BUT NOT IN THE OUTPUT (${missing.length} piece(s) of ~${WIN} words) ---`);
    let last = -99;
    let run = [];
    const flush = () => run.length && log(`  • ${run.join(" ").slice(0, 260)}`);
    for (const m of missing) {
      if (m.i - last > WIN) {
        flush();
        run = [];
      }
      run.push(...m.chunk);
      last = m.i;
    }
    flush();
  }
}

const text = out.join("\n");
fs.mkdirSync("audit-output", { recursive: true });
fs.writeFileSync("audit-output/inspect.txt", text);
console.log(text);
console.log("\n(Saved to audit-output/inspect.txt)");
