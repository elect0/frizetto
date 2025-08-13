<!-- <script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import {
		Scissors,
		User,
		Star,
		MapPin,
		X,
		Menu,
		CalendarDays,
		Award,
		LogOut
	} from 'lucide-svelte';
	import { page } from '$app/state';

	interface NavItem {
		id: string;
		label: string;
		icon: any;
	}

	let session = $derived(page.data.session);
	let user = $derived(page.data);

	let isAuthenticated = $derived(!!session);
	let userInitials = $derived(user.user?.user_metadata.full_name.charAt(0).toUpperCase() || '?');
	let userName = $derived(user.user?.user_metadata.full_name.split(' ')[0] || 'Oaspete');

	let isMobileMenuOpen = $state(false);

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const navItems: NavItem[] = [
		{ id: 'servicii', label: 'Servicii', icon: Scissors },
		{ id: 'despre', label: 'Despre', icon: User },
		{ id: 'recenzii', label: 'Recenzii', icon: Star },
		{ id: 'contact', label: 'Contact', icon: MapPin }
	];
</script>

<nav
	class="fixed left-0 right-0 top-0 z-50 border-b-2 border-amber-600/20 bg-white shadow-xl backdrop-blur-xl"
>
	<div class="container mx-auto px-4 lg:px-6">
		<div class="flex h-20 items-center justify-between">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg"
				>
					<Scissors class="h-7 w-7 text-white" />
				</div>
				<div class="flex flex-col">
					<a
						href="#hero"
						class="text-2xl font-black text-stone-900 transition-all duration-300 hover:scale-105 hover:text-amber-600"
					>
						Cip Barbershop
					</a>
					<span class="text-xs font-medium text-stone-500">Bailesti</span>
				</div>
			</div>
			<div class="hidden items-center space-x-1 md:flex">
				{#each navItems as item}
					<a
						href={`#${item.id}`}
						class="rounded-xl px-4 py-2 text-sm font-semibold text-stone-600 transition-all duration-300 hover:scale-105 hover:bg-amber-50 hover:text-amber-600"
					>
						{item.label}
					</a>
				{/each}
			</div>
			<div class="flex items-center space-x-4">
				{#if !isAuthenticated}
					<a
						href="/login"
						class="hidden rounded-xl px-4 text-sm font-semibold text-stone-600 transition-all duration-300 hover:scale-105 hover:bg-stone-100 hover:text-amber-600 md:block"
					>
						Autentificare</a
					>
					<a
						href="/inregistrare"
						class="hidden rounded-xl bg-amber-600 px-6 py-2 font-semibold text-white shadow-lg shadow-amber-600/25 transition-all duration-300 hover:scale-105 hover:bg-amber-700 hover:shadow-amber-600/40 md:flex"
					>
						Creeaza Cont</a
					>
				{:else}
					<div class="hidden md:block">
						<DropdownMenu>
							<DropdownMenuTrigger>
								{#snippet child({ props })}
									<Button
										variant="ghost"
										{...props}
										class="flex items-center space-x-3 px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-stone-100"
									>
										<Avatar class="h-10 w-10 border-2 border-amber-600 shadow-lg">
											<AvatarFallback class="bg-amber-600 text-white">
												{userInitials}
											</AvatarFallback>
										</Avatar>
										<span class="text-sm font-semibold text-stone-700">Salut, {userName}</span>
									</Button>
								{/snippet}
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="center"
								class="ml-5 mt-2 w-56 border-2 border-stone-100 shadow-xl"
							>
								<a href="/cont/programari">
									<DropdownMenuItem class="cursor-pointer py-3 hover:bg-amber-50">
										<CalendarDays class="mr-3 h-5 w-5 text-amber-600" />
										<span class="font-medium">Programarile Mele</span>
									</DropdownMenuItem>
								</a>
								<a href="/cont">
									<DropdownMenuItem class="cursor-pointer py-3 hover:bg-amber-50">
										<User class="mr-3 h-5 w-5 text-amber-600" />
										<span class="font-medium"> Contul meu </span>
									</DropdownMenuItem>
								</a>
								<DropdownMenuSeparator />
								<DropdownMenuItem class="cursor-pointer py-3 text-red-600 hover:bg-red-50">
									<form method="POST" action="/logout">
										<button type="submit" class="flex flex-row items-center">
											<LogOut class="mr-5 h-5 w-5 text-amber-600" />
											<span class="font-medium"> Deconectare </span>
										</button>
									</form>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				{/if}
				<button
					onclick={toggleMobileMenu}
					class="rounded-xl p-3 text-stone-700 transition-all duration-300 hover:scale-105 hover:bg-stone-100 md:hidden"
				>
					{#if isMobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
		{#if isMobileMenuOpen}
			<div class="border-t-2 border-amber-600/20 bg-white shadow-2xl md:hidden">
				<div class="px-4 py-6">
					<div class="flex flex-col space-y-2">
						<div class="mt-4 border-t-2 border-stone-100 pt-4">
							{#if !isAuthenticated}
								<div class="space-y-3">
									<a
										href="/login"
										class="group flex w-full items-center rounded-xl px-4 py-4 font-semibold text-stone-700 transition-all duration-300 hover:bg-amber-50 hover:text-amber-600"
									>
										<User
											class="mr-4 h-5 w-5 text-amber-600 transition-transform group-hover:scale-110"
										/>
										Autentificare
									</a>
									<a
										href="/inregistrare"
										class="mx-2 flex w-full items-center justify-center rounded-xl bg-amber-600 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-amber-700 hover:shadow-xl"
									>
										<Award class="mr-2 h-5 w-5" />
										Creeaza Cont
									</a>
								</div>
							{:else}
								<div class="space-y-3">
									<div
										class="mx-2 flex items-center rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-stone-50 px-4 py-3"
									>
										<Avatar class="mr-4 h-10 w-10 border-2 border-amber-600 shadow-lg">
											<AvatarFallback class="bg-amber-600 text-sm font-bold text-white">
												{userInitials}
											</AvatarFallback>
										</Avatar>
										<span class="font-bold text-stone-800">Salut, {userName}</span>
									</div>
									<a
										href="/cont/programari"
										class="duration_300 group flex w-full items-center rounded-xl px-4 py-4 font-semibold text-stone-700 transition-all hover:bg-amber-50 hover:text-amber-600"
									>
										<CalendarDays
											class="mr-4 h-5 w-5 text-amber-600 transition-transform group-hover:scale-110"
										/>
										Programarile Mele
									</a>
									<a
										href="/cont"
										class="group flex w-full items-center rounded-xl px-4 py-4 font-semibold text-stone-600 transition-all duration-300 hover:bg-amber-50 hover:text-amber-600"
									>
										<User
											class="mr-4 h-5 w-5 text-amber-600 transition-transform group-hover:scale-110"
										/>
										Contul meu
									</a>
									<form method="POST" action="/logout">
										<button
											class="group flex w-full items-center rounded-xl px-4 py-4 font-semibold text-stone-600 transition-all duration-300 hover:bg-amber-50 hover:text-amber-600"
										>
											<LogOut
												class="mr-4 h-5 w-5 text-amber-600 transition-transform group-hover:scale-110"
											/>
											Deconectare
										</button>
									</form>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav> -->

<script lang="ts">
	import {
		Scissors,
		User,
		Star,
		MapPin,
		X,
		Menu,
		CalendarDays,
		Award,
		LogOut
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import { Button } from '../ui/button';
	import * as Sheet from '../ui/sheet';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	const navItems = [
		{ id: 'servicii', label: 'Servicii', icon: Scissors },
		{ id: 'despre', label: 'Despre', icon: User },
		{ id: 'recenzii', label: 'Recenzii', icon: Star },
		{ id: 'contact', label: 'Contact', icon: MapPin }
	];

	let user = $derived(page.data.user);
	let userInitials = $derived(user?.user_metadata.full_name.charAt(0).toUpperCase() || '?');
	let userName = $derived(user?.user_metadata.full_name.split(' ')[0] || 'Oaspete');

	let isOpen = $state<boolean>(false);
</script>

<nav
	class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed left-0 right-0 top-0 z-50 w-full border-b py-1 backdrop-blur md:py-3"
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<a href="/" class="flex items-center space-x-3">
					<div class="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
						<span class="text-primary-foreground text-sm font-bold"> F </span>
					</div>
					<span class="text-lg font-semibold tracking-tight md:text-2xl"> Frizetto </span>
				</a>
			</div>
			<div class="hidden space-x-4 md:block">
				{#each navItems as item (item.id)}
					<a
						href="#{item.id}"
						class="text-muted-foreground hover:text-foreground group relative text-base font-medium transition-colors duration-200"
					>
						{item.label}
						<!-- later -->
						<span
							class="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-200 group-hover:w-full"
						/>
					</a>
				{/each}
			</div>

			{#if user}
				<div class="hidden md:block">
					<DropdownMenu>
						<DropdownMenuTrigger>
							{#snippet child({ props })}
								<Button
									variant="ghost"
									{...props}
									class="flex items-center space-x-3 px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-stone-100"
								>
									<Avatar class="h-10 w-10 border-2 border-amber-600 shadow-lg">
										<AvatarFallback class="bg-amber-600 text-white">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<span class="text-sm font-semibold text-stone-700">Salut, {userName}</span>
								</Button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="center"
							class="ml-5 mt-2 w-56 border-2 border-stone-100 shadow-xl"
						>
							<a href="/cont/programari">
								<DropdownMenuItem class="cursor-pointer py-3 hover:bg-amber-50">
									<CalendarDays class="mr-3 h-5 w-5 text-amber-600" />
									<span class="font-medium">Programarile Mele</span>
								</DropdownMenuItem>
							</a>
							<a href="/cont">
								<DropdownMenuItem class="cursor-pointer py-3 hover:bg-amber-50">
									<User class="mr-3 h-5 w-5 text-amber-600" />
									<span class="font-medium"> Contul meu </span>
								</DropdownMenuItem>
							</a>
							<DropdownMenuSeparator />
							<DropdownMenuItem class="cursor-pointer py-3 text-red-600 hover:bg-red-50">
								<form method="POST" action="/logout">
									<button type="submit" class="flex flex-row items-center">
										<LogOut class="mr-5 h-5 w-5 text-amber-600" />
										<span class="font-medium"> Deconectare </span>
									</button>
								</form>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			{:else}
				<div class="hidden items-center space-x-4 md:flex">
					<Button variant="ghost" class="text-base font-medium">Autentificare</Button>
					<Button class="text-base font-medium">Creeaza Cont</Button>
				</div>
			{/if}

			<div class="md:hidden">
				<Sheet.Root open={isOpen} onOpenChange={() => (isOpen = !isOpen)}>
					<Sheet.Trigger>
						<Button variant="ghost" size="sm" class="h-9 w-9 p-0">
							<Menu class="h-5 w-5" />
							<span class="sr-only">Deschide meniul principal.</span>
						</Button>
					</Sheet.Trigger>
					<Sheet.Content side="right" class="w-[300px] p-4 sm:w-[400px]">
						<div class="flex items-center space-x-2 px-2">
							<div class="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
								<!-- logo -->
								<span class="text-primary-foreground text-sm font-bold"> F </span>
							</div>
							<span class="text-lg font-semibold tracking-tight"> Frizetto </span>
						</div>
						<div class="flex flex-col space-y-3">
							{#each navItems as item (item.id)}
								<a
									href="#{item.id}"
									onclick={() => (isOpen = false)}
									class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-2 text-base font-medium transition-colors duration-200"
								>
									{item.label}
								</a>
							{/each}
						</div>
						<div class="border-border flex flex-col space-y-3 border-t pt-6">
							<Button variant="ghost" class="justify-start" onclick={() => (isOpen = false)}>
								Autentificare
							</Button>
							<Button variant="ghost" class="justify-start" onclick={() => (isOpen = false)}>
								Creeaza Cont
							</Button>
						</div>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</div>
	</div>
</nav>
