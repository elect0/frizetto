<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { type Client } from './clients-table.svelte';
	import { type Row } from '@tanstack/table-core';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
  import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import Separator from './ui/separator/separator.svelte';
	import Badge from './ui/badge/badge.svelte';
	import { Star, Trash, Ban } from '@lucide/svelte';
	import { parsePhoneNumberWithError } from 'libphonenumber-js';
	import { ro } from 'date-fns/locale';
	import { parseISO, format } from 'date-fns';

	let {
		row
	}: {
		row: Row<Client>;
	} = $props();

	let isDialogOpen = $state<boolean>(false);
	let phoneNumber = parsePhoneNumberWithError(row.original.phone, 'RO');


</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger
		class="focus:bg-accent focus:text-accent-foreground hover:bg-accent relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-start text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
		>Vezi Profilul</Dialog.Trigger
	>
	<Dialog.Content class='md:!max-w-2xl'>
		<Dialog.Header>
			<div class="flex items-end justify-between">
				<Avatar.Root class="mr-4 h-20 w-20 border-2 border-amber-600 shadow-lg">
					<Avatar.Fallback class="text-md bg-amber-600 font-bold text-white">
						{row.original.full_name.split('')[0]}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="space-x-3">
					<Button size='sm' variant="outline" class='cursor-pointer'> <Ban /> Blocheaza</Button>
					<Button size='sm' variant="destructive" class='cursor-pointer'><Trash /> Sterge</Button>
				</div>
			</div>

			<div class="mt-4 flex items-center space-x-2">
				<Dialog.Title>{row.original.full_name}</Dialog.Title>
				<Badge variant="outline" class="bg-stone-100 text-xs"><Star /> {row.original.status}</Badge>
			</div>
			<div class="flex space-x-3">
				<Dialog.Description>
					{phoneNumber.formatInternational()}
				</Dialog.Description>
			</div>
		</Dialog.Header>
		<div class="grid grid-cols-2 md:grid-cols-4 w-full gap-4">
			<div class="space-y-2">
				<p class="text-stone-500">Înregistrat din</p>
				{format(parseISO(row.original.created_at), 'd MMM, yyyy', { locale: ro })}
			</div>
			<div class="space-y-2">
				<p class="text-stone-500">Ultima vizită</p>
				{row.original.last_visit
					? format(parseISO(row.original.last_visit), 'd MMM, yyyy', { locale: ro })
					: 'Nicio vizită.'}
			</div>
			<div class="space-y-2">
				<p class="text-stone-500">Total Cheltuit</p>
				{row.original.total_spent} RON
			</div>
			<div class="space-y-2">
				<p class="text-stone-500">Neprezentări</p>
				{row.original.noshow_count}
			</div>
		</div>
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      <div>
        Nume
      </div>
      <div>
        <Input disabled type='text' value={row.original.full_name} class="text-black text-sm"/>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      <div>
        Email
      </div>
      <div>
        <Input disabled type='text' value={row.original.email} class="text-black text-sm"/>
      </div>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2 mb-5">
      <div>
        Preferinte
      </div>
      <div>
        <Input disabled type='text' value={row.original.client_notes ? row.original.client_notes : "Nicio preferinta."} class="text-black text-sm"/>
      </div>
    </div>

	</Dialog.Content>
</Dialog.Root>
