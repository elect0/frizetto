<script lang="ts">
	import * as Card from '$lib/components/ui/card/';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms/client';
	import { profileSchema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';
	import { Save } from '@lucide/svelte';

	let { data } = $props();

	const { form, errors, submitting, enhance } = superForm(data.form, {
		validators: zod(profileSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Detaliile contului tau au fost modificate cu succes!');
				goto('/cont');
			} else {
				toast.error('Erroare!', { description: 'Detaliile contului nu au putut fi modificate.' });
			}
		},
		resetForm: true
	});
</script>

<div class="py- flex h-screen items-center justify-center bg-stone-50">
	<Card.Root class="w-full max-w-sm border-stone-200 shadow-xl">
		<form method="POST" use:enhance>
			<Card.Header class="text-center">
				<Card.Title class="text-2xl font-bold">Bun venit la Frizetto!</Card.Title>
				<Card.Description
					>Aproape gata! Mai avem nevoie de câteva detalii pentru a-ți personaliza experiența.</Card.Description
				>
			</Card.Header>

			<Card.Content class="mt-6 grid gap-4">
				<div class="grid gap-2">
					<Label for="fullName">Nume complet</Label>
					<Input
						type="fullName"
						id="fullName"
						name="fullName"
						placeholder="Alexandru Popescu"
						bind:value={$form.fullName}
						aria-invalid={$errors.fullName ? 'true' : undefined}
					/>

					{#if $errors.fullName}
						<p class="text-sm text-red-600">{$errors.fullName}</p>
					{/if}
				</div>

				<div class="grid gap-2">
					<Label for="phoneNumber">Numar de telefon</Label>
					<Input
						type="phoneNumber"
						id="phoneNumber"
						name="phoneNumber"
						placeholder="0724 212 092"
						bind:value={$form.phoneNumber}
						aria-invalid={$errors.phoneNumber ? 'true' : undefined}
					/>
					{#if $errors.phoneNumber}
						<p class="text-sm text-red-600">{$errors.phoneNumber}</p>
					{/if}
				</div>

				<Button
					type="submit"
					class="mb-2 w-full bg-amber-600 text-white hover:bg-amber-700"
					disabled={$submitting}
				>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Se modifica...
					{:else}
						<Save /> Salvează și Continuă
					{/if}
				</Button>
			</Card.Content>
			<Card.Footer class="text-center">
				<p class="text-sm text-stone-500">
					Datele tale sunt în siguranță și vor fi folosite exclusiv pentru gestionarea
					programărilor.
				</p>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
