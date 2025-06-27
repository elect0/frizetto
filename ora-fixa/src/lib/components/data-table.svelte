<script lang="ts" module>
	import type { ColumnDef } from '@tanstack/table-core';

	export const columns: ColumnDef<Schema>[] = [
		{
			accessorKey: 'ora',
			header: 'Ora',
			cell: ({ getValue }) => getValue(),
			size: 80
		},
		{
			accessorKey: 'client.nume',
			header: 'Client',
			cell: ({ row }) => row.original.client.nume,
			minSize: 150,
			enableHiding: false
		},
		{
			accessorKey: 'client.telefon',
			header: 'Telefon Client',
			cell: ({ row }) => row.original.client.telefon,
			size: 120
		},
		{
			accessorKey: 'serviciu.nume',
			header: 'Serviciu',
			cell: ({ row }) => row.original.serviciu.nume,
			minSize: 150
		},
		{
			accessorKey: 'serviciu.durataMinute',
			header: () =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => '<div class="w-full text-center">Durată</div>'
					}))
				),
			cell: ({ row }) =>
				renderSnippet(DataTableDurataCell, { durata: row.original.serviciu.durataMinute }),
			size: 100
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => renderSnippet(DataTableStatus, { status: row.original.status }),
			size: 160
		},
		{
			accessorKey: 'pret',
			header: () =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => '<div class="w-full text-right">Preț (RON)</div>'
					}))
				),
			cell: ({ row }) => renderSnippet(DataTablePretCell, { pret: row.original.pret }),
			size: 100
		},
		{
			id: 'actions',
			header: () =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => '<div class="w-full text-right pr-2">Acțiuni</div>'
					}))
				),
			cell: () => renderSnippet(DataTableActions),
			size: 80,
			enableSorting: false
		}
	];
</script>

<script lang="ts">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import type { Schema, StatusEnum as StatusEnumType } from './schemas.ts';

	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	// import { Label } from '$lib/components/ui/label/index.js'; // No longer used
	import { FlexRender, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { createRawSnippet } from 'svelte';

	// Tabler Icons
	import LayoutColumnsIcon from '@tabler/icons-svelte/icons/layout-columns';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import ChevronsLeftIcon from '@tabler/icons-svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
	import ChevronRightIcon from '@tabler/icons-svelte/icons/chevron-right';
	import ChevronsRightIcon from '@tabler/icons-svelte/icons/chevrons-right';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';

	let { data }: { data: Schema[] } = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 25 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	// Date state
	let currentDate = $state(new Date());

	function formatDate(date: Date): string {
		const day = date.getDate();
		const month = date.getMonth() + 1; // Month is 0-indexed
		const year = date.getFullYear();
		return `${month}/${day}/${year}`; // Format as m/d/yyyy (e.g., 6/26/2025)
	}
	const formattedCurrentDate = $derived(formatDate(currentDate));

	function handlePreviousDay() {
		// Placeholder for actual date change logic
		console.log('Previous Day clicked. Current date (will change later):', currentDate);
		// Example:
		// const newDate = new Date(currentDate);
		// newDate.setDate(currentDate.getDate() - 1);
		// currentDate = newDate;
		// Then you would typically refetch or filter `data` for the new `currentDate`
	}

	function handleNextDay() {
		// Placeholder for actual date change logic
		console.log('Next Day clicked. Current date (will change later):', currentDate);
		// Example:
		// const newDate = new Date(currentDate);
		// newDate.setDate(currentDate.getDate() + 1);
		// currentDate = newDate;
		// Then you would typically refetch or filter `data` for the new `currentDate`
	}

	const table = createSvelteTable({
		get data() {
			// This data will eventually be filtered/fetched based on `currentDate`
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		}
	});
</script>

<div class="w-full flex-col justify-start gap-6 px-4 lg:px-6">
	<div class="flex items-center justify-between py-4">
		<!-- Date Navigation -->
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				title="Ziua anterioară"
				onclick={handlePreviousDay}
			>
				<ChevronLeftIcon />
			</Button>
			<span class="text-lg font-medium tabular-nums">{formattedCurrentDate}</span>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				title="Ziua următoare"
				onclick={handleNextDay}
			>
				<ChevronRightIcon />
			</Button>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="sm" {...props}>
							<LayoutColumnsIcon />
							<span class="hidden lg:inline">Customizează Coloane</span>
							<span class="lg:hidden">Coloane</span>
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					{#each table
						.getAllColumns()
						.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(!!value)}
						>
							{typeof column.columnDef.header === 'string'
								? column.columnDef.header
								: column.id.replace(/_/g, ' ').replace(/\./g, ' ')}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button variant="outline" size="sm">
				<PlusIcon />
				<span class="hidden lg:inline">Adaugă Programare</span>
			</Button>
		</div>
	</div>

	<!-- Table content -->
	<div class="relative flex flex-col gap-4 overflow-auto">
		<div class="overflow-hidden rounded-lg border">
			<Table.Root>
				<Table.Header class="bg-muted sticky top-0 z-10">
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row>
							{#each headerGroup.headers as header (header.id)}
								<Table.Head colspan={header.colSpan} style="width: {header.getSize()}px">
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
					{#if table.getRowModel().rows?.length}
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell style="width: {cell.column.getSize()}px">
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								Nicio programare pentru data selectată.
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
		<!-- Bottom Pagination for Table Data -->
		<div class="flex items-center justify-between px-4 py-2">
			<div class="text-muted-foreground hidden flex-1 text-sm lg:flex">
				Total programări afișate: {table.getFilteredRowModel().rows.length}
			</div>
			<div class="flex w-full items-center gap-8 lg:w-fit">
				<div class="flex w-fit items-center justify-center text-sm font-medium">
					Pagina {table.getState().pagination.pageIndex + 1} din
					{table.getPageCount()}
				</div>
				<div class="ml-auto flex items-center gap-2 lg:ml-0">
					<Button
						variant="outline"
						class="hidden h-8 w-8 p-0 lg:flex"
						onclick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Prima pagină (date tabel)</span>
						<ChevronsLeftIcon />
					</Button>
					<Button
						variant="outline"
						class="size-8"
						size="icon"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Pagina anterioară (date tabel)</span>
						<ChevronLeftIcon />
					</Button>
					<Button
						variant="outline"
						class="size-8"
						size="icon"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Pagina următoare (date tabel)</span>
						<ChevronRightIcon />
					</Button>
					<Button
						variant="outline"
						class="hidden size-8 lg:flex"
						size="icon"
						onclick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Ultima pagină (date tabel)</span>
						<ChevronsRightIcon />
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Snippets for specific cell rendering -->
{#snippet DataTableDurataCell({ durata }: { durata: number })}
	<div class="text-center">{durata} min</div>
{/snippet}

{#snippet DataTablePretCell({ pret }: { pret: number })}
	<div class="text-right">{pret} RON</div>
{/snippet}

{#snippet DataTableStatus({ status }: { status: StatusEnumType })}
	<Badge variant="secondary" class="px-1.5">
		{status}
	</Badge>
{/snippet}

<!-- Generic Action Menu Snippet -->
{#snippet DataTableActions()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="data-[state=open]:bg-muted text-muted-foreground flex size-8">
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<DotsVerticalIcon />
					<span class="sr-only">Open menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-32">
			<DropdownMenu.Item>Modifică</DropdownMenu.Item>
			<DropdownMenu.Item>Crează copie</DropdownMenu.Item>
			<DropdownMenu.Item>Favorit</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">Șterge</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
