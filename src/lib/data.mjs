// Loads the hand-maintained vendor list (src/data/vendors.json) and shapes it
// for the pages: derives phone links, website/Yelp buttons, a fallback logo,
// review counts, category icons, and the default sort.
//
// vendors.json is the SINGLE source of truth — edit it directly (see CONTRIBUTING.md).
// There is no build/import step that overwrites it.

import vendors from '../data/vendors.json';
import { iconFor, orderFor, CATEGORIES } from '../data/categories.mjs';

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

const faviconFor = (websites = []) => {
  const site = websites[0];
  if (!site) return null;
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(site).hostname}&sz=128`;
  } catch { return null; }
};

function shape(v) {
  const links = [
    ...(v.websites || []).map((url) => ({ url, label: labelFor(url) })),
    ...(v.yelp ? [{ url: v.yelp, label: 'Yelp' }] : []),
  ];
  const reviews = v.reviews || [];
  return {
    slug: v.slug,
    name: v.name,
    contact: v.contact || null,
    categories: (v.categories || []).map((label) => ({ label, icon: iconFor(label) })),
    services: v.services || [],
    phones: (v.phones || []).map((display) => ({ display, href: telHref(display) })),
    emails: v.emails || [],
    links,
    logo: v.logo || faviconFor(v.websites),
    reviews,
    reviewCount: reviews.length,
    notes: v.notes || [],
  };
}

// Most-reviewed first, then alphabetical.
export const allVendors = vendors
  .map(shape)
  .sort((a, b) => b.reviewCount - a.reviewCount || a.name.localeCompare(b.name));

// Category chips: only categories in use, ordered by categories.mjs then count.
const counts = {};
for (const v of allVendors)
  for (const c of v.categories) counts[c.label] = (counts[c.label] || 0) + 1;

export const categoryChips = Object.keys(counts)
  .sort((a, b) => orderFor(a) - orderFor(b) || a.localeCompare(b))
  .map((label) => ({ label, icon: CATEGORIES[label]?.icon || '🔧', count: counts[label] }));

export const vendorCount = allVendors.length;
