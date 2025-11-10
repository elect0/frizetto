<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { User, Calendar, Handshake, MessageSquare } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import Separator from './ui/separator/separator.svelte';
	import type { Appointment } from './appointments-table.svelte';
	import { format } from 'date-fns';
	import { ro } from 'date-fns/locale';
	import Button from './ui/button/button.svelte';

	let { appointment }: { appointment: Appointment } = $props();

	const statusStyles = {
		confirmata: 'border-blue-200 bg-blue-100 text-blue-900',
		finalizata: 'border-green-200 bg-green-100 text-green-900',
		anulata: 'border-stone-200 bg-stone-100 text-stone-700',
		neprezentat: 'border-red-200 bg-red-100 text-red-900'
	};
	type StatusKey = keyof typeof statusStyles;
</script>

<Dialog.Content>
	<Dialog.Header>
		<Badge
			variant="secondary"
			class={statusStyles[appointment.status as StatusKey] || 'border-gray-200 bg-gray-100'}
		>
			{appointment.status}
		</Badge>
		<Separator />
		<div class="my-2 flex items-center gap-4">
			<User size={24} />
			<div class="space-y-1">
				<h2 class="text-xl font-bold">
					{appointment.profiles.full_name}
				</h2>
				<p class="text-md">
					{appointment.profiles.phone}
				</p>
			</div>
		</div>

		<Separator />

		<div class="my-1 flex items-center gap-4">
			<Calendar size={24} />
			<div class="space-y-1">
				<p class="text-md font-bold">
					{new Date(appointment.start_time).toLocaleTimeString()} - {new Date(
						appointment.end_time
					).toLocaleTimeString()}
				</p>
				<p class="text-md">
					{format(new Date(appointment.start_time), 'EEEE, d MMMM yyyy', { locale: ro })}
				</p>
			</div>
		</div>

		<div class="my-1 flex items-center gap-4">
			<Handshake size={24} />
			<div class="space-y-1">
				<div class="text-md font-bold">{appointment.services.name}</div>
				<div class="text-md">{appointment.services.price} RON</div>
			</div>
		</div>
		<div class="my-1 flex items-center gap-4">
			<MessageSquare size={24} />
			<p class="text-md">
				{appointment.client_notes ?? 'Utilizatorul nu a lasat o notita acestei programari.'}
			</p>
		</div>
		<Separator />
		<div class="my">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Button variant="default">Marcheaza ca finalizata</Button>
				<Button variant="destructive">Anuleaza programarea</Button>
			</div>
		</div>
	</Dialog.Header>
</Dialog.Content>
