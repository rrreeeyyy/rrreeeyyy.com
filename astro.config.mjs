import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://rrreeeyyy.com',
  base: '/rrreeeyyy.com/',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  vite: {
    plugins: [yaml()]
  }
});
