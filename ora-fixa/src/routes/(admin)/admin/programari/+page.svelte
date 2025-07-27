<script lang='ts'>
	import AppointmentsTable from '$lib/components/appointments-table.svelte';
    let {data} = $props()
</script>

<div class="flex flex-1 flex-col">
    <div class="@container-main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div class="px-4 lg:p">
                <h1 class='text-3xl mb-4'>Management Programări</h1>
                <AppointmentsTable currentPage={data.currentPage} appointments={data.appointments} />
            </div>
        </div>
    </div>
</div>