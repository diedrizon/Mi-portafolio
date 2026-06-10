import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React en su propio chunk: cambia poco → caché de larga vida.
          if (
            id.includes('node_modules') &&
            (id.includes('react-dom') ||
              id.includes('/react/') ||
              id.includes('scheduler'))
          ) {
            return 'react';
          }
        },
      },
    },
  },
});
