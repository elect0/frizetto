<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { User, Star, Calendar, Handshake, MessageSquare, Check, X, TriangleAlert } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import Separator from './ui/separator/separator.svelte';
	import type { Appointment } from './appointments-table.svelte';
	import { format } from 'date-fns';
	import { ro } from 'date-fns/locale';
	import Button from './ui/button/button.svelte';

	let { appointment }: { appointment: Appointment } = $props();

	const statusStyles = {
		confirmata: 'border-blue-200 bg-blue-100 text-blue-900 h-min',
		finalizata: 'border-green-200 bg-green-100 text-green-900 h-min',
		anulata: 'border-stone-200 bg-stone-100 text-stone-700 h-min',
		neprezentat: 'border-red-200 bg-red-100 text-red-900 h-min'
	};
	type StatusKey = keyof typeof statusStyles;
</script>

<Dialog.Content>
	<Dialog.Header>
		<h1 class="text-xl">Detalii programare Nr. {appointment.id}</h1>
	</Dialog.Header>

	<Separator />

	<h3 class="text-gray-500">Detalii client</h3>

	<div class="rounded-md border-1 border-gray-200 p-4">
		<div class="flex items-center gap-5">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-center text-white"
			>
				Z
			</div>
			<div class="flex justify-between w-full items-center">
				<div class="space-y-0.5">
					<p class="text-sm text-gray-500">Nume client</p>
					<h3 class="text-md">{appointment.profiles.full_name}</h3>
				</div>
				<Badge
					variant="secondary"
					class={statusStyles[appointment.status as StatusKey]|| 'border-gray-200 bg-gray-100'}
				>
					{appointment.status}
				</Badge>
			</div>
		</div>
		<div class="mt-2 rounded-md bg-gray-100 p-4">
			<p class="text-md text-gray-500">Notes</p>
			<p>{appointment.client_notes}</p>
		</div>
	</div>

	<h3 class="text-gray-500">Detalierea serviciului</h3>
	<div class="rounded-md border-1 border-gray-200 p-4">
		<div class="flex justify-between">
			<p class="text-gray-500">{appointment.services.name}</p>
			<p>{appointment.services.price} Lei</p>
		</div>
	</div>

	<h3 class="text-gray-500">Detalii contact</h3>
	<div class="rounded-md border-1 border-gray-200 p-4">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex items-center">
				<div
					class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
				>
					<Star class="h-5 w-5" />
				</div>
				<div>
					<p class="text-sm text-stone-500">Număr de telefon</p>
					<p class="text-sm font-semibold text-stone-800">
						{appointment.profiles.phone}
					</p>
				</div>
			</div>
			<div class="flex items-center">
				<div
					class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
				>
					<Star class="h-5 w-5" />
				</div>
				<div>
					<p class="text-sm text-stone-500">Adresă Email:</p>
					<p class="text-sm font-semibold text-stone-800">
						{appointment.profiles.email}
					</p>
				</div>
			</div>
		</div>
	</div>
  <Separator />
  <div class="grid md:grid-cols-3 grid-cols-1 gap-3">
    <Button variant="default" class='items-center'><Check /> Finalizat</Button>
    <Button variant="destructive" class='items-center'><X /> Anuleaza</Button>
    <Button variant="secondary" class='items-center'><TriangleAlert /> Absent</Button>
  </div>
</Dialog.Content>
