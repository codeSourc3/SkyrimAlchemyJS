/// <reference types="vite/client" />
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        VitePWA({
            devOptions: {
                enabled: true
            },
            manifest: {
                name: 'Skyrim AlchemyJS',
                short_name: 'AlchemyJS',
                start_url: '/SkyrimAlchemyJS/',
                background_color: '#0f0f0e',
                display: 'standalone',
                theme_color: '#90ee90',
                icons: [
                    {
                        src: 'images/maskable_icon_x48.png',
                        type: 'image/png',
                        sizes: '48x48',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x72.png',
                        type: 'image/png',
                        sizes: '72x72',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x96.png',
                        type: 'image/png',
                        sizes: '96x96',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x128.png',
                        type: 'image/png',
                        sizes: '128x128',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x192.png',
                        type: 'image/png',
                        sizes: '192x192',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x384.png',
                        type: 'image/png',
                        sizes: '384x384',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'images/maskable_icon_x512.png',
                        type: 'image/png',
                        sizes: '512x512',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ]
});