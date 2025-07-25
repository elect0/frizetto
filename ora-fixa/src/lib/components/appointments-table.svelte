<script lang="ts" module>
	import { createRawSnippet } from 'svelte';
	import { renderSnippet } from '$lib/components/ui/data-table/index.js';

	import { z } from 'zod';

	export const AppointmentSchema = z.object({
		id: z.number(),
		start_time: z.string(),
		client_notes: z.string(),
		profiles: z.object({
			full_name: z.string()
		}),
		status: z.enum(['confirmata', 'anulata', 'finalizata', 'neprezentat']),
		services: z.object({
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
	import type { Profile, Service } from '$lib/types/supabase';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
    import * as Select from '$lib/components/ui/select/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
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
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { type SuperValidated } from 'sveltekit-superforms/client';
	import { walkInSchema } from '$lib/schemas';
	import { toast } from 'svelte-sonner';
	import ClientCombobox from './client-combobox.svelte';
	import { type DateValue } from '@internationalized/date';
    import {page} from '$app/state'

	let {
		appointments,
        currentPage,
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
        {value: '', label: "Toate"},
        { value: 'confirmata', label: 'Confirmată' },
        { value: 'anulata', label: 'Anulată' },
        { value: 'finalizata', label: 'Finalizată' },
        { value: 'neprezentat', label: 'Neprezentat' },
    ]

    const months = [
        {value: '1', label: 'Ianuarie'},
        {value: '2', label: 'Februarie'},
        {value: '3', label: 'Martie'},
        {value: '4', label: 'Aprilie'},
        {value: '5', label: 'Mai'},
        {value: '6', label: 'Iunie'},
        {value: '7', label: 'Iulie'},
        {value: '8', label: 'August'},
        {value: '9', label: 'Septembrie'},
        {value: '10', label: 'Octombrie'},
        {value: '11', label: 'Noiembrie'},
        {value: '12', label: 'Decembrie'}
    ]
    
    let selectedStatus = $state("")
    let selectedMonth = $state((new Date().getMonth() + 1).toString())

    const statusTriggerContent = $derived(statuses.find(s => s.value === selectedStatus)?.label ?? 'Selecteaza un status.')
    const monthTriggerContent = $derived(months.find(m => m.value === selectedMonth)?.label ?? 'Selecteaza o luna.')


    function navigateToMonth(month: string){
        goto(`/admin/programari?month=${month}`, {
            noScroll: true
        })
    }

    const id = $derived(page.params.id)

    function navigateToPage(pageNumber: number){
        console.log()
        const url = page.url.search && !page.url.searchParams.get('page') ? `${page.url.search.split('&')[0]}&page=${pageNumber}` : `?page=${pageNumber}`
        goto(url, {
            noScroll: true,
            replaceState: true,
            keepFocus: true,
        })
    }

    $effect(() => {
        console.log(page)
        console.log(id)
    })
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
        <div class="mt-2 flex flex-wrap items-center space-x-2 sm:mt-0 sm:flex-nowrap">
        <Select.Root type='single' bind:value={selectedStatus} onValueChange={() => table.getColumn('status')?.setFilterValue(selectedStatus)}>
            <Select.Trigger>
                Filtru Status: {statusTriggerContent}
            </Select.Trigger>
            <Select.Content>
                <Select.Label>Status-uri</Select.Label>
                {#each statuses as status (status.value)}
                    <Select.Item
                        value={status.value}
                        label={status.label}>
                        {status.label}
            </Select.Item>
            {/each}
            </Select.Content>
        </Select.Root>
        <Select.Root type='single' bind:value={selectedMonth} onValueChange={() => navigateToMonth(selectedMonth)}>
            <Select.Trigger>
                Date din Luna: {monthTriggerContent}
            </Select.Trigger>
            <Select.Content>
                <Select.Label>Alege o luna</Select.Label>
            {#each months as month (month.value)}
                <Select.Item
                    value={month.value}
                    label={month.label}>
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
							Nicio programare.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex w-full justify-between items-center">
		<span class="mt-4 text-end text-sm text-stone-500"
			>{table.getFilteredRowModel().rows.length} din {table.getState().pagination.pageSize} programări.
			<!-- <div>Data tabelului: {currentDateString}.</div> -->
		</span>
        <div>
            <Button variant='outline' size='sm' onclick={() => navigateToPage(currentPage - 1)} disabled={currentPage === 1 ? true : false}>Previous</Button>
            <Button variant='outline' size='sm' onclick={() => navigateToPage(currentPage + 1)}>Next</Button>

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
			<DropdownMenu.Item>
				<form
					action="?/markAsComplete"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.success('Programarea a fost marcată ca finalizată cu succes.');
								await invalidateAll();
							} else {
								toast.error('Eroare:', {
									description: 'programarea nu a putut fi marcată ca finalizată.'
								});
							}
						};
					}}
				>
					<input type="hidden" name="appointmentId" value={row.original.id} />
					<button type="submit" class="all-unset">Marchează ca Finalizată</button>
				</form>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<form
					action="?/markAsNoShow"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.success('Programarea a fost marcată ca neprezentată.');
								await invalidateAll();
							} else {
								toast.error('Eroare:', {
									description: 'programarea nu a putut fi marcată ca neprezentată.'
								}); 
							}
						};
					}}
				>
					<input type="hidden" name="appointmentId" value={row.original.id} />
					<button type="submit" class="all-unset">Marchează ca Neprezentat</button>
				</form></DropdownMenu.Item
			>
			<DropdownMenu.Item>Vezi Profilul Clientului</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<Dialog.Root bind:open={isDialogOpen}>
				<Dialog.Trigger class="hover:bg-accent rounded-md p-2 text-start text-sm text-red-500"
					>Anulează Programarea</Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Anulează programarea</Dialog.Title>
						<Dialog.Description>
							Ești sigur că vrei să anulezi această programare? Această acțiune este permanentă și
							nu poate fi reversată.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<form
							action="?/cancelAppointment"
							method="POST"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										toast.success('Programarea a fost marcată ca neprezentată.');
										await invalidateAll();
										setTimeout(() => {
											isDialogOpen = false;
										}, 500);
									} else {
										toast.error('Eroare:', {
											description: 'programarea nu a putut fi marcată ca neprezentată.'
										});
									}
								};
							}}
						>
							<input type="hidden" name="appointmentId" value={row.original.id} />
							<Button type="submit" variant="destructive" class="cursor-pointer"
								>Confirmă anularea</Button
							>
						</form>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
