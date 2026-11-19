import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://michaelmoran.eu',
  output: 'static',
  prefix: '/',
  trailingSlash: 'never',
  cleanUrls: true,
  compress: true,
  integrations: [],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    }
  }
});