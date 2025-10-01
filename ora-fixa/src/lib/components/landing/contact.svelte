<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { MapPin, Clock, Phone, Instagram, Facebook } from '@lucide/svelte';
	import Footer from '../layout/footer.svelte';

	const contactInfo = {
		address: {
			street: 'Strada Victoriei nr. 155',
			city: 'Băilești, Dolj'
		},
		schedule: {
			weekdays: 'Luni - Vineri: 09:00 - 18:00',
			saturday: 'Sâmbătă: 09:00 - 17:00',
			sunday: 'Duminică: Închis'
		},
		phone: '+40 765 484 036',
		whatsapp: true,
		instagram: 'https://www.instagram.com/ciprian_frizeru/',
		facebook: 'https://www.facebook.com/duma.alex.58/'
	};
</script>

<section id="contact" class="bg-stone-900 py-24 text-white">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="grid grid-cols-1 gap-1 lg:grid-cols-2">
			<div class="space-y-8">
				<Badge class="border-0 bg-amber-600 px-4 py-2 text-white">Locație & Contact</Badge>
				<div class="space-y-6">
					<h2 class="text-3xl font-bold md:text-4xl">Vino sa ne cunoastem</h2>
					<p class="text-base text-stone-300 md:text-lg">
						Te așteptăm în salonul nostru din centrul Bailestiului pentru o experiență de grooming
						de neuitat
					</p>
				</div>
				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600"
						>
							<MapPin class="h-6 w-6 text-white" />
						</div>
						<div>
							<div class="text-lg font-semibold">Adresa</div>
							<div class="text-stone-300">{contactInfo.address.street}</div>
							<div class="text-stone-300">
								{contactInfo.address.city}
							</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600"
						>
							<Clock class="h-6 w-6 text-white" />
						</div>
						<div>
							<div class="text-lg font-semibold">Program</div>
							<div class="text-stone-300">{contactInfo.schedule.weekdays}</div>
							<div class="text-stone-300">{contactInfo.schedule.saturday}</div>
							<div class="text-stone-300">{contactInfo.schedule.sunday}</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600"
						>
							<Phone class="h-6 w-6 text-white" />
						</div>
						<div>
							<div class="text-lg font-semibold">Telefon</div>
							<div class="text-stone-300">{contactInfo.phone}</div>
							{#if contactInfo.whatsapp}
								<div class="text-sm text-stone-400">Whatsapp disponibil</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="pt-6">
					<div class="mb-4 text-lg font-semibold">Urmărește-ne</div>
					<div class="flex gap-4">
						<a
							href={contactInfo.instagram || '#'}
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-800 transition-colors hover:bg-amber-600"
						>
							<Instagram class="h-6 w-6" />
						</a>
						<a
							href={contactInfo.facebook || '#'}
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-800 transition-colors hover:bg-amber-600"
						>
							<Facebook class="h-6 w-6" />
						</a>
					</div>
				</div>
			</div>
			<div class="relative">
				<div class="mt-4 flex items-center justify-center">
					<iframe
						title="locatie"
						src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d236.60037069771994!2d23.34549730732371!3d44.02237110350622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sro!2sro!4v1751006747416!5m2!1sro!2sro"
						width="723"
						class="rounded-2xl"
						height="500"
						style="border:0;"
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
			</div>
		</div>
	</div>
</section>
