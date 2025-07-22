import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  
  server: {
    historyApiFallback: true, // Enable history API fallback for SPA
    proxy: {
      '/api': 'http://localhost:3000', // Only used during local dev
    },
  },
  
  preview: {
    port: 3000,
    host: true,
    historyApiFallback: true // Also for preview mode
  }
})