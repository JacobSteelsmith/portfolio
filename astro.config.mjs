import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://jacob.steelsmith.org',
  integrations: [
    sitemap({
      serialize(item) {
        // Add lastmod to all sitemap entries.
        // For a static site that rebuilds on every content change,
        // the build date represents when the page was last generated.
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
