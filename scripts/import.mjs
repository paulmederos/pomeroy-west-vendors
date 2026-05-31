#!/usr/bin/env node
// Pull the latest vendor rows from Mark's Google Sheet, clean them, and write
// src/data/vendors.json (the file the site builds from).
//
//   npm run import
//
// The Sheet's "Vendors" tab is published as CSV at the URL below. Only the
// vendor rows are fetched; the code -> label maps live in src/data/labels.mjs.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CATEGORIES, SERVICES } from '../src/data/labels.mjs';

const SHEET_ID = '1LJeAnmMOa2Fbe5CxtGjL9TYqD30yoCzHZIELpDmr8iY';
const GID = '1918318028'; // the "Vendors" tab
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'vendors.json');

// --- tiny CSV parser (handles quotes, embedded commas + newlines) ----------
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// --- cleaning helpers ------------------------------------------------------
// Strip invisible Unicode direction/format marks that pollute the phone cells.
const stripFormatChars = (s) =>
  (s || '').replace(/[‎‏‪-‮⁦-⁩]/g, '').trim();

const cleanPhone = (s) => stripFormatChars(s).replace(/\s+/g, ' ').trim();
const telHref = (s) => {
  const digits = stripFormatChars(s).replace(/[^\d+]/g, '');
  return digits.length >= 10 ? digits : null;
};

// Scrub homeowner names that slipped into the data (privacy). Removes
// parentheticals like "(per Diane Ohearn as of ...)" and "per <Name>" asides.
const scrubPII = (s) =>
  (s || '')
    .replace(/\(?\bper\s+[A-Z][a-z]+\s+[A-Z][a-z]+[^)]*\)?/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

// Treat a bare domain as a URL; reject anything that isn't really a link
// (notes, phone numbers, etc. sometimes land in the Website columns).
function classifyLink(raw) {
  let s = stripFormatChars(raw);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) {
    if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s)) s = 'https://' + s;
    else return null; // not a URL
  }
  let host = '';
  try { host = new URL(s).hostname.replace(/^www\./, ''); } catch { return null; }
  let label = 'Website';
  if (host.includes('yelp.com')) label = 'Yelp';
  else if (host.includes('checkbook.org')) label = 'Checkbook';
  else label = host;
  return { url: s, label };
}

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Decide whether a comment reads as a recommendation vs. an operational note.
const REVIEW_RE = /(recommend|highly|great|detailed|satisfaction|love|excellent|wonderful)/i;

// --- main ------------------------------------------------------------------
const res = await fetch(CSV_URL, { redirect: 'follow' });
if (!res.ok) {
  console.error(`Failed to fetch Sheet CSV (${res.status}). Is it link-shareable?`);
  process.exit(1);
}
const rows = parseCSV(await res.text());
const header = rows.shift().map((h) => h.trim());
const col = (name) => header.findIndex((h) => h.toLowerCase().startsWith(name.toLowerCase()));
const idx = {
  name: col('Name'), type: col('Type'), services: col('Services'),
  email: col('Email'), phone: col('Phone'),
  w1: col('Website 1'), w2: col('Website 2'), comments: col('Comments'),
};

const unknownCodes = new Set();
const byKey = new Map();

for (const r of rows) {
  const rawName = (r[idx.name] || '').trim();
  if (!rawName) continue;

  // "Business/Contact Person" -> name + contact
  const [namePart, ...rest] = rawName.split('/');
  const name = namePart.trim();
  const contact = rest.join('/').trim() || null;

  const typeCode = (r[idx.type] || '').trim().toUpperCase();
  const serviceCodes = (r[idx.services] || '')
    .split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

  const phone = cleanPhone(r[idx.phone]);
  const email = stripFormatChars(r[idx.email]).toLowerCase() || null;
  const links = [r[idx.w1], r[idx.w2]].map(classifyLink).filter(Boolean);

  const comment = scrubPII(r[idx.comments]);
  const review = comment && REVIEW_RE.test(comment) ? comment : null;
  const note = comment && !review ? comment : null;

  const key = rawName.toLowerCase().trim();
  if (!byKey.has(key)) {
    byKey.set(key, {
      slug: '', name, contact,
      categories: [], services: [],
      phones: [], emails: [], links: [],
      reviews: [], notes: [],
    });
  }
  const v = byKey.get(key);
  if (typeCode) {
    if (!CATEGORIES[typeCode]) unknownCodes.add(typeCode);
    if (!v.categories.includes(typeCode)) v.categories.push(typeCode);
  }
  for (const c of serviceCodes) {
    if (!SERVICES[c]) unknownCodes.add(c);
    if (!v.services.includes(c)) v.services.push(c);
  }
  if (phone && !v.phones.some((p) => telHref(p) === telHref(phone))) v.phones.push(phone);
  if (email && !v.emails.includes(email)) v.emails.push(email);
  for (const l of links) if (!v.links.some((x) => x.url === l.url)) v.links.push(l);
  if (review && !v.reviews.includes(review)) v.reviews.push(review);
  if (note && !v.notes.includes(note)) v.notes.push(note);
  if (contact && !v.contact) v.contact = contact;
}

// Resolve labels + slugs, build final shape.
const usedSlugs = new Set();
const vendors = [...byKey.values()]
  .map((v) => {
    let slug = slugify(v.name);
    while (usedSlugs.has(slug)) slug += '-2';
    usedSlugs.add(slug);
    return {
      ...v,
      slug,
      categories: v.categories.map((c) => ({
        code: c, label: CATEGORIES[c]?.label || c, icon: CATEGORIES[c]?.icon || '🔧',
      })),
      services: v.services.map((c) => ({ code: c, label: SERVICES[c] || c })),
      phones: v.phones.map((p) => ({ display: p, href: telHref(p) })),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Category counts for the index.
const catCounts = {};
for (const v of vendors)
  for (const c of v.categories) catCounts[c.code] = (catCounts[c.code] || 0) + 1;

const payload = { generatedAt: new Date().toISOString(), count: vendors.length, catCounts, vendors };
writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');

console.log(`✓ Wrote ${vendors.length} vendors to src/data/vendors.json`);
if (unknownCodes.size)
  console.warn(`⚠ Unknown codes (add to labels.mjs): ${[...unknownCodes].join(', ')}`);
