<script lang="ts">
	import ReviewCards from '$lib/components/review-cards.svelte';
	import ReviewsTable from '$lib/components/reviews-table.svelte';
	let { data } = $props();
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<h1 class="px-4 lg:px-6 text-3xl font-medium">Review-uri</h1>
			<ReviewCards reviews={data.reviews} />
			<div class="w-full px-4 lg:px-6">
				<!-- <DataTable -->
				<!-- 	form={data.form} -->
				<!-- 	services={data.services} -->
				<!-- 	clients={data.clients} -->
				<!-- 	appointments={data.appointments} -->
				<!-- 	date={data.currentDate} -->
				<!-- /> -->
				<ReviewsTable reviews={data.reviews} />
			</div>
		</div>
	</div>
</div>
