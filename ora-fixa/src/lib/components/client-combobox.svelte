<script lang="ts">
	import { CheckIcon, ChevronsUpDownIcon, CalendarIcon, Save } from '@lucide/svelte';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { Profile, Service } from '$lib/types/supabase';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';
	import { walkInSchema } from '$lib/schemas';
	import { z } from 'zod';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { formatISO } from 'date-fns';

	type Props = {
		clients: Profile[];
		clientValue: string | undefined;
		services: Service[];
		serviceValue: string | undefined;
		dateValue: DateValue | undefined;
		walkInForm: SuperValidated<z.infer<typeof walkInSchema>>;
	};

	let {
		clientValue = $bindable(),
		clients,
		serviceValue = $bindable(),
		services,
		dateValue = $bindable(),
		walkInForm
	}: Props = $props();

	const { form, errors, enhance } = superForm(walkInForm, {
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
			} else {
				form;
				toast.error('A apărut o eroare la adăugarea programării. Te rugăm să încerci din nou!');
			}
		}
	});

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let contentRef = $state<HTMLElement | null>(null);

	let availableSlots = $state<{ available_slot: string }[]>([]);

	let isLoading = $state(false);

	const selectedClientValue = $derived(
		$form.clientId
			? clients.find((client) => client.id.toString() === $form.clientId)?.full_name
			: 'Selectează un client...'
	);

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

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});
</script>

<form action="?/addWalkInAppointment" method="POST" use:enhance class="space-y-4">
	<Popover.Root bind:open>
		<Label class="mb-2">Alege un client</Label>
		<Popover.Trigger
			name="client"
			bind:ref={triggerRef}
			class={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-between')}
		>
			{selectedClientValue || 'Selectează un client...'}
			<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
		</Popover.Trigger>
		<Popover.Content align="start" class="max-w-xl p-0">
			<Command.Root>
				<Command.Input placeholder="Caută un client..."></Command.Input>
				<Command.List>
					<Command.Empty>Nu am găsit niciun client...</Command.Empty>
					<Command.Group>
						{#each clients as client}
							<Command.Item
								value={client.id}
								onSelect={() => {
									$form.clientId = client.id;
									closeAndFocusTrigger();
								}}
							>
								<CheckIcon
									class={cn('mr-2 size-4', clientValue !== client.id && 'text-transparent')}
								/>
								{client.full_name}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	{#if $form.clientId}
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
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Alege o data si o ora.'}
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
			<input type="hidden" name="duration" bind:value={duration} />
			<input type="hidden" name="clientId" bind:value={$form.clientId} />
			<input type="hidden" name="date" bind:value={$form.date} />
			<Button type="submit" class="mt-1 cursor-pointer"
				><Save class="h-5 w-5" /> Salvează Programarea</Button
			>
		</div>
	{/if}
</form>
