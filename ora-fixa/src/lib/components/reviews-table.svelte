<script lang="ts" module>
	import { createRawSnippet } from 'svelte';
	import { createSvelteTable, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';

	import { z } from 'zod';
	export const ReviewSchema = z.object({
		id: z.number(),
		appointment_id: z.number(),
		user_id: z.number(),
		profiles: z.object({
			full_name: z.string(),
			phone: z.string()
		}),
		mood: z.enum(['angry', 'frown', 'meh', 'smile', 'laugh']),
		content: z.string(),
		created_at: z.string()
	});

	export type Review = z.infer<typeof ReviewSchema>;

  let isEditDialogOpen = $state(false)

	export const columns: ColumnDef<Review>[] = [
		{
			header: 'Id',
			accessorKey: 'id'
		},
		{
			header: 'Nume complet',
			accessorKey: 'full_name',
			accessorFn: (row) => row.profiles.full_name
		},
		{
			accessorKey: 'created_at',
			header: 'Data și ora',
			cell: ({ row }) => {
				const formatter = new Intl.DateTimeFormat('ro-RO', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					timeZone: 'Europe/Bucharest'
				});
				const timeCellSnippet = createRawSnippet<[string]>((getStartTime) => {
					const startTime = getStartTime();
					return {
						render: () => `${startTime}`
					};
				});

				return renderSnippet(
					timeCellSnippet,
					formatter.format(new Date(row.getValue('created_at')))
				);
			}
		},
		{
			accessorKey: 'content',
			header: 'Review'
		},
		{
			accessorKey: 'mood',
			header: 'Stare',
			cell: ({ row }) => {
				const value = row.getValue('mood');
				switch (value) {
					case 'angry':
						return renderComponent(Angry);
					case 'frown':
						return renderComponent(Frown);
					case 'meh':
						return renderComponent(Meh);
					case 'smile':
						return renderComponent(Smile);
					case 'laugh':
						return renderComponent(Laugh);
				}
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(DataTableActions, { row });
			}
		}
	];
</script>

<script lang="ts">
	import {
		type Row,
		type ColumnDef,
		type PaginationState,
		type ColumnFiltersState,
		type VisibilityState,
		getPaginationRowModel,
		getFilteredRowModel,
		getCoreRowModel
	} from '@tanstack/table-core';
	import {
		Angry,
		Frown,
		Meh,
		Smile,
		Laugh,
		EllipsisVertical,
		MoveRight,
		MoveLeft,
    Trash
	} from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Input from './ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { reviews }: { reviews: Review[] } = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 15 });
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return reviews;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
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
		},
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div>
	<div class="flex flex-col justify-between space-y-3 py-4 md:flex-row">
		<h1 class="text-2xl">Tabel Review-uri</h1>
		<div class="flex space-x-2">
			<Input
				placeholder="Filtrează review-urile..."
				value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
				onchange={(e) => {
					table.getColumn('full_name')?.setFilterValue(e.currentTarget.value);
				}}
				oninput={(e) => {
					table.getColumn('full_name')?.setFilterValue(e.currentTarget.value);
				}}
				class="max-w-sm"
			/>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
					Coloane
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{#if column.id === 'actions'}
								Actiuni
							{:else}
								{column.columnDef.header}
							{/if}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="w-full rounded-md border">
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
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								Nu s-au găsit rezultate pentru această pagină.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
	<div class="flex items-center justify-between space-x-2 py-4">
		<p class="text-muted-foreground text-sm">
			Pagina {pagination.pageIndex + 1} din {table.getPageCount()}
		</p>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<MoveLeft />
				Înapoi
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Înainte
				<MoveRight />
			</Button>
		</div>
	</div>
</div>

{#snippet DataTableActions({ row }: { row: Row<Review> })}
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
			<Dialog.Root bind:open={isEditDialogOpen}>
				<Dialog.Trigger class="hover:bg-accent rounded-md p-2 text-start text-sm text-red-500"
					>Șterge Review</Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title class='text-2xl md:text-3xl'>Anulează programarea</Dialog.Title>
						<Dialog.Description class="text-sm md:text-base">
							Ești sigur că vrei să anulezi această programare? Această acțiune este permanentă și
							nu poate fi reversată.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<form
							class="flex justify-center"
							action="?/deleteReview"
							method="POST"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										toast.success('Review-ul a fost șters cu succes!');
										await invalidateAll();
										setTimeout(() => {
											isEditDialogOpen = false;
										}, 500);
									} else {
										toast.error('Eroare:', {
											description: 'Review-ul nu a putut fi șters!'
										});
									}
								};
							}}
						>
							<input type="hidden" name="reviewId" value={row.original.id} />
							<Button type="submit" variant="destructive" class="mt-3 cursor-pointer"
								><Trash /> Confirmă ștergerea</Button
							>
						</form>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
