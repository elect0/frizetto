<script lang="ts">
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';
	import { dev, browser } from '$app/environment';

	let { children } = $props();

	import { Toaster } from '$lib/components/ui/sonner/index.js';


	if (browser && 'serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js', {
			type: dev ? 'module' : 'classic'
		}).then(() => {
			console.log('Service worker registered');
		}).catch((err) => {
			console.error('SW registration failed:', err);
		});
	}
	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
