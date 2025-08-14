import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
        },
    },
    optimizeDeps: {
        include: ['jquery'],
    },
    base: '/build-client/',
    server: {
        port: 3000,
        strictPort: true,
    },
    build: {
        outDir: path.resolve(__dirname, '../../volvcrm/public/build-client'),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('jquery') || id.includes('summernote')) {
                        return 'editor-vendor'
                    }
                },
            },
        },
    },
})
