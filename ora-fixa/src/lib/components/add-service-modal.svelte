<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { addServiceSchema } from '$lib/schemas';
	import type { z } from 'zod';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Save } from 'lucide-svelte';
    import {SquarePlus} from 'lucide-svelte'

	let { addServiceForm }: { addServiceForm: SuperValidated<z.infer<typeof addServiceSchema>> } =
		$props();

	let isDialogOpen = $state(false);

	const { form, enhance } = superForm(addServiceForm, {
		id: 'add-service-form',
		validators: zod(addServiceSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Serviciul a fost adăugat cu succes!');
				isDialogOpen = false;
				await invalidateAll();
			} else {
				toast.error('A apărut o eroare la adăugarea serviciului. Te rugăm să încerci din nou!');
			}
		}
	});
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<SquarePlus /> Adaugă serviciu nou
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Adaugă serviciu nou</Dialog.Title>
			<Dialog.Description>Adaugă un serviciu nou în lista ta de servicii.</Dialog.Description>
		</Dialog.Header>
		<form action="?/addService" method="post" use:enhance>
			<div class="grid gap-3">
				<div class="space-y-2">
					<Label for="name">Nume</Label>
					<Input id="name" name="name" bind:value={$form.name} placeholder='Nume serviciu.' />
				</div>
				<div class="space-y-2">
					<Label for="description">Descriere</Label>
					<Textarea
						class="h-30 md:h-20"
						id="description"
                        placeholder='Descriere serviciu.'
						name="description"
						bind:value={$form.description}
					/>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div class="space-y-2">
						<Label for="duration">Durata (Minute)</Label>
						<Input id="duration" name="duration" type="number" bind:value={$form.duration} />
					</div>
					<div class="space-y-2">
						<Label for="price">Pret (Lei)</Label>
						<Input id="price" name="price" type="number" bind:value={$form.price} />
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit" class="mt-4"><Save /> Adaugă serviciul</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
