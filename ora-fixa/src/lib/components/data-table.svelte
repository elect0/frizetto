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
			full_name: z.string(),
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

	let {
		appointments,
		clients,
		services,
		date: currentDateString,
		form: walkInForm
	}: {
		appointments: Appointment[];
		date: string;
		clients: Profile[];
		services: Service[];
		form: SuperValidated<z.infer<typeof walkInSchema>>;
	} = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 18 });
	let columnFilters = $state<ColumnFiltersState>([]);

	let clientValue = $state('');
	let serviceValue = $state('');
	let dateValue = $state<DateValue | undefined>();

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

		goto(`/admin/dashboard?date=${newDateString}`, {
			noScroll: true
		});
	}

	function goToToday() {
		goto('/admin/dashboard', {
			noScroll: true
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
		<div class="mt-2 flex flex-wrap items-center space-x-2 sm:mt-0 sm:flex-nowrap">
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => navigateToDay(-1)}>
				<ChevronLeft />
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => goToToday()}>
				Astăzi
			</Button>
			<Button variant="outline" size="sm" class="cursor-pointer" onclick={() => navigateToDay(+1)}>
				<ChevronRight />
			</Button>
			<Dialog.Root>
				<Dialog.Trigger
					class={`${buttonVariants({ variant: 'outline' })} mt-2 w-full sm:mt-0 sm:w-auto`}
				>
					<div class="flex items-center justify-center sm:justify-start">
						<UserPlus class="mr-2 h-5 w-5" /> Adaugă programare walk-in.
					</div>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Adaugă Programare Nouă</Dialog.Title>
						<Dialog.Description>
							Completează detaliile pentru a adăuga o nouă programare în calendar. Asigură-te că
							toate informațiile sunt corecte înainte de a salva.
						</Dialog.Description>
					</Dialog.Header>
					<ClientCombobox
						{walkInForm}
						{dateValue}
						{clients}
						{clientValue}
						{serviceValue}
						{services}
					/>
				</Dialog.Content>
			</Dialog.Root>
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
			<DropdownMenu.Item>		<a href={`/client/${row.original.profiles.id}`}> Vezi Profilul Clientului </a> </DropdownMenu.Item>
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
              class='flex justify-center'
							action="?/cancelAppointment"
							method="POST"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										toast.success('Programarea a fost anulată cu succes!');
										await invalidateAll();
										setTimeout(() => {
											isDialogOpen = false;
										}, 500);
									} else {
										toast.error('Eroare:', {
											description: 'programarea nu a putut fi anulată!'
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
