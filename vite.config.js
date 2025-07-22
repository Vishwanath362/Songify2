import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // ✅ Fix for Netlify/relative URLs

  server: {
    proxy: {
      '/api': 'http://localhost:3000', // ✅ Only used during local dev
    },
  },
})
