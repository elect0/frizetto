<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import { Calendar, Interaction, TimeGrid } from '@event-calendar/core';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
	let kpis = $derived(data.kpis);
	let weeklyRevenue = $derived(data.weeklyRevenue);

	let events = $derived(
		data.appointments
			.filter((appointment) => appointment.status != 'anulata')
			.map((appointment) => {
				return {
					id: appointment.id.toString(),
					start: new Date(appointment.start_time),
					end: new Date(appointment.end_time),
					title: `${appointment.services.name} - ${appointment.profiles.full_name}`,
					backgroundColor: ''
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
			console.log(format(info.start, 'yyyy-MM-dd'));
			goto(`/admin/dashboard?date=${format(info.start, 'yyyy-MM-dd')}`, {
				noScroll: true,
				keepFocus: true
			});
		},
		locale: 'ro',
		allDayContent: 'Ora',
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
				<ChartAreaInteractive {weeklyRevenue} />
			</div>
			<div class="my-8"></div>
			<div class="px-4 lg:px-6">
				<DataTable
					form={data.form}
					services={data.services}
					clients={data.clients}
					appointments={data.appointments}
					date={data.currentDate}
				/>
				<Calendar plugins={[TimeGrid, Interaction]} {options} />
			</div>
		</div>
	</div>
</div>
