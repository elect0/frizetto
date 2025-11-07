<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { Toaster } from '$lib/components/ui/sonner/index.js';
</script>

<svelte:head>
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#4a90e2" />
</svelte:head>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
