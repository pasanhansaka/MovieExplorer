/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor-react'
          }
          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'vendor-mui'
          }
          if (id.includes('@tanstack') || id.includes('axios')) {
            return 'vendor-query'
          }
          if (id.includes('@supabase')) {
            return 'vendor-supabase'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    isolate: false,
  },
})
