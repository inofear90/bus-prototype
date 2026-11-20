import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

// Flow to present: VITE_FLOW env var wins over prototype.config.json.
const config = JSON.parse(readFileSync(new URL('./prototype.config.json', import.meta.url), 'utf8')) as { flow?: string };
const flow = process.env.VITE_FLOW ?? config.flow ?? '';

// Figma code layers (and other hosts) give the port in $PORT; the dev server must listen on it.
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  // GitHub Pages serves the site at /bus-prototype/
  base: process.env.GITHUB_ACTIONS ? '/bus-prototype/' : '/',
  plugins: [react()],
  define: { __PROTOTYPE_FLOW__: JSON.stringify(flow) },
  server: { host: true, port, strictPort: Boolean(process.env.PORT) },
  preview: { host: true, port, strictPort: Boolean(process.env.PORT) },
  resolve: {
    alias: {
      '@ds': fileURLToPath(new URL('./src/ds', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
