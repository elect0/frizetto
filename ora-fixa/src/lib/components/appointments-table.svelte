<script lang="ts" module>
	import { createRawSnippet } from 'svelte';
	import { renderSnippet } from '$lib/components/ui/data-table/index.js';

	import { z } from 'zod';

	export const AppointmentSchema = z.object({
		id: z.number(),
		start_time: z.string(),
		client_notes: z.string(),
		profiles: z.object({
			id: z.string().uuid(),
			full_name: z.string()
		}),
		status: z.enum(['confirmata', 'anulata', 'finalizata', 'neprezentat']),
		services: z.object({
			id: z.number(),
			name: z.string(),
			price: z.number()
		})
	});

	export type Appointment = z.infer<typeof AppointmentSchema>;

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

	let isDialogOpen = $state(false);
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
	import * as Select from '$lib/components/ui/select/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CircleCheck, CalendarCheck, XCircle, UserX, EllipsisVertical } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import UpdateAppointmentModal from './update-appointment-modal.svelte';
	import UpdateStatusModal from './update-status-modal.svelte';

	let {
		appointments,
		currentPage
	}: {
		appointments: Appointment[];
		currentPage: number;
	} = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 60 });
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
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel()
	});

	const statuses = [
		{ value: '', label: 'Toate' },
		{ value: 'confirmata', label: 'Confirmată' },
		{ value: 'anulata', label: 'Anulată' },
		{ value: 'finalizata', label: 'Finalizată' },
		{ value: 'neprezentat', label: 'Neprezentat' }
	];

	const months = [
		{ value: '1', label: 'Ianuarie' },
		{ value: '2', label: 'Februarie' },
		{ value: '3', label: 'Martie' },
		{ value: '4', label: 'Aprilie' },
		{ value: '5', label: 'Mai' },
		{ value: '6', label: 'Iunie' },
		{ value: '7', label: 'Iulie' },
		{ value: '8', label: 'August' },
		{ value: '9', label: 'Septembrie' },
		{ value: '10', label: 'Octombrie' },
		{ value: '11', label: 'Noiembrie' },
		{ value: '12', label: 'Decembrie' }
	];

	let selectedStatus = $state('');
	let selectedMonth = $state((new Date().getMonth() + 1).toString());

	const statusTriggerContent = $derived(
		statuses.find((s) => s.value === selectedStatus)?.label ?? 'Selecteaza un status.'
	);
	const monthTriggerContent = $derived(
		months.find((m) => m.value === selectedMonth)?.label ?? 'Selecteaza o luna.'
	);

	function navigateToMonth(month: string) {
		goto(`/admin/programari?month=${month}`, {
			noScroll: true
		});
	}

	const id = $derived(page.params.id);

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

</script>

<div>
	<div class="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
		<Input
			placeholder="Filtrează nume"
			value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
			onchange={(e) => table.getColumn('fullName')?.setFilterValue(e.currentTarget.value)}
			oninput={(e) => table.getColumn('fullName')?.setFilterValue(e.currentTarget.value)}
			class="w-full text-sm sm:max-w-sm"
		/>
		<div class="mt-3 flex flex-wrap items-center sm:mt-0 sm:flex-nowrap md:space-x-2">
			<Select.Root
				type="single"
				bind:value={selectedStatus}
				onValueChange={() => table.getColumn('status')?.setFilterValue(selectedStatus)}
			>
				<Select.Trigger class="w-full">
					Filtru Status: {statusTriggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Label>Status-uri</Select.Label>
					{#each statuses as status (status.value)}
						<Select.Item value={status.value} label={status.label}>
							{status.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root
				type="single"
				bind:value={selectedMonth}
				onValueChange={() => navigateToMonth(selectedMonth)}
			>
				<Select.Trigger class="mt-3 w-full md:mt-0">
					Date din Luna: {monthTriggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Label>Alege o luna</Select.Label>
					{#each months as month (month.value)}
						<Select.Item value={month.value} label={month.label}>
							{month.label}
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
	<div class="flex w-full items-center justify-between p-3">
		<div class='flex-col flex'>
			<span class="mt-4 text-end text-sm text-stone-500"
			>{table.getFilteredRowModel().rows.length} din {table.getState().pagination.pageSize} programări.
		</span>
		<span class='text-sm text-stone-500'>
			Pagina {currentPage}.
		</span>
	</div>
		<div class="space-x-1">
			<Button
				variant="outline"
				size="sm"
				onclick={() => navigateToPage(currentPage - 1)}
				disabled={currentPage === 1 ? true : false}>Înapoi</Button
			>
			<Button variant="outline" size="sm" onclick={() => navigateToPage(currentPage + 1)}
				>Înainte</Button
			>
		</div>
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
			<div>
				<UpdateAppointmentModal {row} />
			</div>
			<div>
				<UpdateStatusModal
					appointmentId={row.original.id.toString()}
					status={row.original.status}
				/>
			</div>
			<DropdownMenu.Item>
						<a href={`/client/${row.original.profiles.id}`}> Vezi Profilul Clientului </a>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
