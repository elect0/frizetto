<script lang="ts" module>
	import { createRawSnippet } from 'svelte';
	import { renderSnippet } from '$lib/components/ui/data-table/index.js';

	export type Appointment = {
		id: number;
		start_time: string;
		client_notes: string;
		profiles: {
			full_name: string;
		};
		status: 'confirmata' | 'anulata' | 'finalizata' | 'neprezentat';
		services: { name: string; price: number };
	};

	export const columns: ColumnDef<Appointment>[] = [
		{
			accessorKey: 'start_time',
			header: 'Ora',
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
					formatter.format(new Date(row.getValue('start_time')))
				);
			}
		},
		{
			header: 'Client',
			accessorKey: 'fullName',
			accessorFn: (row) => row.profiles.full_name,
			id: 'fullName'
		},
		{
			header: 'Serviciu',
			accessorFn: (row) => row.services.name,
			id: 'serviceName',
			cell: ({ row }) => {
				return renderSnippet(DataTableService, { row });
			}
		},
		{
			header: 'Preț',
			accessorFn: (row) => row.services.price,
			id: 'servicePrice',
			cell: ({ row }) => {
				const priceCellSnippet = createRawSnippet<[object]>((price) => {
					return {
						render: () => `${row.original.services.price} lei`
					};
				});
				return renderSnippet(priceCellSnippet, { row });
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				return renderSnippet(DataTableStatus, { row });
			}
		},
		{
			accessorKey: 'client_notes',
			header: 'Notita'
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
		type ColumnDef,
		type PaginationState,
		type ColumnFiltersState,
		type Row,
		getCoreRowModel,
		getPaginationRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import {
		CircleCheck,
		CalendarCheck,
		XCircle,
		UserX,
		EllipsisVertical,
		ChevronLeft,
		ChevronRight,
		UserPlus
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input/index.js';

	let { appointments, date: currentDateString }: { appointments: Appointment[]; date: string } =
		$props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 18 });
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		get data() {
			return appointments;
		},
		columns,
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel()
	});

	function navigateToDay(offset: number) {
		const date = new Date(currentDateString + 'T12:00:00Z');
		console.log(date);
		date.setUTCDate(date.getDate() + offset);

		const newDateString = date.toISOString().split('T')[0];

		goto(`/admin/dashboard?date=${newDateString}`);
	}

	function goToToday() {
		goto('/admin/dashboard');
	}
</script>

<div>
	<div class="flex items-center justify-between py-4">
		<Input
			placeholder="Filtrează nume"
			value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
			onchange={(e) => table.getColumn('fullName')?.setFilterValue(e.currentTarget.value)}
			oninput={(e) => table.getColumn('fullName')?.setFilterValue(e.currentTarget.value)}
			class="max-w-sm"
		/>
		<div class="flex items-center space-x-2">
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => navigateToDay(-1)}>
				<ChevronLeft />
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => goToToday()}>
				Astăzi
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => navigateToDay(+1)}>
				<ChevronRight />
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => navigateToDay(+1)}>
				<UserPlus class='w-5 h-5' /> Adaugă programare walk-in.
			</Button>
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
							Nicio programare.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex w-full justify-end">
		<span class="mt-4 text-end text-sm text-stone-500"
			>{appointments.length} din {table.getState().pagination.pageSize} programări.
			<div>Data tabelului: {currentDateString}.</div>
		</span>
	</div>
</div>

{#snippet DataTableStatus({ row }: { row: Row<Appointment> })}
	<Badge variant="outline" class="px-1.5">
		{#if row.original.status === 'finalizata'}
			<CircleCheck class="fill-green-500 text-white" />
		{/if}
		{#if row.original.status === 'confirmata'}
			<CalendarCheck class="fill-blue-500 text-white" />
		{/if}
		{#if row.original.status === 'anulata'}
			<XCircle class="fill-stone-500 text-white" />
		{/if}
		{#if row.original.status === 'neprezentat'}
			<UserX class="fill-red-500 text-white" />
		{/if}
		{row.original.status}
	</Badge>
{/snippet}

{#snippet DataTableService({ row }: { row: Row<Appointment> })}
	<Badge variant="outline">{row.original.services.name}</Badge>
{/snippet}

{#snippet DataTableActions({ row }: { row: Row<Appointment> })}
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
			<DropdownMenu.Item>Marchează ca Finalizată</DropdownMenu.Item>
			<DropdownMenu.Item>Marchează ca Neprezentat</DropdownMenu.Item>
			<DropdownMenu.Item>Vezi Profilul Clientului</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">Anulează Programarea</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
