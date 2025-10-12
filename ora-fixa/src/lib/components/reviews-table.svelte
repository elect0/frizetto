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

	export const columns: ColumnDef<Review>[] = [
		{
			header: 'Id',
			accessorKey: 'id'
		},
		{
			header: 'Nume complet',
			accessorKey: 'full_name',
			accessorFn: (row) => row.profiles.full_name,

		},
		{
			accessorKey: 'created_at',
			header: 'Data si ora',
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
		getPaginationRowModel,
		getFilteredRowModel,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { Angry, Frown, Meh, Smile, Laugh, EllipsisVertical } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import * as Table from '$lib/components/ui/table/index.js';

	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import Button from './ui/button/button.svelte';

	let { reviews }: { reviews: Review[] } = $props();

	const table = createSvelteTable({
		get data() {
			return reviews;
		},
		columns,
		// onColumnFiltersChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		columnFilters = updater(columnFilters);
		// 	} else {
		// 		columnFilters = updater;
		// 	}
		// },
		// state: {
		// 	get pagination() {
		// 		return pagination;
		// 	},
		// 	get columnFilters() {
		// 		return columnFilters;
		// 	}
		// },
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div>
	<div class="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="rounded-md border w-full">
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
		<DropdownMenu.Content align="end" class="w-32"></DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
