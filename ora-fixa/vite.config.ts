import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { imagetools } from "vite-imagetools";

export default defineConfig({
	plugins: [enhancedImages(), imagetools(),tailwindcss(), sveltekit()],
	ssr: {
		noExternal: ['layerchart'] // this is the important part
	}
});
