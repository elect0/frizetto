<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft, Home } from 'lucide-svelte';
</script>

<div class="min flex h-screen items-center justify-center bg-stone-50 p-4">
	<div class="w-full max-w-md space-y-8 text-center">
		<div class="space-y-4">
			<h1 class="text-8xl font-light tracking-tight text-amber-500">404</h1>
			<div class="mx-auto h-px w-12 bg-amber-500"></div>
		</div>
		<div class="space-y-3">
			<div class="text-xl font-medium text-stone-900">Pagina nu a fost găsită.

</div>
			<p class="leading-relaxed text-stone-600">
                Pagin pe care o cauți nu există sau a fost mutată.
			</p>
		</div>
		<div class="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
			<Button variant="default">
				<a href="/" class="flex items-center gap-2">
					<Home class="h-4 w-4" />
					Acasa
				</a>
			</Button>
			<Button variant="ghost" onclick={() => window.history.back()}>
				<div class="flex items-center gap-2">

                    <ArrowLeft class="h-4 w-4" />
					Inapoi
                </div>
				
			</Button>
		</div>
		<div class="border-t border-stone-200 pt-8">
			<div class="flex justify-center gap-6 text-sm">
				<a href="/help" class="text-stone-500 transition-colors hover:text-amber-600">Ajutor</a>
				<a href="/#contact" class="text-stone-500 transition-colors hover:text-amber-600">Contact</a>
				<a href="/#despre" class="text-stone-500 transition-colors hover:text-amber-600">Despre</a>
			</div>
		</div>
	</div>
</div>
