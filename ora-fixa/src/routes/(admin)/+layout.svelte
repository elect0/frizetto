<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import {page} from '$app/state'
	console.log(page)
</script>


<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Frizetto - {page.data.pageTitle}</title>
</svelte:head>

<div>
	<Sidebar.Provider
		style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
	>
		<AppSidebar variant="inset" />
		<Sidebar.Inset>
			<main class="p-4">
				<SiteHeader />
				<slot />
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>
