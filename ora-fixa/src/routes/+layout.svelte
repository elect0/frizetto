<script lang="ts">
	import '../app.css';
  import { onMount } from 'svelte';
	// import { invalidate } from '$app/navigation';
	// import { onMount } from 'svelte';
	// import { session as sessionStore } from '$lib/store/session';

  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegistered(r: any) {
          // uncomment following code if you want check for updates
          // r && setInterval(() => {
          //    console.log('Checking for sw update')
          //    r.update()
          // }, 20000 /* 20s for testing purposes */)
          console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error: any) {
          console.log('SW registration error', error)
        }
      })
    }
  })

  import { pwaInfo } from 'virtual:pwa-info';

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

  let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '')
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

{@render children()}
<Toaster theme="light" richColors position="top-right" />
