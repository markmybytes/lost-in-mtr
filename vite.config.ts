import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		SvelteKitPWA({
			srcDir: './src',
			strategies: 'injectManifest',
			manifest: {
				name: 'Lost In MTR',
				short_name: '迷失港鐵',
				start_url: '.',
				description: '港鐵列車車廂位置搜尋器。透過車廂及車門編號來尋找你在列車上的位置。',
				display: 'standalone',
				icons: [
					{
						src: '/web-app-manifest-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/web-app-manifest-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{html,js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: false,
				type: 'module',
				suppressWarnings: true,
				navigateFallback: '/'
			},
			kit: {
				includeVersionFile: true
			}
		})
	]
});
