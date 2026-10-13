// Downloads ALL devotionals from Supabase into devotionals.json (pages past the 1000-row limit).
// Run from your project folder:  node fetch-devotionals.mjs
// Optional flags: --table devotionals   --url https://xxx.supabase.co   --key <anon key>

import fs from "node:fs";

try { process.loadEnvFile(".env"); } catch {}

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i === -1 ? d : args[i + 1]; };

const url = flag("url", process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
const key = flag("key", process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
const table = flag("table", "devotionals");

if (!url || !key) {
  console.error("Missing Supabase URL or key. Check your .env names, or pass --url and --key.");
  process.exit(1);
}

const PAGE = 500;
const all = [];

for (let from = 0; ; from += PAGE) {
  const res = await fetch(
    `${url}/rest/v1/${table}?select=id,title,content,created_at&order=created_at.asc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + PAGE - 1}` } }
  );
  if (!res.ok) {
    console.error(`Request failed (${res.status}):`, await res.text());
    process.exit(1);
  }
  const rows = await res.json();
  all.push(...rows);
  console.log(`Fetched ${all.length} so far...`);
  if (rows.length < PAGE) break;
}

fs.writeFileSync("devotionals.json", JSON.stringify(all));
console.log(`Done. Saved ${all.length} devotionals to devotionals.json`);
