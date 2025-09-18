<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { enhance } from '$app/forms';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { type DateValue, DateFormatter } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { Save } from 'lucide-svelte';
	import ScheduleOverrideCard from '$lib/components/schedule-override-card.svelte';

	let { data } = $props();

	console.log(data.scheduleOverrides);

	let dateValue: DateValue | undefined = $state();

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});

	const {
		form,
		enhance: formEnhance,
		submitting: isSubmittingOverride
	} = superForm(data.overrideForm, {
		id: 'override-form',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Succes!', { description: result.data?.form.message });
				dateValue = undefined;
				invalidateAll();
			}
		}
	});

	let schedules = $state(
		[...Array(7)].map((_, i) => {
			const dayOfWeek = i + 1;
			const existingSchedule = data.workSchedules?.find((s) => s.day_of_week === dayOfWeek);
			return (
				existingSchedule || {
					day_of_week: dayOfWeek,
					is_active: false,
					start_time: '09:00',
					end_time: '17:00'
				}
			);
		})
	);

	const daysOfWeek = [
		{ id: 1, name: 'Luni' },
		{ id: 2, name: 'Marți' },
		{ id: 3, name: 'Miercuri' },
		{ id: 4, name: 'Joi' },
		{ id: 5, name: 'Vineri' },
		{ id: 6, name: 'Sâmbătă' },
		{ id: 7, name: 'Duminică' }
	];
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div class="px-4 lg:px-6">
				<h1 class="mb-6 text-3xl font-medium">Program de lucru</h1>
				<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>Program Standard</Card.Title>
							<Card.Description
								>Setează programul de lucru recurent pentru fiecare zi.</Card.Description
							>
						</Card.Header>
						<form
							action="?/updateWeeklySchedule"
							method="POST"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										toast.success('Programul a fost modificat cu succes.');
										await invalidateAll();
									} else {
										toast.error('Eroare:', {
											description: 'Programul nu a putut fi modificat ca succes.'
										});
									}
								};
							}}
						>
							<Card.Content class="space-y-4">
								{#each schedules as schedule, i (schedule.day_of_week)}
									<Label>{daysOfWeek.find((day) => day.id === schedule.day_of_week)?.name}</Label>
									<div class="flex w-full flex-row items-center space-x-2">
										<Checkbox
											bind:checked={schedule.is_active}
											name={`is_active_${schedule.day_of_week}`}
										/>
										<div class="grid w-full grid-cols-2 justify-around gap-2">
											<Input
												type="time"
												name={`start_time_${schedule.day_of_week}`}
												value={schedule.start_time}
												class="w-full"
												disabled={!schedule.is_active}
											/>

											<Input
												type="time"
												name={`end_time_${schedule.day_of_week}`}
												value={schedule.end_time}
												class="w-full"
												disabled={!schedule.is_active}
											/>
										</div>
									</div>
								{/each}
							</Card.Content>
							<Card.Footer>
								<Button class="mt-4" type="submit"
									><Save class="h-5 w-5" />Salvează Programul</Button
								>
							</Card.Footer>
						</form>
					</Card.Root>
					<div class="space-y-6">
						<Card.Root>
							<Card.Header>
								<Card.Title>Program Personalizat</Card.Title>
								<Card.Description
									>Setează programul de lucru personalizat pentru fiecare zi.</Card.Description
								>
							</Card.Header>
							<Card.Content>
								<Popover.Root>
									<Popover.Trigger class="w-full">
										{#snippet child({ props })}
											<Button
												variant="outline"
												class={cn(
													'justify-start text-left font-normal',
													!dateValue && 'text-muted-foreground'
												)}
												{...props}
											>
												<CalendarIcon class="mr-2 size-4" />
												{dateValue
													? df.format(dateValue.toDate(getLocalTimeZone()))
													: 'Selecteaza o data.'}
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0">
										<Calendar
											locale="ro"
											bind:value={dateValue}
											minValue={today(getLocalTimeZone())}
											disableDaysOutsideMonth={true}
											type="single"
											initialFocus
											onValueChange={() => {
												if (dateValue) {
													$form.date = dateValue.toDate(getLocalTimeZone()).toISOString();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								{#if dateValue}
									<Separator class="mt-4" />
									<form action="?/setScheduleOverride" method="POST" use:formEnhance>
										<div class="mt-4 space-y-4">
											<input type="hidden" name="date" bind:value={$form.date} />
											<div class="flex items-center space-x-2">
												<Checkbox
													id="is_active_override"
													name="isActive"
													bind:checked={$form.isActive}
												/>
												<Label for="is_active_override">Zi lucrătoare</Label>
											</div>
											{#if $form.isActive}
												<div class="flex items-center gap-4">
													<div class="w-full space-y-2">
														<Label for="start_time_override">Ora Început</Label>
														<Input
															id="start_time_override"
															name="startTime"
															bind:value={$form.startTime}
															type="time"
														/>
													</div>
													<div class="w-full space-y-2">
														<Label for="end_time_override">Ora Sfârșit</Label>
														<Input
															id="end_time_override"
															name="endTime"
															bind:value={$form.endTime}
															type="time"
														/>
													</div>
												</div>
											{/if}
											<Button disabled={$isSubmittingOverride} type="submit"
												><Save class="h-5 w-5" /> Salvează Excepția</Button
											>
										</div>
									</form>
								{/if}
							</Card.Content>
						</Card.Root>
						<div>
							<h1 class="mb-3 text-xl font-semibold">Excepții</h1>
							{#each data.scheduleOverrides as override (override.id)}
								<ScheduleOverrideCard {override} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
