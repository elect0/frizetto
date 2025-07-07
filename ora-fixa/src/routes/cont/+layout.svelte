<script lang="ts">
	import AuthNavbar from '$lib/components/layout/auth-navbar.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Contul Meu - Frizetto</title>
</svelte:head>

<AuthNavbar />
{@render children()}