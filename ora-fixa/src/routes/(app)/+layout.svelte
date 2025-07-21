<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<meta name="theme-color" content="#FFFFFF" />

	<title>{data.seo.title}</title>

	<meta name="description" content={data.seo.description} />

	<link rel="canonical" href={page.url.href} />

	<meta property="og:title" content={data.seo.title} />
	<meta property="og:description" content={data.seo.description} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={data.seo.ogImage} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.seo.title} />
	<meta name="twitter:description" content={data.seo.description} />
	<meta name="twitter:image" content={data.seo.ogImage} />

	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="alternate icon" href="/favicon.ico" type="image/png" sizes="16x16" />
</svelte:head>

<Navbar />
{@render children()}
