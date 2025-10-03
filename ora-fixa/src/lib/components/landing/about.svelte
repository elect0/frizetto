<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const tl = gsap.timeline();

			tl.from('#despre .about-element', {
				y: 75,
				opacity: 0,
				duration: 0.8,
				ease: 'circ.out',
				stagger: 0.2
			});

			ScrollTrigger.create({
				trigger: '#despre',
				start: 'top 80%',
				animation: tl,
				toggleActions: 'play none none none'
			});
		});

		return () => ctx.revert();
	});
</script>

<section id="despre" class="bg-white py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
			<div class="about-element relative order-2 lg:order-1">
				<div class="relative overflow-hidden rounded-3xl shadow-2xl md:max-h-[500px]">
					<enhanced:img
						src="../../assets/about.webp?fit=cover"
						sizes="(min-width: 768px) 712px, 100vw"
						alt="Frizer profesionist"
						loading="lazy"
					/>
				</div>

				<div
					class="absolute -top-4 -right-4 rounded-2xl bg-amber-600 p-4 shadow-xl md:-top-6 md:-right-6"
				>
					<Sparkles class="h-8 w-8 text-white" />
				</div>
			</div>
			<div class="about-element order-1 space-y-8 lg:order-2">
				<Badge class="border-stone-200 bg-stone-100 px-4 py-2 text-stone-700">Despre Artizan</Badge>
				<div class="space-y-6">
					<h2 class="text-4xl leading-tight font-bold text-stone-900 md:text-5xl">
						Pasiunea pentru <span class="text-amber-600">perfectiune</span>
					</h2>
					<div class="text-lx space-y-4 leading-relaxed text-stone-600">
						<p>
							Sunt <strong class="text-stone-800">Ciprian</strong>, și de peste 8 ani transform
							părul în artă. Fiecare tuns pe care îl realizez este o poveste unică, adaptată
							personalității și stilului de viață al clientului.
						</p>
						<p>
							Cred că un barbershop nu este doar un loc unde îți tunzi părul – este un spațiu unde
							te reconectezi cu tine, unde găsești liniștea și pleci cu încrederea că arăți
							impecabil.
						</p>

						<p>
							Filosofia mea este simplă:{' '}
							<em class="font-medium text-amber-700">calitatea nu se negociază niciodată</em>.
						</p>
					</div>
					<div class="pt-4">
						<div class="text-stone 800 text-2xl font-bold">~ Ciprian Poenaru</div>
					</div>
					<div class="mt-1 text-sm text-stone-500">Master Barber & Fondator</div>
				</div>
			</div>
		</div>
	</div>
</section>
