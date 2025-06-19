<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { session as sessionStore } from '$lib/store/session';
	import Navbar from '$lib/components/layout/navbar.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	sessionStore.setSession(session);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				sessionStore.setSession(newSession);
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Navbar />
{@render children()}
