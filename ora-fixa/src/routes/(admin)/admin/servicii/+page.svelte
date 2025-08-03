<script lang="ts">
	import AddServiceModal from "$lib/components/add-service-modal.svelte";
	import ServiceCard from "$lib/components/service-card.svelte";
    let {data} = $props()
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div class="px-4 lg:px-6">
                <div class="flex justify-between">
                    <h1 class="mb-6 text-3xl font-medium">Management</h1>
                    <AddServiceModal addServiceForm={data.addServiceForm} />
                </div>
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {#each data.services as service (service.service_id) }
                                        <ServiceCard {service} /> 
                                    {/each}
                                </div>
            </div>
		</div>
	</div>
</div>

