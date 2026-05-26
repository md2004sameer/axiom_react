import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward every /api request to Spring Boot — same origin to the browser,
      // so no CORS preflight is ever triggered in development.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Cookies set by the backend (ax_tok) are passed through as-is.
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})