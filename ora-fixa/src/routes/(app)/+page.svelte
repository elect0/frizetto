<script lang="ts">
	import About from '$lib/components/landing/about.svelte';
	import Booking from '$lib/components/landing/booking.svelte';
	import Contact from '$lib/components/landing/contact.svelte';
	import Faq from '$lib/components/landing/faq.svelte';
	import Hero from '$lib/components/landing/hero.svelte';
	import Services from '$lib/components/landing/services.svelte';
	import SkeletonBooking from '$lib/components/landing/skeleton-booking.svelte';
	import Testimonials from '$lib/components/landing/testimonials.svelte';
	let { data } = $props();
</script>

<Hero />
<About />
<Services />
<Testimonials />
{#await data.streamed.services}
	<SkeletonBooking />
{:then services}
	{#if data.form}
		<Booking {services} form={data.form} />
	{/if}
{/await}
<Faq />
<Contact />
