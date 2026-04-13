import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA Plugin Configuration for Progressive Web App support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Safety App',
        short_name: 'Safety',
        description: 'AI Night-Safety Companion - Get calm, clear, and practical safety guidance',
        theme_color: '#2c3e50',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['lifestyle', 'utilities'],
        screenshots: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      // Service Worker configuration
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              }
            }
          }
        ]
      },
      // Development configuration
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    port: 4173,
    host: '0.0.0.0',
    open: true
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: ['luckless-charm-prune.ngrok-free.dev']
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
