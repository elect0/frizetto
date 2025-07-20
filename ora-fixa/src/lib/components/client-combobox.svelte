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

	type Props = {
		clients: Profile[];
		clientValue: string | undefined;
		services: Service[];
		serviceValue: string | undefined;
		dateValue: DateValue | undefined;
	};

	let {
		clientValue = $bindable(),
		clients,
		serviceValue = $bindable(),
		services,
		dateValue = $bindable()
	}: Props = $props();

	console.log(clients);

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let contentRef = $state<HTMLElement | null>(null);

	let selectedTime = $state<string | undefined>('');

	let availableSlots = $state<{ available_slot: string }[]>([]);

	let isLoading = $state(false);

	const selectedClientValue = $derived(
		clientValue
			? clients.find((client) => client.id.toString() === clientValue)?.full_name
			: 'Selectează un client...'
	);

	const serviceTriggerContent = $derived(
		services.find((f) => f.id.toString() === serviceValue)?.name ?? 'Alege un serviciu.'
	);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const df = new DateFormatter('ro-RO', {
		dateStyle: 'long'
	});

	async function fetchAvailableTimes(date: DateValue, serviceId: string) {
		isLoading = true;
		if (!serviceId) return;

		const service = services.find((s) => s.id.toString() === serviceId);
		if (!service) return;
		availableSlots = [];
		const dateString = date.toString();
		const duration = service.duration_minutes;

		try {
			const response = await fetch(`/api/available-times?date=${dateString}&duration=${duration}`);
			if (response.ok) {
				const data = await response.json();
				console.log(data.slots, 'pula');
				availableSlots = data.slots || [];
			}
		} catch (error) {
			console.error('A apărut o eroare în funcția fetch:', error);
			availableSlots = [];
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (serviceValue && dateValue) {
			fetchAvailableTimes(dateValue, serviceValue);
		}
	});
</script>

<form action="" method="POST" class="space-y-4">
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
									clientValue = client.id;
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
	{#if clientValue}
		<div class="space-y-4">
			<Label class="mb-2">Serviciu</Label>
			<Select.Root type="single" name="serviceId" bind:value={serviceValue}>
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
			<div class="grid grid-cols-2 gap-4">
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
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Alege o data'}
						</Popover.Trigger>
						<Popover.Content bind:ref={contentRef} class="w-auto p-0">
							<Calendar locale={'ro'} type="single" bind:value={dateValue} />
						</Popover.Content>
					</Popover.Root>
				</div>
				<div>
					<Label class="mb-2">Ora</Label>
					<Select.Root type="single" name="time" bind:value={selectedTime}>
						<Select.Trigger disabled={isLoading} class="w-full">
							{isLoading ? 'Se încarcă...' : !selectedTime ? 'Alege o oră' : selectedTime}
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
				<Label for='clientNotes' class='mb-2'>Adaugă o notiță (opțional)</Label>
				<Textarea
					id="clientNotes"
					name="clientNotes"
					class='text-sm'
					placeholder="Exemplu: prefer tuns mai scurt pe laterale, ajung cu 5 minute întârziere..."
				/>
			</div>
		</div>
		<div class="flex justify-end">
			<Button class="mt-1 cursor-pointer"><Save class="h-5 w-5" /> Salvează Programarea</Button>
		</div>
	{/if}
</form>
