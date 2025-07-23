<script lang="ts">
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	let { kpis } = $props();
</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-1 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t lg:px-6"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Incasari Totale</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
				{kpis.revenue.count} (lunar)
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<!-- <TrendingUpIcon /> -->
					{#if kpis.revenue.percentage.startsWith('-')}
						<TrendingDownIcon />
					{:else}
						<TrendingUpIcon />
					{/if}
					{kpis.revenue.percentage}%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				In {kpis.revenue.percentage.startsWith('-') ? 'scadere' : 'crestere'} luna aceasta {#if kpis.revenue.percentage.startsWith('-')}
					<TrendingDownIcon class="size-4" />
				{:else}
					<TrendingUpIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">Afișează suma totală încasată în luna curentă.</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Clienti noi</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>{kpis.newClients.count} (lunar)</Card.Title
			>
			<Card.Action>
				<Badge variant="outline">
					{#if kpis.newClients.percentage.startsWith('-')}
						<TrendingDownIcon />
					{:else}
						<TrendingUpIcon />
					{/if}
					{kpis.newClients.percentage}%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{kpis.newClients.percentage.startsWith('-') ? 'Scadere' : 'Crestere'}
				{kpis.newClients.percentage.split('-')[1]}% in aceasta perioada {#if kpis.newClients.percentage.startsWith('-')}
					<TrendingDownIcon class="size-4" />
				{:else}
					<TrendingUpIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">Numărul utilizatorilor care s-au înregistrat în această lună.</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Rata neprezentarii</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
				{kpis.noShows.count} (lunar)
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					{#if kpis.noShows.percentage.startsWith('-')}
						<TrendingUpIcon />
					{:else}
						<TrendingDownIcon />
					{/if}
					{kpis.noShows.percentage}%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				Mentinerea clientilor {kpis.noShows.percentage.startsWith('-') ? 'Puternica' : 'Slaba'}
				{#if kpis.noShows.percentage.startsWith('-')}
					<TrendingUpIcon class="size-4" />
				{:else}
					<TrendingDownIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">Procentul rezervărilor neconfirmate sau neprezentate.</div>
		</Card.Footer>
	</Card.Root>
</div>
