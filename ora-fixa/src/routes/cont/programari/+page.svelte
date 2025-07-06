<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import AppointmentCard from '$lib/components/account/appointment-card.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	export let data: PageData;

	$: ({ upcomingAppointments, pastAppointments, favoriteServiceId } = data);

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
			<h2 class="mb-6 text-4xl font-bold text-stone-900 md:text-5xl">Programarile mele</h2>
			<p class="mx-auto max-w-2xl text-xl text-stone-600">
				Totul la îndemână. Vezi, modifică sau anulează programările tale oricând.
			</p>
		</div>
		<div class="grid grid-cols-1 items-center gap-12">
			<Tabs.Root activationMode="manual" value="programari-viitoare">
				<div
					class="mx-auto mb-3 w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg transition-shadow hover:shadow-xl"
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
						<p class="text-center">Nu ai nicio programarea viitoare.</p>
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
