import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the built bundle can be served from any sub-path
  // (e.g. a /blood-doctor/myeloid-sarcoma/ folder on GitHub Pages) without
  // clobbering the PE app that currently builds into /docs.
  base: './',
  server: {
    port: 3002,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
