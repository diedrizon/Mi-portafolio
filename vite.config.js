import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 600, // three vive en un chunk async propio
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // React en su propio chunk: cambia poco → caché de larga vida.
          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('scheduler')
          ) {
            return 'react';
          }
          // Capa de movimiento compartida (gsap + lenis).
          if (id.includes('/gsap/') || id.includes('/lenis/')) {
            return 'motion';
          }
          // three queda en su propio chunk asíncrono (import dinámico).
          return undefined;
        },
      },
    },
  },
});
