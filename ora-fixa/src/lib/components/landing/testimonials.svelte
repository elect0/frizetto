<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Star } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let testimonials = [
		{
			name: 'Bogdan Apostu',
			role: 'Prima vizită',
			text: 'Un super loc, super frizer, Ciprian te face sa te simți bine în compania sa, te tunde exact asa cum îți dorești, Frizetto îți oferă imaginea de care ai nevoie',
			initial: 'BA',
			picture:
				'https://lh3.googleusercontent.com/a-/ALV-UjWgTTNU0SJ6NaPWYP3tOIr3VAlQd1D5HoJ0ESa3f2ZdchwSBdaH8g=w128-h128-p-rp-mo-br100'
		},
		{
			name: 'Ionut Cataneanu',
			role: 'Client Fidel',
			text: 'Loc îngrijit, curat, iar Ciprian îți oferă consultanță și ajutor în a-ți găsi o tunsoare potrivită și care să meargă cu stilul tău de viață, lucru care lipsește cu desăvârșire în celelalte locații. Respect!',
			initial: 'IC',

			picture:
				'https://lh3.googleusercontent.com/a-/ALV-UjUt1RhPzg2vqtufqvNQJOz_AZS-ogf5UQByyGeQg6MvcBIVHfo=w128-h128-p-rp-mo-br100'
		},
		{
			name: 'Radu Oprescu',
			role: 'Client',
			text: 'Recomand Frizetto cu toată încrederea! Am avut parte de servicii de înaltă calitate. Personalul este foarte amabil și profesionist așa că voi reveni cu siguranță.',
			initial: 'RO',

			picture:
				'https://lh3.googleusercontent.com/a/ACg8ocLKITSLZmARdXQH6cV5NEoWBdIubqKlBMEQZawziSQRoncyAw=s128-c-rp-mo-br100'
		}
	];

	let pictures = [
		{ url: '/images/taper.webp' },
		{ url: '/images/taper.webp' },
		{ url: '/images/taper.webp' },
		{ url: '/images/taper.webp' },
		{ url: '/images/taper.webp' },
		{ url: '/images/taper.webp' }
	];
</script>

<section id="recenzii" class="bg-white py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mb-16 text-center">
			<Badge class="mb-6 border-stone-200 bg-stone-100 px-4 py-2 text-stone-700">
				Dovada Sociala
			</Badge>
			<h2 class="mb-4 text-4xl font-bold text-stone-900 md:mb-6 md:text-5xl">Rezultate & Pareri</h2>
			<p class="mx-auto max-w-2xl text-lg text-stone-600 md:text-xl">
				Lucrarile noastre vorbesc de la sine, iar clientii confirma calitatea.
			</p>
		</div>
		<div class="mb-16 grid grid-cols-2 gap-6 md:grid-cols-3">
			{#each pictures as picture, i}
				<div class="group relative overflow-hidden rounded-2xl shadow-lg">
					<img
						loading="lazy"
						src={picture.url}
						alt={`Tuns Realizat ${i + 1}`}
						class="h-[250px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
					<div
						class="absolute bottom-4 left-4 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<div class="text-lg font-semibold text-white md:text-xl">Taper</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each testimonials as testimonial}
				<Card class="border-stone-200 shadow-lg">
					<CardContent class="p-8">
						<div class="mb-4 flex items-center">
							<Star class="w-5-h-5 fill-current text-amber-500" />
							<Star class="w-5-h-5 fill-current text-amber-500" />
							<Star class="w-5-h-5 fill-current text-amber-500" />
							<Star class="w-5-h-5 fill-current text-amber-500" />
							<Star class="w-5-h-5 fill-current text-amber-500" />
						</div>
						<p class="mb-4 text-stone-600 italic md:mb-6">
							'{testimonial.text}'
						</p>
						<div class="flex items-center gap-4">
							<Avatar.Root class="h-12 w-12" delayMs={1000}>
								<Avatar.Image src={testimonial.picture} alt={testimonial.initial} />
								<Avatar.Fallback>{testimonial.initial}</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<div class="font-semibold text-stone-900">{testimonial.name}</div>
								<div class="text-sm text-stone-500">{testimonial.role}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>
