<script lang="ts">
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t lg:px-6"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Incasari Totale</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
				1,250 lei (lunar)
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<TrendingUpIcon />
					+12.5%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				In crestere luna aceasta <TrendingUpIcon class="size-4" />
			</div>
			<div class="text-muted-foreground">Lorem ipsum dolor sit.</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Clienti noi</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>14 (lunar)</Card.Title
			>
			<Card.Action>
				<Badge variant="outline">
					<TrendingDownIcon />
					-20%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				Scadere 20% in aceasta perioada <TrendingDownIcon class="size-4" />
			</div>
			<div class="text-muted-foreground">Lorem, ipsum dolor sit.</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Rata neprezentarii</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
				8% (lunar)
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<TrendingUpIcon />
					+12.5%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				Mentinerea clientilor puternica <TrendingUpIcon class="size-4" />
			</div>
			<div class="text-muted-foreground">Lorem ipsum dolor sit.</div>
		</Card.Footer>
	</Card.Root>
	<!-- <Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Growth Rate</Card.Description>
			<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
				4.5%
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<TrendingUpIcon />
					+4.5%
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				Steady performance increase <TrendingUpIcon class="size-4" />
			</div>
			<div class="text-muted-foreground">Meets growth projections</div>
		</Card.Footer>
	</Card.Root> -->
</div>
