<script lang='ts' module>
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export type Appointment = {
	id: number;
	start_time: string; // Nume proprietate: snake_case
    client_notes: string,
	profiles: {
		full_name: string,
	};  // Nume proprietate: snake_case
	status: 'confirmata' | 'anulata' | 'finalizata' | 'neprezentat';
	services: { name: string; price: number };
};

export const columns: ColumnDef<Appointment>[] = [
	{
		accessorKey: 'start_time', // Corect, este la primul nivel
		header: 'Ora',
		cell: ({row}) => {
			const formatter = new Intl.DateTimeFormat('ro-RO', {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Europe/Bucharest"
			})
			const timeCellSnippet = createRawSnippet<[string]>((getStartTime) =>{
				const startTime = getStartTime()
				return {
					render: () => `${startTime}`		}
			})

			return renderSnippet(
				timeCellSnippet,
				formatter.format(new Date(row.getValue('start_time')))
			)
		}
	},
	{
		// CORECTAT: Schimbă 'accessorKey' cu 'accessorFn'
		header: 'Client',
		accessorFn: row => row.profiles.full_name, // Accesează proprietatea interioară
		id: 'fullName', // Adaugă un ID unic, obligatoriu pentru accessorFn
	},
	{
		header: 'Serviciu',
		accessorFn: row => row.services.name, // Corect, deja foloseai accessorFn
		id: 'serviceName',
        cell: ({row}) => {
            return renderSnippet(
                DataTableService,
                {row}
            )
        }
	},
	{
		header: 'Preț',
		accessorFn: row => row.services.price, // Corect
		id: 'servicePrice',
        cell: ({row}) => {
            const priceCellSnippet = createRawSnippet<[object]>((price) => {
                return {
                    render: () => `${row.original.services.price} lei`
                }
            })
            return renderSnippet(
                priceCellSnippet,
                {row}
            )
        }
	},
	{
		accessorKey: 'status', // Corect, este la primul nivel
		header: 'Status',
		cell: ({row}) => {
			return renderSnippet(
				DataTableStatus,
				{row}
			)
		}
	},
    {
        accessorKey: 'client_notes',
        header: 'Notita',
    }
];
</script>

<script lang="ts">
    import { type ColumnDef, type Row, getCoreRowModel } from "@tanstack/table-core";
	import { Badge } from '$lib/components/ui/badge/index.js';
    import {
      createSvelteTable,
      FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
import {CircleCheck, CalendarCheck, XCircle, UserX } from '@lucide/svelte'

    let {data}: {data: Appointment[]} = $props()

    const table = createSvelteTable({
        get data(){
            return data
        },
        columns,
        getCoreRowModel: getCoreRowModel()
    })

</script>
<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <Table.Row>
                {#each headerGroup.headers as header (header.id)}
                <Table.Head colspan={header.colSpan}>
                    {#if !header.isPlaceholder}
                    <FlexRender content={header.column.columnDef.header} context={header.getContext()} /> 
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
                <Table.Cell colspan={columns.length} class='h-24 text-center'>
                    Nicio programare.
                </Table.Cell>
            </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>

{#snippet DataTableStatus({row} : {row: Row<Appointment>})}
    <Badge variant='outline' class='px-1.5'>
        {#if row.original.status === 'finalizata'}
        <CircleCheck class="fill-green-500 text-white" />
        {/if}
        {#if row.original.status === 'confirmata'}
        <CalendarCheck class='fill-blue-500 text-white' />
        {/if}
        {#if row.original.status === 'anulata'} 
        <XCircle class='fill-stone-500 text-white' />
        {/if}
        {#if row.original.status === 'neprezentat'}
        <UserX class='fill-red-500 text-white' />
        {/if}
        {row.original.status}
    </Badge>
{/snippet}

{#snippet DataTableService({row} : {row: Row<Appointment>})}
    <Badge variant='outline'>{row.original.services.name}</Badge>
    {/snippet}