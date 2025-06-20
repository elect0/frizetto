<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	// import { Card, CardContent } from '$lib/components/ui/card';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';

	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import type { DateValue } from '@internationalized/date';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';

	import { Calendar } from '$lib/components/ui/calendar';

	import type { Service } from '$lib/types/supabase';

	let { services } = $props<{ services: Service[] }>();

	let selectedServiceId: string | '' = $state('');
	let selectedService: Service | null = $derived(
		selectedServiceId ? services.find((s: Service) => s.id.toString() === selectedServiceId) : null
	);

	interface Slot {
		available_slot: string;
	}

	$effect(() => {
		if (selectedDate && selectedService) {
			fetchAvailableTimes(selectedDate);
			console.log('FETCH');
		}
	});

	async function fetchAvailableTimes(date: DateValue) {
		if (!selectedService) return;
		const duration = selectedService.duration_minutes;
		const newDate = date.toString();

		isLoading = true;
		availableSlots = [];

		try {
			const response = await fetch(`/api/available-times?date=${newDate}&duration=${duration}`);

			if (response.ok) {
				const data = await response.json();
				console.log(data.slots);
				availableSlots = data.slots || [];
			}
		} catch (error) {
			console.error('A apărut o eroare în funcția fetch:', error);
			availableSlots = [];
		} finally {
			isLoading = false;
		}
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let selectedDate: DateValue | undefined = $state(undefined);
	let selectedTime: string | '' = $state('');

	let availableSlots: Slot[] = $state([]);
	let isLoading = $state(false);
	console.log(selectedTime);
</script>

<section id="booking" class="bg-gradient-to-br from-amber-50 to-stone-100 py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mx-auto max-w-4xl">
			<div class="mb-12 text-center">
				<Badge class="mb-6 border-0 bg-amber-600 px-4 py-2 text-white">Programare Online</Badge>
				<h2 class="mb-6 text-4xl font-bold text-stone-900 md:text-5xl">Alege o data si o ora</h2>
				<p class="text-xl text-stone-600">
					Procesul de rezervare este simplu si rapid. In doar 3 pasi esti programat.
				</p>
			</div>
			<Accordion type="single" class="rounded-lg border-stone-200 bg-white shadow-2xl">
				<div class="p-12">
					<div class="space-y-8">
						<AccordionItem value="item-1" class="space-y-4">
							<AccordionTrigger
								class="mb-4 flex cursor-pointer items-center gap-3 no-underline hover:no-underline focus:no-underline"
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 font-bold text-white"
								>
									1
								</div>
								<h3 class="text-xl font-semibold text-stone-900">Selecteaza Serviciul</h3>
							</AccordionTrigger>
							<AccordionContent>
								<RadioGroup.Root
									bind:value={selectedServiceId}
									class="grid grid-cols-1 gap-4 md:grid-cols-2"
								>
									{#each services as service (service.id)}
										<div>
											<RadioGroup.Item
												value={service.id.toString()}
												id={`service-${service.id}`}
												class="peer sr-only"
											/>
											<Label
												for={`service-${service.id}`}
												class="block cursor-pointer rounded-xl border-2 border-stone-200 bg-white p-4 transition-all hover:bg-stone-50 peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg"
											>
												<div class="flex justify-between font-semibold text-stone-900">
													<span>{service.name}</span>
													<span>{service.price} lei</span>
												</div>
												<p class="mt-1 text-sm text-stone-600">{service.duration_minutes} minute</p>
											</Label>
										</div>
									{/each}
								</RadioGroup.Root>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem
							value="item-2"
							class="space-y-4"
							disabled={!selectedService ? true : false}
						>
							<AccordionTrigger
								class="mb-4 flex cursor-pointer items-center gap-3 no-underline hover:no-underline focus:no-underline"
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full font-bold"
									class:bg-amber-600={selectedService}
									class:text-white={selectedService}
									class:bg-stone-300={!selectedService}
									class:text-stone-600={!selectedService}
								>
									2
								</div>
								<h3
									class="text-xl font-semibold"
									class:text-stone-900={selectedService}
									class:text-stone-600={!selectedService}
								>
									{selectedService ? 'Alege data' : 'Alege data (dupa selectarea serviciului'}
								</h3>
							</AccordionTrigger>
							{#if selectedService}
								<AccordionContent>
									<div class="border-border-stone-200 flex justify-center rounded-xl bg-white p-4">
										<div>
											<Calendar
												bind:value={selectedDate}
												type="single"
												disableDaysOutsideMonth={true}
											/>
											<p class="mt-4 text-center text-sm text-stone-600">
												Dată selectată: <span class="font-medium"
													>{selectedDate
														? df.format(selectedDate.toDate(getLocalTimeZone()))
														: 'Alege o dată'}</span
												>
											</p>
										</div>
									</div>
								</AccordionContent>
							{/if}
						</AccordionItem>
						<AccordionItem
							value="item-3"
							class="space-y-4"
							disabled={!selectedDate || !selectedService}
						>
							<AccordionTrigger
								class="mb-4 flex cursor-pointer items-center gap-3 no-underline hover:no-underline focus:no-underline"
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full font-bold"
									class:bg-amber-600={selectedService && selectedDate}
									class:text-white={selectedService && selectedDate}
									class:bg-stone-300={!selectedService || !selectedDate}
									class:text-stone-600={!selectedService || !selectedDate}
								>
									3
								</div>
								<h3
									class="text-xl font-semibold"
									class:text-stone-900={selectedService && selectedDate}
									class:text-stone-600={!selectedService || !selectedDate}
								>
									{selectedService && selectedDate
										? 'Alege Ora'
										: 'Alege data (dupa selectarea serviciului si/sau a orei)'}
								</h3>
							</AccordionTrigger>
							{#if selectedDate && selectedService}
								<AccordionContent class="pt-4">
									<div class="min-h-[8rem] rounded-lg bg-stone-50 p-4">
										{#if isLoading}
											<p class="animate-pulse text-center text-stone-500">Se încarcă orele...</p>
										{:else if availableSlots.length > 0}
											<RadioGroup.Root
												bind:value={selectedTime}
												class="grid grid-cols-3 gap-3 md:grid-cols-5"
											>
												{#each availableSlots as slot (slot)}
													<div>
														<RadioGroup.Item
															value={slot.available_slot}
															id={`time-${slot.available_slot}`}
															class="peer sr-only"
														/>
														<Label
															for={`time-${slot.available_slot}`}
															class="w-full cursor-pointer rounded-md border-2 border-stone-200 bg-white p-3 text-center text-sm font-semibold transition-all hover:bg-stone-100
										peer-data-[state=checked]:border-amber-600
										peer-data-[state=checked]:bg-amber-600
										peer-data-[state=checked]:text-white
										peer-data-[state=checked]:shadow-md
										"
														>
															{slot.available_slot}
														</Label>
													</div>
												{/each}
											</RadioGroup.Root>
										{:else}
											<p class="text-center font-medium text-red-600">
												Nu sunt ore disponibile în ziua selectată.
											</p>
										{/if}
									</div>
								</AccordionContent>
							{/if}
						</AccordionItem>
					</div>
				</div>
			</Accordion>
		</div>
	</div>
</section>
