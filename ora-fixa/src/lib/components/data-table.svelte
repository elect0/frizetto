<script lang="ts" module>
	import type { ColumnDef } from "@tanstack/table-core";
	import { renderSnippet, renderComponent } from "$lib/components/ui/data-table/index.js";
	import { createRawSnippet } from "svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import DotsVerticalIcon from "@tabler/icons-svelte/icons/dots-vertical";
	import DataTableCheckbox from "./data-table-checkbox.svelte";
	import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
	import LoaderIcon from "@tabler/icons-svelte/icons/loader";
  
	// 1. Define the Appointment interface
	export interface Appointment {
	  id: number;
	  start_time: string; // ISO 8601 format
	  end_time: string; // ISO 8601 format
	  status: "confirmata" | string; // Assuming other possible status values
	  profiles: {
		id: string;
		notes: string;
		phone: string;
		full_name: string;
	  };
	  services: {
		name: string;
		price: number;
		duration_minutes: number;
	  };
	}
  
	// 2. Updated column definitions
	export const columns: ColumnDef<Appointment>[] = [
	  {
		id: "select",
		header: ({ table }) =>
		  renderComponent(DataTableCheckbox, {
			checked: table.getIsAllPageRowsSelected(),
			indeterminate:
			  table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
			onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
			"aria-label": "Select all",
		  }),
		cell: ({ row }) =>
		  renderComponent(DataTableCheckbox, {
			checked: row.getIsSelected(),
			onCheckedChange: (value) => row.toggleSelected(!!value),
			"aria-label": "Select row",
		  }),
		enableSorting: false,
		enableHiding: false,
	  },
	  {
		accessorKey: "profiles.full_name",
		header: "Client Name",
		cell: ({ row }) => row.original.profiles.full_name,
	  },
	  {
		accessorKey: "start_time",
		header: "Start Time",
		cell: ({ row }) => {
		  const date = new Date(row.original.start_time);
		  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		},
	  },
	  {
		accessorKey: "end_time",
		header: "End Time",
		cell: ({ row }) => {
		  const date = new Date(row.original.end_time);
		  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		},
	  },
	  {
		accessorKey: "services.name",
		header: "Service",
		cell: ({ row }) => row.original.services.name,
	  },
	  {
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => renderSnippet(DataTableStatus, { row }),
	  },
	  {
		id: "actions",
		cell: () => renderSnippet(DataTableActions),
	  },
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
	  type RowSelectionState,
	  type SortingState,
	  type VisibilityState,
	} from "@tanstack/table-core";
	import { createSvelteTable } from "$lib/components/ui/data-table/data-table.svelte.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import LayoutColumnsIcon from "@tabler/icons-svelte/icons/layout-columns";
	import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
	import PlusIcon from "@tabler/icons-svelte/icons/plus";
	import ChevronsLeftIcon from "@tabler/icons-svelte/icons/chevrons-left";
	import ChevronLeftIcon from "@tabler/icons-svelte/icons/chevron-left";
	import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
	import ChevronsRightIcon from "@tabler/icons-svelte/icons/chevrons-right";
	import { FlexRender } from "$lib/components/ui/data-table/index.js";
  
	// 3. Update data prop type
	let { appointments }: { appointments: Appointment[] } = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});
  
	const table = createSvelteTable({
	  // 4. Update data
	  get data() {
		return appointments;
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
		get rowSelection() {
		  return rowSelection;
		},
		get columnFilters() {
		  return columnFilters;
		},
	  },
	  getRowId: (row) => row.id.toString(),
	  enableRowSelection: true,
	  getCoreRowModel: getCoreRowModel(),
	  getPaginationRowModel: getPaginationRowModel(),
	  getSortedRowModel: getSortedRowModel(),
	  getFacetedRowModel: getFacetedRowModel(),
	  getFacetedUniqueValues: getFacetedUniqueValues(),
	  getFilteredRowModel: getFilteredRowModel(),
	  onPaginationChange: (updater) => {
		if (typeof updater === "function") {
		  pagination = updater(pagination);
		} else {
		  pagination = updater;
		}
	  },
	  onSortingChange: (updater) => {
		if (typeof updater === "function") {
		  sorting = updater(sorting);
		} else {
		  sorting = updater;
		}
	  },
	  onColumnFiltersChange: (updater) => {
		if (typeof updater === "function") {
		  columnFilters = updater(columnFilters);
		} else {
		  columnFilters = updater;
		}
	  },
	  onColumnVisibilityChange: (updater) => {
		if (typeof updater === "function") {
		  columnVisibility = updater(columnVisibility);
		} else {
		  columnVisibility = updater;
		}
	  },
	  onRowSelectionChange: (updater) => {
		if (typeof updater === "function") {
		  rowSelection = updater(rowSelection);
		} else {
		  rowSelection = updater;
		}
	  },
	});
	let views = [
	  {
		id: "outline",
		label: "Appointments",
		badge: 0,
	  },
	  {
		id: "past-performance",
		label: "Past Performance",
		badge: 3,
	  },
	  {
		id: "key-personnel",
		label: "Key Personnel",
		badge: 2,
	  },
	  {
		id: "focus-documents",
		label: "Focus Documents",
		badge: 0,
	  },
	];
	let view = $state("outline");
	let viewLabel = $derived(views.find((v) => view === v.id)?.label ?? "Select a view");
  </script>
  
  <Tabs.Root value="outline" class="w-full flex-col justify-start gap-6">
	<div class="flex items-center justify-between px-4 lg:px-6">
	  <Label for="view-selector" class="sr-only">View</Label>
	  <Select.Root type="single" bind:value={view}>
		<Select.Trigger class="@4xl/main:hidden flex w-fit" size="sm" id="view-selector">
		  {viewLabel}
		</Select.Trigger>
		<Select.Content>
		  {#each views as view (view.id)}
			<Select.Item value={view.id}>{view.label}</Select.Item>
		  {/each}
		</Select.Content>
	  </Select.Root>
	  <Tabs.List
		class="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex hidden"
	  >
		{#each views as view (view.id)}
		  <Tabs.Trigger value={view.id}>
			{view.label}
			{#if view.badge > 0}
			  <Badge variant="secondary">{view.badge}</Badge>
			{/if}
		  </Tabs.Trigger>
		{/each}
	  </Tabs.List>
	  <div class="flex items-center gap-2">
		<DropdownMenu.Root>
		  <DropdownMenu.Trigger>
			{#snippet child({ props })}
			  <Button variant="outline" size="sm" {...props}>
				<LayoutColumnsIcon />
				<span class="hidden lg:inline">Customize Columns</span>
				<span class="lg:hidden">Columns</span>
				<ChevronDownIcon />
			  </Button>
			{/snippet}
		  </DropdownMenu.Trigger>
		  <DropdownMenu.Content align="end" class="w-56">
			{#each table
			  .getAllColumns()
			  .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()) as column (column.id)}
			  <DropdownMenu.CheckboxItem
				class="capitalize"
				checked={column.getIsVisible()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			  >
				{column.id}
			  </DropdownMenu.CheckboxItem>
			{/each}
		  </DropdownMenu.Content>
		</DropdownMenu.Root>
		<Button variant="outline" size="sm">
		  <PlusIcon />
		  <span class="hidden lg:inline">Add Appointment</span>
		</Button>
	  </div>
	</div>
	<Tabs.Content value="outline" class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
	  <div class="overflow-hidden rounded-lg border">
		<Table.Root>
		  <Table.Header class="bg-muted sticky top-0 z-10">
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
			{#if table.getRowModel().rows?.length}
			  {#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && "selected"}>
				  {#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell>
					  <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</Table.Cell>
				  {/each}
				</Table.Row>
			  {/each}
			{:else}
			  <Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center">
				  No results.
				</Table.Cell>
			  </Table.Row>
			{/if}
		  </Table.Body>
		</Table.Root>
	  </div>
	  <div class="flex items-center justify-between px-4">
		<div class="text-muted-foreground hidden flex-1 text-sm lg:flex">
		  {table.getFilteredSelectedRowModel().rows.length} of
		  {table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="flex w-full items-center gap-8 lg:w-fit">
		  <div class="hidden items-center gap-2 lg:flex">
			<Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
			<Select.Root
			  type="single"
			  bind:value={
				() => `${table.getState().pagination.pageSize}`,
				(v) => table.setPageSize(Number(v))
			  }
			>
			  <Select.Trigger size="sm" class="w-20" id="rows-per-page">
				{table.getState().pagination.pageSize}
			  </Select.Trigger>
			  <Select.Content side="top">
				{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
				  <Select.Item value={pageSize.toString()}>
					{pageSize}
				  </Select.Item>
				{/each}
			  </Select.Content>
			</Select.Root>
		  </div>
		  <div class="flex w-fit items-center justify-center text-sm font-medium">
			Page {table.getState().pagination.pageIndex + 1} of
			{table.getPageCount()}
		  </div>
		  <div class="ml-auto flex items-center gap-2 lg:ml-0">
			<Button
			  variant="outline"
			  class="hidden h-8 w-8 p-0 lg:flex"
			  onclick={() => table.setPageIndex(0)}
			  disabled={!table.getCanPreviousPage()}
			>
			  <span class="sr-only">Go to first page</span>
			  <ChevronsLeftIcon />
			</Button>
			<Button
			  variant="outline"
			  class="size-8"
			  size="icon"
			  onclick={() => table.previousPage()}
			  disabled={!table.getCanPreviousPage()}
			>
			  <span class="sr-only">Go to previous page</span>
			  <ChevronLeftIcon />
			</Button>
			<Button
			  variant="outline"
			  class="size-8"
			  size="icon"
			  onclick={() => table.nextPage()}
			  disabled={!table.getCanNextPage()}
			>
			  <span class="sr-only">Go to next page</span>
			  <ChevronRightIcon />
			</Button>
			<Button
			  variant="outline"
			  class="hidden size-8 lg:flex"
			  size="icon"
			  onclick={() => table.setPageIndex(table.getPageCount() - 1)}
			  disabled={!table.getCanNextPage()}
			>
			  <span class="sr-only">Go to last page</span>
			  <ChevronsRightIcon />
			</Button>
		  </div>
		</div>
	  </div>
	</Tabs.Content>
	<Tabs.Content value="past-performance" class="flex flex-col px-4 lg:px-6">
	  <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
	<Tabs.Content value="key-personnel" class="flex flex-col px-4 lg:px-6">
	  <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
	<Tabs.Content value="focus-documents" class="flex flex-col px-4 lg:px-6">
	  <div class="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
	</Tabs.Content>
  </Tabs.Root>
  
  {#snippet DataTableStatus({ row }: { row: Row<Appointment> })}
	<Badge variant="outline" class="text-muted-foreground px-1.5">
	  {#if row.original.status === "confirmata"}
		<CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
	  {:else}
		<LoaderIcon />
	  {/if}
	  {row.original.status}
	</Badge>
  {/snippet}
  
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
		<DropdownMenu.Item>Edit</DropdownMenu.Item>
		<DropdownMenu.Item>Make a copy</DropdownMenu.Item>
		<DropdownMenu.Item>Favorite</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
	  </DropdownMenu.Content>
	</DropdownMenu.Root>
  {/snippet}