import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import { VitePWA } from 'vite-plugin-pwa';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    build: {
        outDir: 'dist',
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Diff App',
                short_name: 'Diff App',
                start_url: '.',
                display: 'standalone',
                background_color: '#ffffff',
                description: 'Compare text differences quickly and easily with Diff App. Highlight changes at the character or word level and see the similarity score. Perfect for developers, writers, and anyone who needs to track text changes.',
                icons: [
                    {
                        src: '/images/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/images/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
});
