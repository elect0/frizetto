<script lang="ts">
	import Separator from '../ui/separator/separator.svelte';
</script>

<div class="mt-10">
	<Separator class="mb-4 bg-stone-800"/>
	<div class="grid grid-cols-1 md:grid-cols-2">
		<p>Copyright (c) {new Date().getFullYear()} Frizetto. Toate drepturile rezervate.</p>
		<div class="flex space-x-2 justify-end">
			<a href="/poltica-confidentialitate" class='underline'> Politică de confidențialitate </a>
			<Separator orientation="vertical" />
			<a href="/termenii-conditii" class='underline'> Termeni și condiții </a>
		</div>
	</div>
</div>
