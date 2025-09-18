<script lang="ts">
	interface Override {
		date: string;
		end_time: string;
		id: number;
		is_active: boolean;
		start_time: string;
	}

	let { override }: { override: Override } = $props();

	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from './ui/badge/badge.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import { format } from 'date-fns';
	import { ro } from 'date-fns/locale';
	import { Trash } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';

	let isDialogOpen = $state<boolean>(false);
</script>

<Card.Root class="mb-4">
	<Card.Content>
		<div class="flex items-center">
			<div class="w-full">
				<Badge>{override.is_active ? 'Program Special' : 'Zi liberă'}</Badge>
				<div class="flex w-full items-center justify-between">
					<p class="font-semibold text-stone-800">
						{format(override.date, 'EEEE, d MMMM, yyyy', { locale: ro })}
					</p>
					<Dialog.Root bind:open={isDialogOpen}>
						<Dialog.Trigger class={buttonVariants({ variant: 'secondary' })}
							><Trash /></Dialog.Trigger
						>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Anulează ziua cu program special.</Dialog.Title>
								<Dialog.Description>
									Ești sigur că vrei să anulezi această zi cu program special? Această acțiune este
									permanentă și nu poate fi reversată.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<form
                  class='flex justify-center'
									action="?/deleteOverride"
									method="POST"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												toast.success('Ziua a fost anulată cu succes! ');
												await invalidateAll();
												setTimeout(() => {
													isDialogOpen = false;
												}, 500);
											} else {
												toast.error('Eroare:', {
													description: 'ziua cu program special nu a putut fi anulată!'
												});
											}
										};
									}}
								>
									<input type="hidden" name="id" value={override.id} />
									<Button type="submit" variant="destructive" class="cursor-pointer"
										>Confirmă anularea</Button
									>
								</form>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>

				<p class="w-full text-sm text-stone-500">
					{override.is_active ? `${override.start_time} - ${override.end_time}` : ''}
				</p>
			</div>
		</div>
	</Card.Content>
</Card.Root>
