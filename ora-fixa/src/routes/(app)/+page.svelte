<script lang="ts">
	import About from '$lib/components/landing/about.svelte';
	import Hero from '$lib/components/landing/hero.svelte';
	import Services from '$lib/components/landing/services.svelte';
	import Testimonials from '$lib/components/landing/testimonials.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	export let data;
	const { services } = data;
</script>

<Hero />
<About />
<Services {services} />
<Testimonials />
