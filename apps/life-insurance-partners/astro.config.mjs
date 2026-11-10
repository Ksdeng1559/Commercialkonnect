import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
export default defineConfig({ output: 'server', adapter: netlify(), site: 'https://commercialkonnect-referral-partners.netlify.app' });
