import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind()
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      }
    ]
  }
})
