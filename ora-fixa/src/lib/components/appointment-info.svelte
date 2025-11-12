<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

  import Button from './ui/button/button.svelte';
	import { Check, Scissors, Timer, UserX, X } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import type { Appointment } from './appointments-table.svelte';
	import { parsePhoneNumber } from 'libphonenumber-js/min';
	import Separator from './ui/separator/separator.svelte';

	let { appointment }: { appointment: Appointment } = $props();

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
		<Badge variant="outline"  class="p-2">
			<Timer />
			{appointment.status}</Badge
		>
		
	</div>

	<Separator />
	<p class="text-md font-semibold">Notite</p>
	<p class="text-md">{appointment.client_notes ?? "Nu a fost adăugată nicio notiță pentru această programare."}</p>

	<Separator />

  <div class="border-stone-200 border-1 bg-stone-50 rounded-md mt-2 p-4">
    <h2 class="text-md md:text-lg font-semibold mb-2">Serviciu Programat</h2>
      <div class="flex justify-between items-center mb-2">
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

  <div class="grid md:grid-cols-3 grid-cols-1 gap-3 mt-2">
    <Button variant="default"><Check /> Finalizata</Button>
    <Button variant="secondary" class="text-red-500"><X /> Anuleaza</Button>
    <Button variant="secondary"><UserX /> Neprezentat</Button>
  </div>

</Dialog.Content>
