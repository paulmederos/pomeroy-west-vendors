import { defineConfig } from 'astro/config';

// Hosted at https://vendors.pomeroywest.org via Cloudflare Pages.
export default defineConfig({
  site: 'https://vendors.pomeroywest.org',
  build: {
    // Emit /vendor/ej-plumbing/index.html so clean URLs work without a server.
    format: 'directory',
  },
});
