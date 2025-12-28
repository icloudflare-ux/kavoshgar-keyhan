// FIX: To resolve vitest type errors, defineConfig is now imported from 'vitest/config'
// which extends Vite's config with the 'test' property types.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // FIX: Updated base path from placeholder to root path '/'.
    base: '/', 
    plugins: [
      react(),
    ],
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setupTests.ts',
    }
  }
})