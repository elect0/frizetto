<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CalendarPlus } from 'lucide-svelte';
	import AppointmentCard from '$lib/components/account/appointment-card.svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let {data} = $props()

	let {upcomingAppointments, pastAppointments, favoriteServiceId} = data

	onMount(() => {
		gsap.from('.appointment-card', {
			duration: 0.5,
			opacity: 0,
			y: 30,
			stagger: 0.1,
			ease: 'power2.out'
		});
	});
</script>

<svelte:head>
	<title>Programările Mele - Cip Barbershop</title>
</svelte:head>

<div class="min-h-screen bg-stone-50 py-32">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mb-12 text-center">
			<Badge class="mb-6 bg-amber-600 px-4 py-2 text-white">Programari & Istoric</Badge>
			<h2 class="mb-4 md:mb-6 text-3xl md:text-4xl font-bold text-stone-900 md:text-5xl">Programarile mele</h2>
			<p class="mx-auto max-w-2xl text-lg md:text-xl text-stone-600">
				Totul la îndemână. Vezi, modifică sau anulează programările tale oricând.
			</p>
		</div>
		<div class="grid grid-cols-1 items-center gap-12">
			<Tabs.Root activationMode="manual" value="programari-viitoare">
				<div
					class="mx-auto mb-3 w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg"
				>
					<Tabs.List class="w-full gap-1.5 bg-transparent">
						<Tabs.Trigger
							class="cursor-pointer border-stone-200 bg-white ring-0 data-[state=active]:border-amber-600 data-[state=active]:bg-amber-50"
							value="programari-viitoare">Programari Actuale</Tabs.Trigger
						>
						<Tabs.Trigger
							class="cursor-pointer border-stone-200 bg-white ring-0 data-[state=active]:border-amber-600 data-[state=active]:bg-amber-50"
							value="istoric">Istoric</Tabs.Trigger
						>
					</Tabs.List>
				</div>
				<Tabs.Content value="programari-viitoare" class="space-y-3">
					{#if upcomingAppointments.length > 0}
						{#each upcomingAppointments as appointment (appointment.id)}
							<div class="appointment-card">
								<AppointmentCard {appointment} {favoriteServiceId} />
							</div>
						{/each}
					{:else}
						<div class="flex justify-center">
							<Card.Root
								class="max-w-2xl w-full border-2 border-dashed border-stone-200 bg-transparent shadow-none"
							>
								<Card.Content class="flex flex-col items-center justify-center p-10 text-center">
									<div class="mb-4 rounded-full bg-stone-100 p-4">
										<CalendarPlus class="h-12 w-12 text-stone-500" />
									</div>
									<h3 class="text-xl font-semibold text-stone-800">Calendarul tău este liber!</h3>
									<p class="mt-2 max-w-xs text-stone-600">
										Nu ai nicio programare actuală. Momentul perfect pentru a-ți rezerva următorul
										look.
									</p>
									<a href="/#booking" class="mt-6">
										<Button size="lg" class='cursor-pointer'>
										<CalendarPlus  class='w-5 h-5'/>
											Programează-te Acum
										</Button>
									</a>
								</Card.Content>
							</Card.Root>
						</div>
					{/if}
				</Tabs.Content>
				<Tabs.Content value="istoric" class="space-y-3">
					{#if pastAppointments.length > 0}
						{#each pastAppointments as appointment (appointment.id)}
							<div class="appointment-card">
								<AppointmentCard {appointment} {favoriteServiceId} />
							</div>
						{/each}
					{:else}
						<p class="text-center">Nu ai nicio programare anterioară.</p>
					{/if}
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
