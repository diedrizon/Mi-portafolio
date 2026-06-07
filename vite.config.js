import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Separar dependencias pesadas en chunks cacheables por separado
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-icons')) return 'icons'
          if (id.includes('animejs')) return 'anime'
          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('scheduler')
          )
            return 'react'
          return 'vendor'
        },
      },
    },
  },
})
