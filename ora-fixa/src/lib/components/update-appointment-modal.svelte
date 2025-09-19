<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { buttonVariants, Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { updateAppointmentSchema } from '$lib/schemas';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { CalendarIcon, Save } from '@lucide/svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { Appointment } from './appointments-table.svelte';
	import type { Row } from '@tanstack/table-core';
	import { formatISO } from 'date-fns';
	import { parseDate } from '@internationalized/date';

	let {
		row
	}: {
		row: Row<Appointment>;
	} = $props();

	let availableSlots = $state<{ available_slot: string }[]>([]);
	let isLoading = $state(false);
	let clientName = $state(row.original.profiles.full_name);

	const services = [
		{ value: 2, label: 'Tuns Zero', duration_minutes: 60 },
		{ value: 1, label: 'Tuns modern', duration_minutes: 60 },
		{ value: 3, label: 'Tuns Barba', duration_minutes: 45 },
		{ value: 4, label: 'Tuns Complet', duration_minutes: 60 }
	];

	const statuses = [
		{ value: 'confirmata', label: 'Confirmată' },
		{ value: 'anulata', label: 'Anulată' },
		{ value: 'finalizata', label: 'Finalizată' },
		{ value: 'neprezentat', label: 'Neprezentat' }
	];

	let duration = $derived.by(() =>
		services.find((s) => s.value.toString() === $form.serviceId)?.duration_minutes.toString()
	);

	const { form, enhance } = superForm(
		defaults(
			{
				appointmentId: row.original.id.toString(),
				serviceId: row.original.services.id.toString(),
				date: row.original.start_time,
				time: new Date(row.original.start_time).toLocaleTimeString('ro-RO', {
					hour: '2-digit',
					minute: '2-digit'
				}),
				status: row.original.status
			},
			zod(updateAppointmentSchema)
		),
		{
			validators: zod(updateAppointmentSchema),
			id: row.original.id.toString(),
			resetForm: true,
			onChange(event) {
				if (event.paths[0] === 'date' || event.paths[0] === 'serviceId') {
					if (dateValue && $form.date && $form.serviceId) {
						fetchAvailableTimes(dateValue);
					}
				}
			},
			onResult: async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Programarea a fost modificată cu succes!');
					dateValue = undefined;
					await invalidateAll();
					isDialogOpen = false;
				} else {
					toast.error('A apărut o eroare la modificarea programării. Te rugăm să încerci din nou!');
				}
			}
		}
	);

	let dateValue = $state<DateValue | undefined>(
		parseDate(formatISO(row.original.start_time, { representation: 'date' }))
	);

	async function fetchAvailableTimes(date: DateValue) {
		isLoading = true;
		if (!$form.serviceId) return;

		const service = services.find((s) => s.value.toString() === $form.serviceId);
		if (!service) return;
		availableSlots = [];
		const dateString = date.toString();
		const duration = service.duration_minutes;

		try {
			const response = await fetch(`/api/available-times?date=${dateString}&duration=${duration}`);
			if (response.ok) {
				const data = await response.json();
				availableSlots = data.slots || [];
			}
		} catch (error) {
			availableSlots = [];
		} finally {
			isLoading = false;
		}
	}

	let isDialogOpen = $state(false);
	let contentRef = $state<HTMLElement | null>(null);

	let serviceTriggerContent = $derived(
		$form.serviceId
			? services.find((s) => s.value.toString() === $form.serviceId)?.label
			: 'Selectează un serviciu'
	);

	let statusTriggerContent = $derived(
		$form.status ? statuses.find((s) => s.value === $form.status)?.label : 'Selectează un status.'
	);

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});
</script>

<div>
	<Dialog.Root bind:open={isDialogOpen}>
		<Dialog.Trigger
			class="focus:bg-accent focus:text-accent-foreground hover:bg-accent relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-start text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
			>Editează programarea</Dialog.Trigger
		>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Editează programarea</Dialog.Title>
				<Dialog.Description>
					Editează detaliile programării. Apasă salvează când ai terminat.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/updateAppointment" method="POST" use:enhance class="space-y-4">
				<div class="space-y-2">
					<Label>Client</Label>
					<Input bind:value={clientName} disabled={true} />
				</div>
				<div class="space-y-2">
					<Label>Serviciu</Label>
					<Select.Root type="single" name="serviceId" bind:value={$form.serviceId}>
						<Select.Trigger class="w-full">
							{serviceTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Label>Servicii</Select.Label>
							{#each services as service (service.value)}
								<Select.Item value={service.value.toString()} label={service.label}>
									{service.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label>Data</Label>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({
										variant: 'outline',
										class: 'w-full justify-start text-left font-normal'
									}),
									!dateValue && 'text-muted-foreground'
								)}
							>
								<CalendarIcon />
								{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Alege o data'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0">
								<Calendar
									locale={'ro'}
									type="single"
									onValueChange={() => {
										if (dateValue) {
											$form.date = formatISO(dateValue.toDate(getLocalTimeZone()));
										}
									}}
									bind:value={dateValue}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
					<div class="space-y-2">
						<Label>Ora</Label>
						<Select.Root type="single" name="time" bind:value={$form.time}>
							<Select.Trigger disabled={isLoading} class="w-full">
								{isLoading ? 'Se încarcă...' : !$form.time ? 'Alege o oră' : $form.time}
							</Select.Trigger>
							<Select.Content>
								{#if availableSlots.length > 0}
									<div class="grid grid-cols-2 md:grid-cols-3">
										{#each availableSlots as slot}
											<Select.Item value={slot.available_slot}>{slot.available_slot}</Select.Item>
										{/each}
									</div>
								{:else if !isLoading}
									<Select.Label>Nicio oră disponibilă</Select.Label>
								{/if}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="space-y-2">
					<Label>Status</Label>
					<Select.Root type="single" name="status" bind:value={$form.status}>
						<Select.Trigger class="w-full">
							{statusTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Label>Status</Select.Label>
							{#each statuses as status (status.value)}
								<Select.Item value={status.value} label={status.label}>
									{status.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<input type="hidden" name="appointmentId" bind:value={$form.appointmentId} />
				<input type="hidden" name="duration" bind:value={duration} />
				<input type="hidden" name="date" bind:value={$form.date} />
				<Dialog.Footer>
					<Button type="submit">
						<Save class="h-5 w-5" />
						Salvează modificarile</Button
					>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
