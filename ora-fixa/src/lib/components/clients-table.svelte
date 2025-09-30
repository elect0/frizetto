<script lang="ts" module>
	export const ClientSchema = z.object({
		id: z.string().uuid(),
		full_name: z.string(),
		phone: z.string(),
		email: z.string(),
		last_visit: z.string(),
		total_visits: z.number(),
		total_spent: z.number(),
		noshow_count: z.number(),
		status: z.string(),
		created_at: z.string(),
		client_notes: z.string(),
		is_banned: z.boolean()
	});

	export type Client = z.infer<typeof ClientSchema>;
</script>

<script lang="ts">
	import {
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type PaginationState,
		type Row
	} from '@tanstack/table-core';
	import { z } from 'zod';
	import { ro } from 'date-fns/locale';
	import { formatDistanceToNow } from 'date-fns';
	import Badge from './ui/badge/badge.svelte';
	import { ChevronLeft, ChevronRight, Star } from '@lucide/svelte';
	import { renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from './ui/button/button.svelte';
	import { EllipsisVertical } from 'lucide-svelte';
	import WalkInModal from './walk-in-modal.svelte';
	import type { Service } from '$lib/types/supabase';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Input from './ui/input/input.svelte';
	import CustomerProfileModal from './customer-profile-modal.svelte';

	let {
		clients,
		services,
		clientsCount,
		currentPage,
		pageSize
	}: {
		clients: Client[];
		services: Service[];
		clientsCount: number;
		currentPage: number;
		pageSize: number;
	} = $props();

	const columns: ColumnDef<Client>[] = [
		{
			accessorKey: 'full_name',
			header: 'Nume Complet',
			id: 'fullName'
		},
		{
			accessorKey: 'last_visit',
			header: 'Ultima Vizită',
			id: 'last_visit',
			cell: ({ row }) => {
				if (row.getValue('last_visit') === null) {
					return `Nicio vizită.`;
				}
				const timeAgo = formatDistanceToNow(new Date(row.getValue('last_visit')), {
					addSuffix: true,
					locale: ro
				});
				return `${timeAgo}`;
			}
		},
		{
			accessorKey: 'phone',
			header: 'Telefon',
			id: 'phone'
		},
		{
			accessorKey: 'total_visits',
			header: 'Total Vizite',
			id: 'totalVisits'
		},
		{
			accessorKey: 'total_spent',
			header: 'Total Încasări',
			id: 'total_spent',
			cell: ({ row }) => {
				return `${row.getValue('total_spent')} lei`;
			}
		},
		{
			accessorKey: 'noshow_count',
			header: 'Neprezentări',
			id: 'noShowCount'
		},
		{
			accessorKey: 'status',
			header: 'Statut',
			id: 'status',
			cell: ({ row }) => {
				return renderSnippet(DataTableStatus, { row });
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(DataTableActions, { row, services });
			}
		}
	];

	let selectedSort = $state('');
	let selectedOrder = $state('');

	const sortingOptions = [
		{ value: 'last_visit', label: 'Ultima Vizită.' },
		{ value: 'total_visits', label: 'Total Vizite.' },
		{ value: 'total_spent', label: 'Total Încasări.' }
	];

	const orderOptions = [
		{ value: 'asc', label: 'Crescator' },
		{ value: 'desc', label: 'Descrescator' }
	];

	let sortTriggerContent = $derived(
		sortingOptions.find((s) => s.value === selectedSort)?.label ??
			'Selectează o optiune de sortare.'
	);
	let orderTriggerContent = $derived(
		orderOptions.find((o) => o.value === selectedOrder)?.label ?? 'Selectează o ordine.'
	);

	function addParams(options: { key: string; value: string }) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set(options.key, options.value);
		const url = `${page.url.pathname}?${params.toString()}`;
		goto(url, {
			noScroll: true,
			replaceState: true,
			keepFocus: true
		});
	}

	function navigateToPage(pageNumber: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', pageNumber.toString());
		const url = `${page.url.pathname}?${params.toString()}`;

		goto(url, {
			noScroll: true,
			replaceState: true,
			keepFocus: true
		});
	}

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: pageSize });

	const table = createSvelteTable({
		get data() {
			return clients;
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			}
		},
		columns,
		getPaginationRowModel: getPaginationRowModel(),
		getCoreRowModel: getCoreRowModel()
	});

</script>

<div class="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
	<Input
		placeholder="Filtrează nume"
		class="w-full text-sm sm:max-w-sm"
		oninput={(e) => addParams({ key: 'search', value: e.currentTarget.value })}
	/>
	<div class="mt-3 flex flex-wrap items-center sm:mt-0 sm:flex-nowrap md:space-x-2">
		<Select.Root
			type="single"
			bind:value={selectedSort}
			onValueChange={() => addParams({ key: 'sort', value: selectedSort })}
		>
			<Select.Trigger class="w-full">
				Sortare după: {sortTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Label>Alege o opțiune de sortare.</Select.Label>
				{#each sortingOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label}>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Select.Root
			type="single"
			bind:value={selectedOrder}
			onValueChange={() => addParams({ key: 'order', value: selectedOrder })}
		>
			<Select.Trigger class="mt-3 w-full md:mt-0">
				Ordinea: {orderTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Label>Alege o ordine</Select.Label>
				{#each orderOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label}>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>
<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head colspan={header.colSpan}>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">
						Pagina nu conține înregistrări.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
<div class="flex w-full items-center justify-between p-3">
	<div class="flex flex-col">
		<span class="mt-4 text-start text-sm text-stone-500"
			>{table.getFilteredRowModel().rows.length} din {clientsCount}
			clienți.
		</span>
		<span class="text-start text-sm text-stone-500">
			Se afișează pagina {currentPage}.
		</span>
	</div>
	<div class="flex items-center space-x-2">
		<Button
			variant="outline"
			size="sm"
			onclick={() => navigateToPage(currentPage - 1)}
			disabled={currentPage === 1 ? true : false}
		>
			<ChevronLeft /></Button
		>
		<Button variant="outline" size="sm" onclick={() => navigateToPage(1)}>1</Button>
		<Button variant="outline" size="sm" onclick={() => navigateToPage(currentPage + 1)}>
			<ChevronRight /></Button
		>
	</div>
</div>

{#snippet DataTableStatus({ row }: { row: Row<Client> })}
	<Badge variant="outline" class="px-1.5">
		<Star />
		{row.original.status}
	</Badge>
{/snippet}

{#snippet DataTableActions({ row, services }: { row: Row<Client>; services: Service[] })}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="data-[state=open]:bg-muted text-muted-foreground flex size-8">
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<EllipsisVertical />
					<span class="sr-only">Open menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-32">
			<CustomerProfileModal {row} />
			<DropdownMenu.Separator />
			<WalkInModal {row} {services} />
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
