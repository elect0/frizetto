<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Star } from 'lucide-svelte';

	let testimonials = [
		{
			name: 'Mihai Ionescu',
			role: 'Client fidel',
			text: 'Cel mai bun frizer din Băilești! Andrei înțelege exact ce vreau și rezultatul este mereu perfect. Atmosfera din salon este foarte relaxantă.',
			initial: 'M'
		},
		{
			name: 'Alexandru Popa',
			role: 'Antreprenor',
			text: 'Profesionalism de top! Am încercat multe saloane, dar aici am găsit ceea ce căutam. Recomand cu încredere!',
			initial: 'A'
		},
		{
			name: 'Radu Marinescu',
			role: 'Manager',
			text: 'Experiența completă! De la atmosferă la rezultatul final, totul este la nivel înalt. Mă întorc mereu cu plăcere.',
			initial: 'R'
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
			<h2 class="mb-6 text-4xl font-bold text-stone-900 md:text-5xl">Rezultate & Pareri</h2>
			<p class="mx-auto max-w-2xl text-xl text-stone-600">
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
						<div class="text-xl font-semibold text-white">Taper</div>
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
						<p class="mb-6 italic text-stone-600">
							'{testimonial.text}'
						</p>
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-stone-300"
							>
								<span class="font-semibold text-stone-600">
									{testimonial.initial}
								</span>
							</div>
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
