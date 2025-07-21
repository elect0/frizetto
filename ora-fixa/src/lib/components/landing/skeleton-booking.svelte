<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<section id="booking" class="py-24 text-center">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mx-auto max-w-4xl">
			<div class="mb-12 flex flex-col items-center space-y-8">
				<Skeleton class="h-8 w-32 md:h-9 md:w-36" />
				<Skeleton class="md:w-140 w-85 h-9 md:h-12" />
				<Skeleton class="md:w-160 w-90 h-20 md:h-7" />
				<Skeleton class="md:w-224 w-90 h-150 md:h-100" />
			</div>
		</div>
	</div>
</section>
