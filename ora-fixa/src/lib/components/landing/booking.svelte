<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import type { DateValue } from '@internationalized/date';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';

	import { Calendar } from '$lib/components/ui/calendar';

	import type { Service } from '$lib/types/supabase';
	import { CalendarDays, Clock, Scissors } from 'lucide-svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';
	import { bookingSchema } from '$lib/schemas';
	import type { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';

	let { services, form: initialForm } = $props<{
		services: Service[];
		form: SuperValidated<z.infer<typeof bookingSchema>>;
	}>();

	const { form, errors, enhance } = superForm(initialForm, {
		validators: zod(bookingSchema),
		resetForm: true,
		id: 'booking-form',
		onChange(event) {
			if (event.paths[0] === 'date' || event.paths[0] === 'serviceId') {
				if (selectedDate && $form.date && $form.serviceId) {
					fetchAvailableTimes(selectedDate);
				}
			}
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Programarea a fost adăugată cu succes!');
				selectedDate = undefined;
			} else {
				console.log(form);
				toast.error('A apărut o eroare la adăugarea programării. Te rugăm să încerci din nou!');
			}
		}
	});

	let selectedService: Service | null = $derived(
		$form.serviceId ? services.find((s: Service) => s.id.toString() === $form.serviceId) : null
	);

	let selectedDate: DateValue | undefined = $state(undefined);

	let availableSlots: Slot[] = $state([]);
	let isLoading = $state(false);
	let activeAccordionStep = $state('item-1');

	$effect(() => {
		if (selectedService && !selectedDate) {
			activeAccordionStep = 'item-2';
		}
	});

	interface Slot {
		available_slot: string;
	}

	async function fetchAvailableTimes(date: DateValue) {
		if (!selectedService) return;
		const duration = selectedService.duration_minutes;
		const newDate = date.toString();

		isLoading = true;
		availableSlots = [];

		$form.time = '';

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

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});

	const minDate = today(getLocalTimeZone()).add({ days: 1 });

	const maxDate = minDate.add({ weeks: 2 });
</script>

<section id="booking" class="bg-gradient-to-br from-amber-50 to-stone-100 py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mx-auto max-w-4xl">
			<div class="mb-12 text-center">
				<Badge class="mb-6 border-0 bg-amber-600 px-4 py-2 text-white">Programare Online</Badge>
				<h2 class="mb-6 text-4xl font-bold text-stone-900 md:text-5xl">Alege o data si o ora</h2>
				<p class="text-xl text-stone-600">
					Procesul de rezervare este simplu si rapid. In doar 2 pasi esti programat.
				</p>
			</div>
			<Accordion
				type="single"
				class="rounded-lg border-stone-200 bg-white shadow-2xl"
				bind:value={activeAccordionStep}
			>
				<div class="p-12">
					<div class="space-y-8">
						<form method="POST" use:enhance>
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
										bind:value={$form.serviceId}
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
													class="block cursor-pointer rounded-xl border-2 border-stone-200 bg-white p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-50"
												>
													<div class="flex justify-between font-semibold text-stone-900">
														<span>{service.name}</span>
														<span>{service.price} lei</span>
													</div>
													<p class="mt-1 text-sm text-stone-600">
														{service.duration_minutes} minute
													</p>
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
										<div
											class="border-border-stone-200 grid grid-cols-1 rounded-xl bg-white py-4 md:grid-cols-2"
										>
											<div class="flex flex-col items-center justify-center">
												<Calendar
													locale="ro"
													bind:value={selectedDate}
													minValue={minDate}
													maxValue={maxDate}
													type="single"
													disableDaysOutsideMonth={true}
													onValueChange={() => {
														if (selectedDate) {
															$form.date = selectedDate.toDate(getLocalTimeZone()).toISOString();
														}
													}}
												/>
												<p class="mt-4 mb-2 text-center text-sm text-stone-600 md:mb-0">
													Dată selectată: <span class="font-medium"
														>{selectedDate
															? df.format(selectedDate.toDate(getLocalTimeZone()))
															: 'Alege o dată'}</span
													>
												</p>
											</div>
											<div class="min-h-[8rem] rounded-lg border border-stone-200 bg-stone-50 p-4">
												{#if isLoading}
													<p class="animate-pulse text-center text-stone-500">
														Se încarcă orele...
													</p>
												{:else if availableSlots.length > 0}
													<RadioGroup.Root
														bind:value={$form.time}
														class="grid grid-cols-2 gap-3 md:grid-cols-3"
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
																	class="w-full cursor-pointer rounded-md border-2 border-stone-200  p-3 text-center text-sm font-semibold transition-all peer-data-[state=checked]:border-amber-600
											peer-data-[state=checked]:bg-amber-50
											peer-data-[state=checked]:shadow-md
											hover:bg-stone-100
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
										</div>
									</AccordionContent>
								{/if}
							</AccordionItem>
							{#if selectedService && selectedDate && $form.time}
								<div class="mt-4">
									<h3 class="mb-4 text-xl font-semibold text-stone-900">Sumar Programare</h3>
									<div class="space-y-4 rounded-lg border border-stone-200 bg-stone-50 p-6">
										<div class="flex items-center">
											<div
												class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
											>
												<Scissors class="h-5 w-5" />
											</div>
											<div>
												<p class="text-sm text-stone-500">Serviciu</p>
												<p class="font-semibold text-stone-800">
													{selectedService.name} ({selectedService.price} lei)
												</p>
											</div>
										</div>
										<div class="flex items-center">
											<div
												class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
											>
												<CalendarDays class="h-5 w-5" />
											</div>
											<div>
												<p class="text-sm text-stone-500">Dată</p>
												<p class="font-semibold text-stone-800">
													{df.format(selectedDate.toDate(getLocalTimeZone()))}
												</p>
											</div>
										</div>
										<div class="flex items-center">
											<div
												class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
											>
												<Clock class="h-5 w-5" />
											</div>
											<div>
												<p class="text-sm text-stone-500">Ora</p>
												<p class="font-semibold text-stone-800">{$form.time}</p>
											</div>
										</div>
									</div>
								</div>
								<div class="mt-4 space-y-2">
									<Label for="clientNotes" class="font-semibold text-stone-800"
										>Adaugă o notiță (opțional)</Label
									>
									<Textarea
										id="clientNotes"
										name="clientNotes"
										placeholder="Exemplu: prefer tuns mai scurt pe laterale, ajung cu 5 minute întârziere..."
										class="min-h-[80px] bg-stone-50 text-sm"
										bind:value={$form.clientNotes}
									/>
									{#if $errors.clientNotes}
										<p class="text-sm text-red-600">{$errors.clientNotes}</p>
									{/if}
								</div>

								<div class="mb-6 flex items-center space-x-3 pt-4">
									<input
										type="hidden"
										name="duration"
										value={selectedService?.duration_minutes || 0}
									/>

									<Checkbox
										required
										id="terms"
										name="hasAgreedToPolicy"
										bind:checked={$form.hasAgreedToPolicy}
									/>
									<div class="grid gap-1.5 leading-none">
										<Label for="terms" class="cursor-pointer text-sm font-medium text-stone-700">
											Confirm angajamentul de a ma prezenta.
										</Label>
										<p class="text-xs text-stone-500">Inteleg ca pot anula programarea.</p>
									</div>
								</div>
								<Button type="submit" class="text-white">Confirma Programarea</Button>
							{/if}
						</form>
					</div>
				</div>
			</Accordion>
		</div>
	</div>
</section>
