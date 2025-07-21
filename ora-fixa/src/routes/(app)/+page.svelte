<script lang="ts">
	import About from '$lib/components/landing/about.svelte';
	import Booking from '$lib/components/landing/booking.svelte';
	import Contact from '$lib/components/landing/contact.svelte';
	import Faq from '$lib/components/landing/faq.svelte';
	import Hero from '$lib/components/landing/hero.svelte';
	import Services from '$lib/components/landing/services.svelte';
	import Testimonials from '$lib/components/landing/testimonials.svelte';
	export let data;
	const { services } = data;
</script>

<Hero />
<About />
<Services {services} />
<Testimonials />
{#if data.form && data.services}
	<Booking services={data.services} form={data.form} />
{:else}
	<div class="py-24 text-center">
		<p class="animate-pulse">Se încarcă modulul de programare...</p>
	</div>
{/if}
<Faq />
<Contact />
