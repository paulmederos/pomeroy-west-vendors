# Pomeroy West Vendor Directory

A browseable, searchable directory of contractors and services that Pomeroy West
(an Eichler community in Santa Clara) homeowners have recommended. Built as a
static site — no server, no database — and hosted at
**[vendors.pomeroywest.org](https://vendors.pomeroywest.org)**.

- **Data source:** Mark Sin's [Google Sheet](https://docs.google.com/spreadsheets/d/1LJeAnmMOa2Fbe5CxtGjL9TYqD30yoCzHZIELpDmr8iY/edit)
- **Framework:** [Astro](https://astro.build) (static output)
- **Host:** Cloudflare Pages
- **Privacy:** public but **unlisted** — `noindex` + `robots.txt` keep it out of search engines. Share the link in the Google Group.

---

## How it works

```
Google Sheet  ──(npm run import)──►  src/data/vendors.json  ──(astro build)──►  static HTML
```

The Sheet stays the human-friendly editing surface. `scripts/import.mjs` pulls the
"Vendors" tab as CSV, cleans it, and writes `src/data/vendors.json`, which the site
builds from. The code → label maps (categories, service tags) live in
`src/data/labels.mjs`.

### Updating the vendor list

1. Mark (or anyone with edit access) updates the Google Sheet as usual.
2. Run `npm run import` to pull the latest into `src/data/vendors.json`.
3. Commit and push. Cloudflare Pages rebuilds and deploys automatically.

> The import warns if it sees a category/service code that isn't in `labels.mjs`.
> If a new code appears, add it there and re-run.

### What the import cleans up automatically

- **Expands codes** (`PLU` → Plumber, `TAN` → Tankless water heater, etc.).
- **Dedupes vendors** that appear in multiple categories into one card
  (e.g. Rob Lutge → General Contractor + Handyman).
- **Normalizes phones** (strips invisible Unicode marks) and builds tap-to-call links.
- **Validates websites**, labels Yelp/Checkbook links, drops non-URLs.
- **Scrubs homeowner names** out of comments for privacy, and renders genuine
  recommendations as pull-quotes attributed to "A Pomeroy West neighbor."

---

## Local development

```bash
npm install
npm run import   # refresh data from the Sheet (optional; committed JSON works too)
npm run dev      # http://localhost:4321
npm run build    # output to dist/
```

---

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. After the first deploy, **Custom domains** → add `vendors.pomeroywest.org`.
   Since DNS is already on Cloudflare, it wires the CNAME for you in one click.

To keep it unlisted, leave `robots.txt` and the `noindex` meta tag in place
(both are already set in `public/robots.txt` and `src/layouts/Base.astro`).

If you ever want to gate access, turn on **Cloudflare Access** (email login) for
the domain — no code changes needed.

---

## Project structure

```
scripts/import.mjs        # Sheet CSV → cleaned vendors.json
src/data/labels.mjs       # category + service code → label maps (edit when codes change)
src/data/vendors.json     # generated; the site builds from this
src/layouts/Base.astro    # shared shell (header, footer, noindex, fonts)
src/pages/index.astro     # directory: search + category filters + cards
src/pages/vendor/[slug].astro  # one page per vendor
src/styles/global.css     # mid-century-modern / Eichler theme
```
