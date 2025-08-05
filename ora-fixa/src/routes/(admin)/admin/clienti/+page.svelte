<script lang="ts">
	import ClientsTable from '$lib/components/clients-table.svelte';
	let { data } = $props();
</script>

<div class="flex flex-1 flex-col">
	<div class="@container-main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div class="lg:p px-4">
				<h1 class="mb-6 text-3xl font-medium" >Management Clienti</h1>
                <ClientsTable services={data.services} clients={data.clients} clientsCount={data.totalClients} currentPage={data.currentPage} pageSize={data.pageSize} />
			</div>
		</div>
	</div>
</div>
