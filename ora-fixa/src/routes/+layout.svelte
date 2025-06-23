<script lang="ts">
	import '../app.css';
	// import { invalidate } from '$app/navigation';
	// import { onMount } from 'svelte';
	// import { session as sessionStore } from '$lib/store/session';

	// let { data, children } = $props();
	// let { session, supabase } = $derived(data);
	let { children } = $props();

	// sessionStore.setSession(session);

	// onMount(() => {
	// 	const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
	// 		if (newSession?.expires_at !== session?.expires_at) {
	// 			sessionStore.setSession(newSession);
	// 			invalidate('supabase:auth');
	// 		}
	// 	});

	// 	return () => data.subscription.unsubscribe();
	// });

	import { Toaster } from '$lib/components/ui/sonner/index.js';
</script>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
