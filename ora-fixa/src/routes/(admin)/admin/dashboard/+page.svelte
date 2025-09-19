<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	let { data } = $props();
	let kpis = $derived(data.kpis);
	let weeklyRevenue = $derived(data.weeklyRevenue);
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards {kpis} />
			<div class="px-4 lg:px-6">
				<ChartAreaInteractive {weeklyRevenue} />
			</div>
			<div class="px-4 lg:px-6">
				<DataTable
					form={data.form}
					services={data.services}
					clients={data.clients}
					appointments={data.appointments}
					date={data.currentDate}
				/>
			</div>
		</div>
	</div>
</div>
