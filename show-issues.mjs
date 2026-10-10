// Prints the remaining problems from audit-output/report.json in a readable form.
// Run:  node show-issues.mjs
// Also saves the same text to audit-output/issues.txt so you can open and copy it.
import fs from "node:fs";

const report = JSON.parse(fs.readFileSync("audit-output/report.json", "utf8"));
const out = [];
const log = (s = "") => out.push(s);

const show = (title, codes, limit) => {
  log(`\n=== ${title} ===`);
  let n = 0;
  for (const r of report) {
    const hits = r.issues.filter((i) => codes.includes(i.code));
    if (!hits.length) continue;
    if (n++ >= limit) break;
    log(`\n${r.id}  ${r.title}`);
    hits.forEach((h) => log(`   ${h.code}: ${h.sample}`));
  }
  if (n === 0) log("(none)");
};

show("Errors: broken links / lost content", ["href-has-space", "possible-content-loss"], 9);
show("Footer problems (prayer / bible plans / declarations)", ["no-prayer", "no-bible-plans", "no-declarations"], 10);
show("Tiny paragraphs", ["tiny-paragraph"], 5);

const text = out.join("\n");
fs.writeFileSync("audit-output/issues.txt", text);
console.log(text);
console.log("\n(Saved to audit-output/issues.txt)");
