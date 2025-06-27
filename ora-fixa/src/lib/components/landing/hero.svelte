<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Award, Calendar, ChevronRight, Star, Users } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	onMount(() => {
		gsap.from('.hero-element', {
			y: 50,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.2,
			delay: 0.5
		});
	});
</script>

<section id="hero" class="relative flex min-h-screen items-center justify-center overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30"></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,134,11,0.05),transparent_50%)]"
	></div>
	<div class="container relative z-10 mx-auto px-4 pt-28 lg:px-6">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
			<div class="hero-element space-y-8 text-center lg:text-left">
				<Badge
					class="border-amber-200 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-700"
				>
					<Award class="mr-2 h-4 w-4" />
					Maiestrie in arta frizeriei
				</Badge>
				<div class="hero-element space-y-6">
					<h1 class="text-6xl font-black leading-[0.9] tracking-tight text-stone-900 md:text-7xl">
						STILUL{' '}
						<span
							class="block bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent"
						>
							TĂU
						</span>
						<span class="mt-2 block text-4xl font-light text-stone-600 md:text-5xl"
							>la ora fixă</span
						>
					</h1>
					<p class="max-w-xl text-xl leading-relaxed text-stone-600 md:text-2xl">
						Platforma de programari online pentru barbershop-ul tau din {' '}
						<span class="text-800 font-semibold">Bailesti</span>
					</p>
				</div>
				<div class="hero-element pt-4">
					<a
						href="#booking"
						class="group inline-flex items-center justify-center rounded-2xl bg-amber-600 px-12 py-3 text-lg text-white shadow-xl shadow-amber-600/25 transition-all duration-300 hover:bg-amber-700 hover:shadow-2xl hover:shadow-amber-600/30"
					>
						<Calendar class="mr-3 h-6 w-6" />
						Programează-te Acum
						<ChevronRight class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
				<div
					class="hero-element flex items-center justify-center gap-6 pt-4 text-stone-500 lg:justify-start"
				>
					<div class="flex items-center gap-2">
						<Users class="h-5 w-5 text-amber-600" />
						<span class="text-sm">500+ Clienti multumiti</span>
					</div>
					<div class="h-1 w-1 rounded-full bg-stone-400"></div>
					<div class="flex items-center gap-2">
						<Star class="h-5 w-5 fill-current text-amber-500" />
						<span class="text-sm">4.9/5 rating</span>
					</div>
				</div>
			</div>
			<div class="hero-element relative">
				<div
					class="transform-rotate-3 absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-600/10 to-stone-600/10 blur-sm"
				></div>
				<div
					class="relative overflow-hidden rounded-3xl border-8 border-white shadow-2xl shadow-stone-900/20"
				>
					<img
						src="/images/hero.jpg"
						alt="Frizer profesionist la lucru"
						class="h-[600px] w-full object-cover"
					/>
				</div>
				<div
					class="absolute -bottom-6 -left-6 rounded-2xl border border-stone-100 bg-white p-6 shadow-xl"
				>
					<div class="flex items-center gap-4">
						<div
							class="h-16 w-4 rounded-full bg-gradient-to-b from-amber-600 via-white to-stone-600 shadow-lg"
						></div>
						<div>
							<div class="text-lg font-bold text-stone-900">Est. 2018</div>
							<div class="text-sm text-stone-600">Traditie & Eleganta</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
