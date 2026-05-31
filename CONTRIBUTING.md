# Contributing to the Pomeroy West Vendor Directory

Thanks for helping keep this useful for the neighborhood! 🌿 You don't need to be a
developer — everything lives in one file you can edit in your browser.

## The easy way (no tools needed)

1. Open [`src/data/vendors.json`](src/data/vendors.json) on GitHub.
2. Click the **pencil ✏️ (Edit)** button.
3. Add or change a vendor (copy an existing entry as a template — see the shape below).
4. Scroll down, click **Propose changes**, then **Create pull request**.
5. A neighbor reviews it. Once merged, the site updates itself within a couple minutes.

That's it. If the formatting is slightly off, the build check on your pull request
will flag it and someone will help.

## What a vendor entry looks like

`src/data/vendors.json` is a list of vendors. Each one looks like this:

```json
{
  "slug": "ej-plumbing",
  "name": "EJ Plumbing",
  "contact": null,
  "categories": ["Plumber"],
  "services": ["Plumbing pipes", "Water heater", "Drain cleaning"],
  "phones": ["(650) 434-4432"],
  "emails": ["customercare@ejplumbing.com"],
  "websites": ["https://www.ejplumbing.com"],
  "yelp": "https://www.yelp.com/biz/ej-home-services-santa-clara",
  "logo": null,
  "reviews": [
    { "text": "Highly recommend — fast and friendly.", "date": "2026-05" }
  ],
  "notes": []
}
```

| Field | What it is |
|---|---|
| `slug` | URL id, lowercase-with-dashes, **unique**. This becomes `vendors.pomeroywest.org/vendor/<slug>`. Don't change an existing one (it breaks shared links). |
| `name` | Display name. |
| `contact` | Optional contact person (or `null`). |
| `categories` | One or more from the list in [`categories.mjs`](src/data/categories.mjs). Add a new one there if needed. |
| `services` | Free-text list of what they do. |
| `phones` | List of phone numbers as written, e.g. `"(408) 555-1212"`. Tap-to-call is built automatically. |
| `emails` | List of emails (or `[]`). |
| `websites` | List of full URLs (or `[]`). A small logo is auto-fetched from the first one. |
| `yelp` | Full Yelp URL, or `null`. |
| `logo` | Usually `null` (auto from website). Set a URL to override. |
| `reviews` | List of `{ "text": "...", "date": "YYYY-MM" }`. |
| `notes` | List of short factual notes (e.g. `"May have retired."`). |

## Review & privacy guidelines

This directory is **public**, so please:

- **Only list business contact info** (vendor phone/email/website) — that's already public.
- **Never include a neighbor's name, address, or phone** in a review. Attribute reviews
  generically; the site shows every review as *"— A Pomeroy West neighbor."*
- Keep reviews honest and specific. Note caveats factually (e.g. "great for X, less so for Y").
- Listings are shared neighbor experiences, **not** official HOA endorsements.

## Checking your change locally (optional)

```bash
npm install
npm run build   # should finish without errors
npm run dev     # preview at http://localhost:4321
```

If `npm run build` passes, your JSON is valid. Thank you for contributing! 🙏
