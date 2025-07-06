<script lang="ts">
	import { invalidate } from '$app/navigation';
	import AuthNavbar from '$lib/components/layout/auth-navbar.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);


	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		
		return () => data.subscription.unsubscribe()
	});
</script>

<svelte:head>
	<title>Contul Meu - Frizetto</title>
</svelte:head>

<AuthNavbar />
{@render children()}
