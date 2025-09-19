<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import {Button} from '$lib/components/ui/button/index.js'
    import { Label } from '$lib/components/ui/label/index.js';
    import {Save} from '@lucide/svelte'
	import { updateStatusSchema } from '$lib/schemas';
    import { zod } from 'sveltekit-superforms/adapters';
    import { superForm, defaults } from 'sveltekit-superforms';
    import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';


    let {
        appointmentId,
        status
    } : {
        appointmentId: string,
        status: string
    } = $props();

    const statuses = [
		{ value: 'confirmata', label: 'Confirmată' },
		{ value: 'anulata', label: 'Anulată' },
		{ value: 'finalizata', label: 'Finalizată' },
		{ value: 'neprezentat', label: 'Neprezentat' }
	];
    
    let isDialogOpen = $state(false)
    
	const { form, enhance } = superForm(
        defaults(
            {
                appointmentId: appointmentId,
				status: status,
			},
			zod(updateStatusSchema)
		),
		{
            validators: zod(updateStatusSchema),
			resetForm: true,
			onResult: async ({ result }) => {
                if (result.type === 'success') {
                    toast.success('Programarea a fost modificată cu succes!');
					await invalidateAll();
					isDialogOpen = false;
				} else {
					toast.error('A apărut o eroare la modificarea programării. Te rugăm să încerci din nou!');
				}
			}
		}
	);
    
let statusTriggerContent = $derived(
    $form.status ? statuses.find((s) => s.value === $form.status)?.label : 'Selectează un status.'
);
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger
		class="focus:bg-accent focus:text-accent-foreground hover:bg-accent relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-start text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
	>
		Modifică statusul
	</Dialog.Trigger>
	<Dialog.Content>
        <Dialog.Header>

            <Dialog.Title>Modifică statusul programării.</Dialog.Title>
            <Dialog.Description>
                Modifică statusul programării. Apasă salvează când ai terminat.
            </Dialog.Description>
        </Dialog.Header>
        <form action="?/updateStatus" method="POST" use:enhance class='space-y-4'> 
            <div class="space-y-2">
                <Label>Status</Label>
                <Select.Root type="single" name="status" bind:value={$form.status}>
                    <Select.Trigger class="w-full">
                        {statusTriggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Label>Status</Select.Label>
                        {#each statuses as status (status.value)}
                            <Select.Item value={status.value} label={status.label}>
                                {status.label}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>
            <input type="hidden" name="appointmentId" bind:value={$form.appointmentId} />
            <Dialog.Footer>
                <Button type="submit">
                    <Save class="h-5 w-5" />
                    Salvează modificarile</Button
                >
            </Dialog.Footer>
        </form>
	</Dialog.Content>
</Dialog.Root>
