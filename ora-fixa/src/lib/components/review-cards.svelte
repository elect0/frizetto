<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Smile, Meh, Frown } from '@lucide/svelte';
	import Progress from './ui/progress/progress.svelte';
</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-3"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Pozitive</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				Excelent
			</Card.Title>
			<Smile size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={(3 / 5) * 100} />
		</Card.Content>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Neutre</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				Bun
			</Card.Title>
			<Meh size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={(1 / 5) * 100} />
		</Card.Content>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Negative</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				Slab
			</Card.Title>
			<Frown size={48} class="mt-2" />
		</Card.Header>
		<Card.Content class="flex-col items-start gap-1.5 text-sm">
			<Progress value={(1 / 5) * 100} />
		</Card.Content>
	</Card.Root>
</div>
