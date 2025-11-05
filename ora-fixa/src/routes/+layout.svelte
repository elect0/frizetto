<script lang="ts">
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';
	import { dev } from '$app/environment';

	let { children } = $props();

	import { Toaster } from '$lib/components/ui/sonner/index.js';

	navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic'
	});

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
