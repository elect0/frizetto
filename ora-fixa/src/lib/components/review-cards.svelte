<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Smile, Meh, Frown } from '@lucide/svelte';
	import Progress from './ui/progress/progress.svelte';
	import type { Review } from './reviews-table.svelte';

	let { reviews }: { reviews: Review[] } = $props();

	let positiveReviewsPercentage = $derived(
		(reviews.filter((review) => review.mood === 'smile' || review.mood === 'laugh').length /
			reviews.length) *
			100
	);
	let neutralReviewsPercentage = $derived(
		(reviews.filter((review) => review.mood === 'meh').length / reviews.length) * 100
	);
	let negativeReviewsPercentage = $derived(
		(reviews.filter((review) => review.mood === 'frown' || review.mood === 'angry').length /
			reviews.length) *
			100
	);
</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-3"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Pozitive</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
     {#if positiveReviewsPercentage < 50}
					De îmbunătățit
				{:else if negativeReviewsPercentage > 50 && negativeReviewsPercentage <= 75}
					Foarte Bun
				{:else}
					Excelent
				{/if}
      </Card.Title>
			<Smile size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={positiveReviewsPercentage} />
		</Card.Content>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Neutre</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{#if negativeReviewsPercentage < 15}
					Scăzut
				{:else if negativeReviewsPercentage > 15 && negativeReviewsPercentage <= 30}
					Moderat
				{:else}
					Ridicat
				{/if}
			</Card.Title>
			<Meh size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={neutralReviewsPercentage} />
		</Card.Content>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Negative</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{#if negativeReviewsPercentage < 5}
					Bun
				{:else if negativeReviewsPercentage > 5 && negativeReviewsPercentage <= 15}
					Atenție
				{:else}
					Critic
				{/if}
			</Card.Title>
			<Frown size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={negativeReviewsPercentage} />
		</Card.Content>
	</Card.Root>
</div>
