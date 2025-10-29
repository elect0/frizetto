import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { imagetools } from 'vite-imagetools';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		SvelteKitPWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},
			srcDir: 'src',
			filename: 'src/service-worker.ts',
			strategies: 'injectManifest',
			manifest: {
				name: 'Frizetto',
				short_name: 'Frizetto',
				description: 'Test',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: '/512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: [
					'client/**/*.{js,css,ico,svg,webp,webmanifest}',
					'prerendered/**/*.{html,json}'
				],
				globIgnores: ['**/*.png'],
				maximumFileSizeToCacheInBytes: 5 * 1024 ** 2
			}
		}),

		enhancedImages(),
		imagetools(),
		tailwindcss(),
		sveltekit()
	],
	build: {
		assetsInlineLimit: 4096
	},
	ssr: {
		noExternal: ['layerchart'] // this is the important part
	}
});
