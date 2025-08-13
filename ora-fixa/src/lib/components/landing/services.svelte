<script lang="ts">
	import type { Service } from '$lib/types/supabase';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	const services: Service[] = [
		{
			id: 2,
			created_at: '2025-06-25T14:29:01.418113+00:00',
			name: 'Tuns Zero',
			description:
				'O tunsoare curată, minimalistă, cu părul tuns aproape de piele, pentru un aspect ultra-simplu și impecabil. Ideal pentru cei care preferă întreținerea ușoară și un look îndrăzneț.',
			price: 35,
			duration_minutes: 60
		},
		{
			id: 1,
			created_at: '2025-06-09T09:29:53.133475+00:00',
			name: 'Tuns modern',
			description:
				'Un look fresh, actual și adaptat stilului tău personal. Stilistul nostru îți va contura părul astfel încât să te simți încrezător și să fii mereu în trend.\r\n\r\n',
			price: 40,
			duration_minutes: 60
		},
		{
			id: 3,
			created_at: '2025-06-25T14:29:53.681067+00:00',
			name: 'Tuns Barba',
			description:
				'Modelare precisă și îngrijire profesională a bărbii, pentru un contur perfect și un aspect bine definit. Fie că vrei o barbă completă sau o linie clară, te ajutăm să arăți impecabil.',
			price: 30,
			duration_minutes: 45
		},
		{
			id: 4,
			created_at: '2025-06-25T14:30:46.405504+00:00',
			name: 'Tuns Complet',
			description:
				'Pachet complet de stil: tunsoare modernă plus modelarea bărbii pentru un look armonios, actual și bine definit. Tot ce ai nevoie pentru un aspect fresh și îngrijit, realizat de profesioniști.',
			price: 50,
			duration_minutes: 60
		}
	];

	onMount(() => {
		gsap.to('#pachet-complet', {
			scale: 1.01,
			duration: 1.5,
			ease: 'power1.inOut',
			repeat: -1,
			yoyo: true
		});
	});
</script>

<section id="servicii" class="bg-stone-50 py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mb-10 text-center">
			<Badge class="mb-6 border-amber-200 bg-amber-600/10 px-4 py-2 text-amber-700">
				Servicii & Tarife
			</Badge>
			<h2 class="mb-4 md:mb-6 text-4xl font-bold text-stone-900 md:text-5xl">Servicii Premium</h2>
			<p class="mx-auto max-w-2xl text-lg md:text-xl text-stone-600">
				Transparență completă în prețuri. Fără surprize, doar calitate garantată.
			</p>
		</div>
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<div class="space-y-6">
				<Card class="border-stone-200 shadow-lg transition-shadow hover:shadow-xl">
					<CardContent class="p-8">
						<div class="space-y-6">
							{#each services as service}
								<div
									id={service.name === 'Tuns Complet' ? 'pachet-complet' : ''}
									class="flex items-center justify-between border-b border-stone-100 py-2 last:border-b-0"
								>
									<div class="flex-1">
										<h3 class="text-lg font-semibold text-stone-900">{service.name}</h3>
										<p class="text-sm text-stone-600">{service.description}</p>
										<span class="text-xs font-medium text-amber-600"
											>{service.duration_minutes} min</span
										>
									</div>
									<div class="text-right">
										<span
											class={`text-2xl font-bold ${service.name === 'Pachet Complet' ? 'text-amber-600' : 'text-stone-900'}`}
										>
											{service.price}
										</span>
										<span class="ml-1 text-stone-600">lei</span>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>
			<div class="relative">
				<div class="overflow-hidden rounded-3xl shadow-2xl">
					<img
						loading="lazy"
						src="/images/services.webp"
						alt="Unelte profesionale de frizerie"
						class="h-[500px] w-full object-cover"
					/>
				</div>
				<div
					class="absolute -bottom-4 -right-4 rounded-2xl border border-stone-100 bg-white p-6 shadow-xl"
				>
					<div class="text-center">
						<div class="text-xl md:text-2xl font-bold text-stone-900">100%</div>
						<div class="text-sm text-stone-600">Satisfactie</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
