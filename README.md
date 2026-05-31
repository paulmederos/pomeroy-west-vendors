# Pomeroy West Vendor Directory

A browseable, searchable directory of contractors and services that **Pomeroy West**
neighbors (an Eichler community in Santa Clara) have used and recommended. It's a
static site, maintained by neighbors, and lives at
**[vendors.pomeroywest.org](https://vendors.pomeroywest.org)**.

- **Source of truth:** [`src/data/vendors.json`](src/data/vendors.json) — a plain list you can edit directly. No spreadsheet, no database, no build-time data fetch.
- **Framework:** [Astro](https://astro.build) (static output)
- **Host:** Cloudflare Pages (auto-deploys on every push to `main`)
- **Privacy:** public but **unlisted** — `noindex` + `robots.txt` keep it out of search engines. Share the link in the neighborhood Google Group.

## Want to add or fix a vendor?

You don't need to be a developer. See **[CONTRIBUTING.md](CONTRIBUTING.md)** — you can
edit one JSON file right in your browser on GitHub and open a pull request. A neighbor
will review and merge it, and the site redeploys automatically.

## How it works

```
src/data/vendors.json  ──(astro build)──►  static HTML  ──►  Cloudflare Pages
```

- [`src/data/vendors.json`](src/data/vendors.json) — every vendor, with contact info and neighbor reviews. **This is the file you edit.**
- [`src/data/categories.mjs`](src/data/categories.mjs) — the category list + icons used for filter chips.
- [`src/lib/data.mjs`](src/lib/data.mjs) — build-time loader: derives phone links, website/Yelp buttons, a fallback logo, review counts, and the sort order (most-reviewed first, then A→Z).
- [`src/pages/index.astro`](src/pages/index.astro) — the directory: search + category filters + cards.
- [`src/pages/vendor/[slug].astro`](src/pages/vendor/[slug].astro) — one page per vendor.
- [`src/styles/global.css`](src/styles/global.css) — the mid-century-modern / Eichler theme.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
```

## Deploying

Cloudflare Pages is connected to this repo. Pushing to `main` triggers a build
(`npm run build`, output `dist/`) and deploys to `vendors.pomeroywest.org`. To keep
it unlisted, leave `robots.txt` and the `noindex` tag in `src/layouts/Base.astro` in place.

## History

This started from a vendor list a former neighbor compiled in a Google Sheet, plus
recommendations gathered from the community Google Group. It's now fully
neighbor-owned — edit the JSON, open a PR, done.
