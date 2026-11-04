import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// '@shared' points to the shared/ folder at the project root (used by frontend and backend).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@shared': fileURLToPath(new URL('../shared', import.meta.url)) } },
  server: {
    fs: { allow: ['..'] },
    // lets the ngrok address open the site
    allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.ngrok.io'],
    // anything starting with /api goes to your backend, so only ONE ngrok link is needed
    proxy: { '/api': 'http://localhost:4000' },
  },
});