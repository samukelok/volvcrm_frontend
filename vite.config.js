import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/build-client/',
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, '../../cms_hub/public/build-client'),
    emptyOutDir: true,
    manifest: true,
  },
})