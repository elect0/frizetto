<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Award, Calendar, ChevronRight, Star, Users } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { smoothscroll } from '$lib/hooks/smooth-scrolling';
	import hero from '$lib/assets/about.webp';

  onMount(() => {
		const tl = gsap.timeline({ delay: 0.5 });

		tl.from('.hero-element', {
			y: 50,
			opacity: 0,
			duration: 0.8,
			ease: 'circ.out',
			stagger: 0.2
		});

		return () => {
			tl.kill();
		};
	});

</script>

<section id="hero" class="relative flex min-h-screen items-center justify-center overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30"></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,134,11,0.05),transparent_50%)]"
	></div>
	<div class="relative z-10 container mx-auto px-4 pt-28 lg:px-6">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
			<div class="hero-element space-y-8 text-center lg:text-left">
				<Badge
					class="border-amber-200 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-700"
				>
					<Award class="mr-2 h-4 w-4" />
					Maiestrie in arta frizeriei
				</Badge>
				<div class="hero-element mb-2 space-y-4 md:mb-3 md:space-y-6">
					<h1 class="text-6xl leading-[0.9] font-black tracking-tight text-stone-900 md:text-7xl">
						STILUL{' '}
						<span
							class="block bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent"
						>
							TĂU
						</span>
						<span class="mt-1 block text-2xl font-light text-stone-600 md:mt-2 md:text-4xl"
							>Mai mult decât o tunsoare.</span
						>
					</h1>
					<p class="max-w-xl text-lg leading-relaxed text-stone-600 md:text-2xl">
						Momentul tău de răsfăț începe cu o programare online la noi.
					</p>
				</div>
				<div class="hero-element pt-4">
					<a
						href="#booking"
						use:smoothscroll={{ offset: 50 }}
						class="group inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-base text-white shadow-xl shadow-amber-600/25 transition-all duration-300 hover:bg-amber-700 hover:shadow-2xl hover:shadow-amber-600/30 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none md:rounded-2xl md:px-12 md:py-3 md:text-lg"
					>
						<Calendar class="mr-2 h-4 w-4 md:mr-3 md:h-6 md:w-6" />
						<span>Programează-te Acum</span>
						<ChevronRight
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5"
						/>
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
					<enhanced:img
						src={hero ? hero : ''}
						alt="Frizer profesionist la lucru"
						class="h-[500px] w-full object-cover"
						fetchpriority="high"
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
							<div class="text-base font-bold text-stone-900 md:text-lg">Est. 2018</div>
							<div class="text-sm text-stone-600">Traditie & Eleganta</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
