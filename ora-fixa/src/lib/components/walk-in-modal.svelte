<script lang="ts">
	import { CalendarIcon, Save } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { Service } from '$lib/types/supabase';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import { walkInSchema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import type { Client } from './clients-table.svelte';
	import type { Row } from '@tanstack/table-core';

	let dateValue = $state<DateValue>();

	let { services, row }: { services: Service[]; row: Row<Client> } = $props();

	const { form, enhance } = superForm(
		defaults(
			{
				clientId: row.original.id
			},
			zod(walkInSchema)
		),
		{
			validators: zod(walkInSchema),
			invalidateAll: true,
			resetForm: true,
			onChange(event) {
				if (event.paths[0] === 'date' || event.paths[0] === 'serviceId') {
					if (dateValue && $form.date && $form.serviceId) {
						fetchAvailableTimes(dateValue);
					}
				}
			},
			onResult: ({ result }) => {
				if (result.type === 'success') {
					toast.success('Programarea a fost adăugată cu succes!');
					dateValue = undefined;
					isOpen = false;
				} else {
					toast.error('A apărut o eroare la adăugarea programării. Te rugăm să încerci din nou!');
				}
			}
		}
	);

	let isOpen = $state(false);
	let contentRef = $state<HTMLElement | null>(null);

	let availableSlots = $state<{ available_slot: string }[]>([]);

	let isLoading = $state(false);

	const serviceTriggerContent = $derived(
		services.find((s) => s.id.toString() === $form.serviceId)?.name ?? 'Alege un serviciu.'
	);
	let duration = $derived.by(() =>
		services.find((s) => s.id.toString() === $form.serviceId)?.duration_minutes.toString()
	);

	async function fetchAvailableTimes(date: DateValue) {
		isLoading = true;
		if (!$form.serviceId) return;

		const service = services.find((s) => s.id.toString() === $form.serviceId);
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

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger
		class="focus:bg-accent focus:text-accent-foreground hover:bg-accent relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-start text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		>Adaugă programare</Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Adaugă Programare Nouă</Dialog.Title>
			<Dialog.Description>
				Completează detaliile pentru a adăuga o nouă programare în calendar. Asigură-te că toate
				informațiile sunt corecte înainte de a salva.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/addWalkInAppointment" method="POST" use:enhance class="space-y-4">
			<Label for="clientId">Client</Label>
			<Input value={row.original.full_name} disabled={true} />
			<div class="space-y-4">
				<Label class="mb-2">Serviciu</Label>
				<Select.Root type="single" name="serviceId" bind:value={$form.serviceId}>
					<Select.Trigger class="justify-cet w-full">
						{serviceTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each services as service (service.id)}
							<Select.Item value={service.id.toString()} label={service.name}>
								{service.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<Label class="mb-2">Data</Label>
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
								{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Alege o dată'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0">
								<Calendar
									locale={'ro'}
									type="single"
									onValueChange={() => {
										if (dateValue) {
											$form.date = dateValue.toDate(getLocalTimeZone()).toISOString();
										}
									}}
									bind:value={dateValue}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
					<div>
						<Label class="mb-2">Ora</Label>
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
				<div>
					<Label for="clientNotes" class="mb-2">Adaugă o notiță (opțional)</Label>
					<Textarea
						id="clientNotes"
						name="clientNotes"
						bind:value={$form.clientNotes}
						class="text-sm"
						placeholder="Exemplu: prefer tuns mai scurt pe laterale, ajung cu 5 minute întârziere..."
					/>
				</div>
			</div>
			<div class="flex justify-end">
				<input type="hidden" name="clientId" bind:value={$form.clientId} />
				<input type="hidden" name="duration" bind:value={duration} />
				<input type="hidden" name="date" bind:value={$form.date} />
				<Button type="submit" class="mt-1 cursor-pointer"
					><Save class="h-5 w-5" /> Salvează Programarea</Button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
