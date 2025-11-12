<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import { Calendar, Interaction, TimeGrid } from '@event-calendar/core';
	import { format, parseISO } from 'date-fns';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import NotificationsButton from '$lib/components/notifications-button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { type Appointment } from '$lib/components/appointments-table.svelte';
	import AppointmentInfo from '$lib/components/appointment-info.svelte';

	let { data } = $props();
	let kpis = $derived(data.kpis);
	let weeklyRevenue = $derived(data.weeklyRevenue);
	let showModal = $state(false);
	let currentAppointment = $state<Appointment | null>(null);

	let events = $derived(
		data.appointments
			.filter((appointment) => appointment.status != 'anulata')
			.map((appointment) => {
				return {
					id: appointment.id.toString(),
					start: new Date(appointment.start_time),
					end: new Date(appointment.end_time),
					title: `${appointment.services.name} - ${appointment.profiles.full_name}`,
					backgroundColor:
						appointment.status === 'confirmata'
							? '#3b82f6'
							: appointment.status === 'finalizata'
								? '#22c55e'
								: appointment.status === 'neprezentat'
									? '#ef4444'
									: appointment.status === 'anulata'
										? '#6b7280'
										: '#6b7280'
				};
			})
	);
	let options = $derived({
		view: 'timeGridDay',
		date: page.url.searchParams.get('date') ? page.url.searchParams.get('date') : new Date(),
		events: events,
		slotMinTime: '08:00:00',
		slotMaxTime: '18:00:00',
		slotDuration: '00:15:00',
		datesSet: function (info: any) {
			goto(`/admin/dashboard?date=${format(info.start, 'yyyy-MM-dd')}`, {
				noScroll: true,
				keepFocus: true
			});
		},
		dateClick: function (info: any) {
			console.log(info);
			// TODO: Implement dateClick functionality to add event
		},
		locale: 'ro',
		allDayContent: 'Ora',
		eventClick: function (info: any) {
			currentAppointment =
				data.appointments.find((appointment) => appointment.id === parseInt(info.event.id)) ?? null;
			showModal = !!currentAppointment;
		},
		eventLongPressDelay: 10,
		buttonText: function (next: any) {
			return { ...next, today: 'Astazi' };
		}
	});
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards {kpis} />
			<div class="px-4 lg:px-6">
				<NotificationsButton />
				<ChartAreaInteractive {weeklyRevenue} />
			</div>
			<div class="my-8"></div>
			<div class="px-4 lg:px-6">
				{#if showModal}
					{@render actions(currentAppointment)}
				{/if}
				<!-- <DataTable -->
				<!-- 	form={data.form} -->
				<!-- 	services={data.services} -->
				<!-- 	clients={data.clients} -->
				<!-- 	appointments={data.appointments} -->
				<!-- 	date={data.currentDate} -->
				<!-- /> -->
				<Calendar plugins={[TimeGrid, Interaction]} {options} />
			</div>
		</div>
	</div>
</div>

{#snippet actions(appointment: Appointment)}
	<Dialog.Root open={showModal} onOpenChangeComplete={() => (showModal = !showModal)}>
		<AppointmentInfo {appointment} bind:showModal />
	</Dialog.Root>
{/snippet}
