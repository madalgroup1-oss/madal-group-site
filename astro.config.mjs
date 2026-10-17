// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/fr/reference/configuration-reference/
export default defineConfig({
  site: 'https://www.madalgroup.ci',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /admin n'apparaît jamais dans le plan du site
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  image: {
    // Logos et captures téléversés dans le stockage Supabase (bucket « media »)
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  build: {
    // Feuilles de style toujours externes : la CSP n'autorise pas les styles en ligne
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Scripts toujours externes (fichiers hachés) : la CSP n'autorise pas les scripts en ligne
      assetsInlineLimit: 0,
    },
  },
});
