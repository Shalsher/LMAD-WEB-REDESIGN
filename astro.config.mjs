// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static output: the whole site pre-renders to plain files so it can sit on
// LMAD's existing Hostinger space with no Node runtime and no server to attack.
export default defineConfig({
  site: 'https://lmad.in',
  output: 'static',
  integrations: [react()],
  image: {
    // Story portraits and banners still live on the current site while we migrate.
    domains: ['lmad.in'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
