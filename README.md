# Pomeroy West Vendor Directory

A browseable, searchable directory of contractors and services that **Pomeroy West**
neighbors (an Eichler community in Santa Clara) have used and recommended. It's a
static site, maintained by neighbors, and lives at
**[vendors.pomeroywest.org](https://vendors.pomeroywest.org)**.

- **Source of truth:** [`src/data/vendors.json`](src/data/vendors.json) — a plain list you can edit directly. No spreadsheet, no database, no build-time data fetch.
- **Framework:** [Astro](https://astro.build) (static output)
- **Host:** Cloudflare Pages (auto-deploys on every push to `main`)
- **Privacy:** public but **unlisted** — `noindex` + `robots.txt` keep it out of search engines. Share the link in the neighborhood Google Group.

## Linkable views

Any search or filter you land on is a link you can paste into an email to a neighbor.
The address bar keeps up as you narrow things down, so you can just copy it — or build
one by hand:

| Link | What the neighbor sees |
| --- | --- |
| `vendors.pomeroywest.org/?category=Electrician` | The Electrician list, pre-filtered |
| `vendors.pomeroywest.org/?q=radiant` | A pre-filled search for "radiant" |
| `vendors.pomeroywest.org/?q=leak&category=Plumber` | Both together |
| `vendors.pomeroywest.org/#sj-plumbing` | Scrolls to and highlights one vendor |

`category` matches the chip names in [`categories.mjs`](src/data/categories.mjs) and is
case-insensitive (`?category=plumber` works). An unrecognized category is ignored.

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
- [`src/lib/data.mjs`](src/lib/data.mjs) — build-time loader: derives phone/text links, website/Yelp buttons, review counts, and the recency-biased sort (most-recently-recommended first).
- [`src/pages/index.astro`](src/pages/index.astro) — the whole site: one scannable list of vendor rows with a sticky search/filter bar; reviews show inline; each row is deep-linkable at `/#<slug>`.
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
