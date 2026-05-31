// Loads the hand-maintained vendor list (src/data/vendors.json) and shapes it
// for the pages: derives phone links, website/Yelp buttons, a fallback logo,
// review counts, category icons, and the default sort.
//
// vendors.json is the SINGLE source of truth — edit it directly (see CONTRIBUTING.md).
// There is no build/import step that overwrites it.

import vendors from '../data/vendors.json';
import { iconFor, orderFor, iconForService, CATEGORIES } from '../data/categories.mjs';

const telHref = (s) => {
  const d = String(s).replace(/[^\d+]/g, '');
  return d.length >= 10 ? d : null;
};

const labelFor = (url) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('yelp.com')) return 'Yelp';
    if (host.includes('checkbook.org')) return 'Checkbook';
    return host;
  } catch { return 'Website'; }
};

function shape(v) {
  const links = [
    ...(v.websites || []).map((url) => ({ url, label: labelFor(url) })),
    ...(v.yelp ? [{ url: v.yelp, label: 'Yelp' }] : []),
  ];
  const reviews = v.reviews || [];
  // Most recent review month ('YYYY-MM'), '' if none. Lexical compare = chronological.
  const lastReviewed = reviews.reduce((m, r) => (r.date && r.date > m ? r.date : m), '');
  const phones = (v.phones || []).map((display) => ({ display, href: telHref(display) }));
  return {
    slug: v.slug,
    name: v.name,
    contact: v.contact || null,
    categories: (v.categories || []).map((label) => ({ label, icon: iconFor(label) })),
    services: (v.services || []).map((label) => ({ label, icon: iconForService(label) })),
    phones,
    smsHref: phones.find((p) => p.href)?.href || null, // first callable number, also textable
    emails: v.emails || [],
    links,
    logo: v.logo || null, // locally-stored, hand-vetted logos only (see public/logos/)
    reviews,
    reviewCount: reviews.length,
    lastReviewed,
    lastReviewedYear: lastReviewed ? lastReviewed.slice(0, 4) : null,
    notes: v.notes || [],
  };
}

// Recency-biased: most-recently-recommended first, then by review count, then A–Z.
// Vendors with no reviews (lastReviewed '') naturally sort last.
export const allVendors = vendors
  .map(shape)
  .sort((a, b) =>
    b.lastReviewed.localeCompare(a.lastReviewed) ||
    b.reviewCount - a.reviewCount ||
    a.name.localeCompare(b.name));

// Category chips: only categories in use, ordered by categories.mjs then count.
const counts = {};
for (const v of allVendors)
  for (const c of v.categories) counts[c.label] = (counts[c.label] || 0) + 1;

export const categoryChips = Object.keys(counts)
  .sort((a, b) => orderFor(a) - orderFor(b) || a.localeCompare(b))
  .map((label) => ({ label, icon: CATEGORIES[label]?.icon || '🔧', count: counts[label] }));

export const vendorCount = allVendors.length;
