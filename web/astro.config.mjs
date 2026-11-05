// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Pages stay static (prerendered) by default. Only routes that opt out via
// `export const prerender = false` run on-demand — currently just /api/apply.
// Tailwind v4 is applied via PostCSS (postcss.config.mjs), not the Vite plugin, to avoid a
// Vite version clash between Astro 6 (Vite 7) and @tailwindcss/vite (Vite 8 / rolldown).
export default defineConfig({
  site: 'https://commercialkonnect.ca',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (url) => {
        const pathname = new URL(url).pathname;
        return !/^\/(apply|thank-you|api)(\/|$)/.test(pathname);
      },
    }),
  ],
});
