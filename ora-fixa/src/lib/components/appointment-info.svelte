<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { enhance } from '$app/forms';

	import { toast } from 'svelte-sonner';
	import Button from './ui/button/button.svelte';
	import { Check, Scissors, Timer, UserX, X } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import type { Appointment } from './appointments-table.svelte';
	import { parsePhoneNumber } from 'libphonenumber-js/min';
	import Separator from './ui/separator/separator.svelte';
	import { invalidateAll } from '$app/navigation';

	let { appointment, showModal = $bindable() }: { appointment: Appointment; showModal: boolean } =
		$props();

	const fullAppointmentDate = $derived(
		new Date(appointment.start_time).toLocaleDateString('ro-RO', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	const startAppointmentHour = $derived(
		new Date(appointment.start_time)
			.toLocaleTimeString('ro-RO', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
			.replace('a.m', 'AM')
			.replace('p.m', 'PM')
	);

	const endAppointmentHOur = $derived(
		new Date(appointment.end_time)
			.toLocaleTimeString('ro-RO', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
			.replace('a.m', 'AM')
			.replace('p.m', 'PM')
	);
</script>

<Dialog.Content
	class="bg-[linear-gradient(to_bottom,theme(colors.amber.100)_0%,theme(colors.white)_30%)]"
>
	<h1 class="text-md font-semibold text-amber-600">
		{startAppointmentHour} - {endAppointmentHOur}
	</h1>

	<div class="space-y-1.5">
		<h1 class="text-2xl font-semibold text-stone-900">{appointment.profiles.full_name}</h1>
		<p class="text-sm text-stone-400">
			{parsePhoneNumber(appointment.profiles.phone, 'RO').formatInternational()}
		</p>
	</div>

	<div class="flex gap-2">
		<Badge variant="outline" class="p-2">
			<Timer />
			{appointment.status}</Badge
		>
	</div>

	<Separator />
	<p class="text-md font-semibold">Notite</p>
	<p class="text-md">
		{appointment.client_notes ?? 'Nu a fost adăugată nicio notiță pentru această programare.'}
	</p>

	<Separator />

	<div class="mt-2 rounded-md border-1 border-stone-200 bg-stone-50 p-4">
		<h2 class="text-md mb-2 font-semibold md:text-lg">Serviciu Programat</h2>
		<div class="mb-2 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
				>
					<Scissors class="h-5 w-5" />
				</div>
				<div class="flex flex-col">
					<span class="text-md font-medium">{appointment.services.name}</span>
					<div class="text-sm text-stone-400">{appointment.services.duration_minutes} minute</div>
				</div>
			</div>
			<span class="text-md font-semibold text-stone-700">{appointment.services.price} RON</span>
		</div>
	</div>

	<Separator />

	<div class="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
				<form
					action="?/markAsComplete"
      class='w-full'
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.success('Programarea a fost marcată ca finalizată cu succes.');
								await invalidateAll();
							} else {
								toast.error('Eroare:', {
									description: 'programarea nu a putut fi marcată ca finalizată.'
								});
							}
						};
					}}
				>
					<input type="hidden" name="appointmentId" value={appointment.id} />
				
		<Button type="submit" variant="default" class='w-full'><Check /> Finalizata</Button>
    </form>

		<form
			class="w-full"
			action="?/cancelAppointment"
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Programarea a fost anulată cu succes!');
						await invalidateAll();
						setTimeout(() => {
							showModal = false;
						}, 500);
					} else {
						toast.error('Eroare:', {
							description: 'programarea nu a putut fi anulată!'
						});
					}
				};
			}}
		>
			<input type="hidden" name="appointmentId" value={appointment.id} />
			<Button type="submit" variant="secondary" class="w-full text-red-500"><X /> Anuleaza</Button>
		</form>

		<form
			action="?/markAsNoShow"
			class="w-full"
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						toast.success('Programarea a fost marcată ca neprezentată.');
						await invalidateAll();
					} else {
						toast.error('Eroare:', {
							description: 'programarea nu a putut fi marcată ca neprezentată.'
						});
					}
				};
			}}
		>
			<input type="hidden" name="appointmentId" value={appointment.id} />
			<Button type="submit" class="w-full" variant="secondary"><UserX /> Neprezentat</Button>
		</form>
	</div>
</Dialog.Content>
