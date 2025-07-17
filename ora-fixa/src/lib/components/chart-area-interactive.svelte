<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { Area, AreaChart } from 'layerchart';

	let { weeklyRevenue } = $props<{ weeklyRevenue: { date: Date; lei: number }[] }>();

	const chartData: { date: Date; lei: number }[] = weeklyRevenue.map((day: {date: Date, lei: number}) => ({
		date: new Date(day.date),
		lei: day.lei
	}));

	const filteredData = $derived.by(() => {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		sevenDaysAgo.setHours(0, 0, 0, 0);

		return chartData.filter((item) => item.date >= sevenDaysAgo);
	});

	const chartConfig = {
		lei: { label: 'Lei', color: 'var(--primary)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Încasări Totale Săptămâna</Card.Title>
		<Card.Description>
			<span class="@[540px]/card:block hidden"> Încasările pentru ultima săptămână </span>
			<span class="@[540px]/card:hidden">Ultimele 7 zile</span>
		</Card.Description>
	</Card.Header>
	<Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
		<Chart.Container
			config={chartConfig}
			class="aspect-auto h-[250px] w-full"
		>
			<AreaChart
				legend
				data={filteredData}
				x="date"
				xScale={scaleUtc()}
				series={[
					{
						key: 'lei',
						label: 'lei',
						color: chartConfig.lei.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween',
					},
					xAxis: {
						ticks: 7,
						format: (v) => {
							return v.toLocaleDateString('ro-RO', {
								month: 'short',
								day: 'numeric'
							});
						}
					},
					yAxis: { format: () => '' }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					<defs>
						<linearGradient id="fillLei" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-primary)" stop-opacity={1} />
							<stop offset="95%" stop-color="var(--color-primary)" stop-opacity={0.1} />
						</linearGradient>
					</defs>
					{#each series as s, i (s.key)}
						<Area {...getAreaProps(s, i)} fill={s.key === 'lei' ? 'url(#fillLei)' : ''} />
					{/each}
				{/snippet}

				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('ro-RO', {
								month: 'short',
								day: 'numeric'
							});
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>