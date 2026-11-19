import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// base: GitHub Pages serves the site at /bus-prototype/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/bus-prototype/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': fileURLToPath(new URL('./src/ds', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
