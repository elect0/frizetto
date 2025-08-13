<script lang="ts">
	import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
	import InnerShadowTopIcon from '@tabler/icons-svelte/icons/inner-shadow-top';
	import UsersIcon from '@tabler/icons-svelte/icons/users';
	import IconCalendarCheck from '@tabler/icons-svelte/icons/calendar-check';
	import { IconClock, IconMessage, IconScissors } from '@tabler/icons-svelte';
	import NavDocuments from './nav-documents.svelte';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';


	let user = $derived(page.data.user)

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/admin/dashboard',
				icon: DashboardIcon
			},
			{
				title: 'Programari',
				url: '/admin/programari',
				icon: IconCalendarCheck
			},
			{
				title: 'Clienti',
				url: '/admin/clienti',
				icon: UsersIcon
			},
			{
				title: 'Servicii',
				url: '/admin/servicii',
				icon: IconScissors
			}
		],
		documents: [
			{
				name: 'Program de lucru',
				url: '/admin/program',
				icon: IconClock
			},
			// {
			// 	name: 'Notificari',
			// 	url: '/admin/notificari',
			// 	icon: IconMessage
			// }
		]
	};

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="/admin/dashboard" {...props}>
							<InnerShadowTopIcon class="!size-5" />
							<span class="text-base font-semibold">Frizetto</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavDocuments items={data.documents} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={user} />
	</Sidebar.Footer>
</Sidebar.Root>
