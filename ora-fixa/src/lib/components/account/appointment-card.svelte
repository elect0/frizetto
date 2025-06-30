<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Clock } from '@lucide/svelte';
	import { Scissors, Calendar, X, DollarSign, Sparkles, Star } from 'lucide-svelte';
	import Badge from '../ui/badge/badge.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Button from '../ui/button/button.svelte';

	export let appointment: {
		id: number;
		start_time: string;
		end_time: string;
		status: string;
		created_at: string;
		services: {
			id: string;
			name: string;
			duration_minutes: string;
			price: number;
		};
	};

	export let favoriteServiceId: number | null;

	const startTime = new Date(appointment.start_time);

	const formattedDate = new Intl.DateTimeFormat('ro-RO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long'
	}).format(startTime);

	const formattedTime = new Intl.DateTimeFormat('ro-RO', {
		hour: '2-digit',
		minute: '2-digit'
	}).format(startTime);

	const isUpcoming = startTime > new Date();

	$: isFavorite = parseInt(appointment.services?.id, 10) === favoriteServiceId;

	const statusStyles = {
		confirmata: 'border-blue-200 bg-blue-100 text-blue-900',
		finalizata: 'border-green-200 bg-green-100 text-green-900',
		anulata: 'border-stone-200 bg-stone-100 text-stone-700',
		neprezentat: 'border-red-200 bg-red-100 text-red-900'
	};
	type StatusKey = keyof typeof statusStyles;

	console.log(isUpcoming);

	const format = (date: Date) =>
		date.getFullYear() +
		'-' +
		String(date.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(date.getDate()).padStart(2, '0') +
		' ' +
		String(date.getHours()).padStart(2, '0') +
		':' +
		String(date.getMinutes()).padStart(2, '0');
</script>

<Card.Root
	class="mx-auto w-full max-w-2xl border-stone-200 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
>
	<Card.Header>
		<div class="flex items-start justify-between">
			<div class="flex items-center space-x-4">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-600 transition-colors hover:bg-amber-600"
				>
					<Scissors class="h-7 w-7 text-white" />
				</div>
				<div class="space-y-1">
					<div class="flex items-center">
						<h3 class="text-xl font-bold text-stone-900">{appointment.services.name}</h3>
						{#if !isUpcoming || appointment.status !== 'confirmata'}
							<form method="POST" action="?/setFavorite">
								<input type="hidden" name="serviceId" value={appointment.services?.id} />
								<Button
									type="submit"
									variant="ghost"
									size="icon"
									class="ml-2 mt-1 h-5 w-5 cursor-pointer"
									aria-label="Setează ca favorit"
								>
									<Star
										class={`h-6 w-6 transition-all duration-200 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}
									/>
								</Button>
							</form>
						{/if}
					</div>
					<p class="font-medium text-slate-600">Serviciu Premium</p>
					<div class="flex items-center text-sm text-stone-500">
						<Clock class="mr-1 h-4 w-4" />
						{appointment.services.duration_minutes} minute
					</div>
				</div>
			</div>
			<Badge
				variant="secondary"
				class={statusStyles[appointment.status as StatusKey] || 'border-gray-200 bg-gray-100'}
			>
				{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
			</Badge>
		</div>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="flex items-center space-x-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
				<div class="rounded-lg bg-amber-100 p-2">
					<Calendar class="h-5 w-5 text-amber-600" />
				</div>
				<div>
					<p class="text-sm font-medium text-stone-600">Data</p>
					<p class="text-lg font-semibold text-stone-900">{formattedDate}</p>
				</div>
			</div>
			<div class="flex items-center space-x-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
				<div class="rounded-lg bg-amber-100 p-2">
					<Clock class="h-5 w-5 text-amber-600" />
				</div>
				<div>
					<p class="text-sm font-medium text-stone-600">Ora</p>
					<p class="text-lg font-semibold text-stone-900">{formattedTime}</p>
				</div>
			</div>
			<div class="flex items-center space-x-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
				<div class="rounded-lg bg-amber-100 p-2">
					<DollarSign class="h-5 w-5 text-amber-600" />
				</div>
				<div>
					<p class="text-sm font-medium text-stone-600">Pret</p>
					<p class="text-lg font-semibold text-stone-900">{appointment.services.price} lei</p>
				</div>
			</div>
		</div>
		<Separator class="bg-stone-200" />
		<div class="grid grid-cols-1 items-center gap-4 pt-2 md:grid-cols-2">
			<div class="text-sm text-stone-500">
				<p>ID Programare: {appointment.id}</p>
				<p>Programat pe: {format(new Date(appointment.created_at))}</p>
			</div>
			{#if isUpcoming && appointment.status === 'confirmata'}
				<AlertDialog.Root>
					<AlertDialog.Trigger class="flex justify-end">
						<Button
							variant="destructive"
							size="lg"
							class="cursor-pointer bg-red-600 text-white hover:bg-red-700"
						>
							<X className="h-4 w-4 mr-2" />
							Anuleaza Programarea
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Ești absolut sigur?</AlertDialog.Title>
							<AlertDialog.Description>
								Această acțiune nu poate fi anulată. Vei elibera acest interval orar și va trebui să
								faci o nouă programare dacă te răzgândești.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer class="mt-1 md:mt-0">
							<AlertDialog.Cancel>Înapoi</AlertDialog.Cancel>
							<form action="?/cancel" method="POST">
								<input type="hidden" name="appointmentId" value={appointment.id} />
								<Button type="submit" variant="destructive" class="w-full">Da, anulează</Button>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			{:else}
				<div class="ml-auto">
					<form method="POST" action="?/rebook">
						<input type="hidden" name="serviceId" value={appointment.services?.id} />
						<Button type="submit" class="cursor-pointer" size="lg">
							<Sparkles />
							Programează din nou
						</Button>
					</form>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
