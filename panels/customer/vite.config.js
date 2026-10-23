import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/customer/',
  plugins: [react()],
  server: {
    port: 5174,
    // Forward API calls to the Express backend instead of answering 404 here.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})