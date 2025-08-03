<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Clock, DollarSign, Users, Save } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Separator from './ui/separator/separator.svelte';
	import SuperDebug, { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateServiceSchema } from '$lib/schemas';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Edit , Trash2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type Service = {
		service_id: number;
		service_name: string;
		service_description: string;
		service_price: number;
		service_duration_minutes: number;
		bookings_this_month: number;
	};

	let { service }: { service: Service } = $props();

	let isEditDialogOpen = $state(false);

	const { form: editForm, enhance: editFormEnhance } = superForm(
		defaults(
			{
				serviceId: service.service_id.toString(),
				name: service.service_name,
				description: service.service_description,
				price: service.service_price,
				duration: service.service_duration_minutes
			},
			zod(updateServiceSchema)
		),
		{
			id: `edit-service-${service.service_id}`,
			validators: zod(updateServiceSchema),
			resetForm: true,
			onResult: async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Serviciul a fost modificată cu succes!');
					isEditDialogOpen = false;
					await invalidateAll();
				} else {
					toast.error('A apărut o eroare la modificarea serviciului. Te rugăm să încerci din nou!');
				}
			}
		}
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{service.service_name}</Card.Title>
		<Card.Description>
			{service.service_description}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2">
			<div class="flex items-center">
				<div
					class="mr-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
				>
					<DollarSign class="h-5 w-5" />
				</div>
				<div>
					<p class="text-md font-semibold">{service.service_price} lei</p>
					<p class="text-sm text-stone-500">Pret</p>
				</div>
			</div>
			<div class="flex items-center">
				<div
					class="mr-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
				>
					<Clock class="h-5 w-5" />
				</div>
				<div>
					<p class="text-md font-semibold">{service.service_duration_minutes} minute</p>
					<p class="text-sm text-stone-500">Durata</p>
				</div>
			</div>
		</div>
		<Separator class="mt-4" />
		<div class="mt-3 flex items-center space-x-2">
			<Users class="text-amber-700" />
			<p class="text-sm text-stone-500">{service.bookings_this_month} vizite in luna actuala</p>
		</div>
	</Card.Content>
	<Card.Footer>
		<div class="w-full">
			<Dialog.Root bind:open={isEditDialogOpen}>
				<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
					 					<Edit class="w-4 h-4" /> Editeaza serviciul
				</Dialog.Trigger>
				<Dialog.Content class="w-full">
					<Dialog.Header>
						<Dialog.Title>Editeaza serviciul</Dialog.Title>
						<Dialog.Description>
							Editează detaliile serviciului. Apasă salvează când ai terminat.
						</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/updateService" use:editFormEnhance>
						<div class="grid gap-3">
							<div class="space-y-2">
								<Label for="name">Nume</Label>
								<Input id="name" name="name" bind:value={$editForm.name} />
							</div>
							<div class="space-y-2">
								<Label for="description">Descriere</Label>
								<Textarea
									class="h-30 md:h-20"
									id="description"
									name="description"
									bind:value={$editForm.description}
								/>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<div class="space-y-2">
									<Label for="duration">Durata (Minute)</Label>
									<Input
										id="duration"
										name="duration"
										type="number"
										bind:value={$editForm.duration}
									/>
								</div>
								<div class="space-y-2">
									<Label for="price">Pret (Lei)</Label>
									<Input id="price" name="price" type="number" bind:value={$editForm.price} />
								</div>
							</div>
							<input type="hidden" name="serviceId" value={$editForm.serviceId} />
						</div>
						<Dialog.Footer>
							<Button type="submit" class="mt-4"><Save /> Salveaza modificarile</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Card.Footer>
</Card.Root>
