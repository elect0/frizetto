<script lang="ts">
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
