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
	import Separator from '../ui/separator/separator.svelte';
	import Dashboard from '@tabler/icons-svelte/icons/dashboard';

	let user = $derived(page.data.user);
	let userInitials = $derived.by(() => {
		return user.user_metadata.full_name
			? user.user_metadata.full_name.charAt(0).toUpperCase()
			: '?';
	});
	let userName = $derived.by(() => {
		return user.user_metadata.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Oaspete';
	});
	
	let isAdmin = $derived(page.data.isAdmin)

	let isOpen = $state<boolean>(false);
</script>

<nav class="fixed left-0 right-0 top-0 z-50 w-full border-b bg-white py-1 md:py-3">
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
							{#if isAdmin}
							<a href="/admin/dashboard">
							<DropdownMenuItem class='cursor-pointer py-3 hover:bg-amber-50'>
								<Dashboard class="mr-3 h-5 w-5 text-amber-600" />
								<span class="font-medium">Panou Administrator</span>
							</DropdownMenuItem>
							</a>
							{/if}
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
					<a href="/login">
						<Button variant="ghost" class="text-base font-medium">Autentificare</Button>
					</a>
					<a href="/inregistrare">
						<Button class="text-base font-medium">Creeaza Cont</Button>
					</a>
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
						<div class="flex items-center space-x-2 px-1">
							<a href="/" class="flex items-center space-x-3">
								<div class="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
									<!-- logo -->
									<span class="text-primary-foreground text-sm font-bold"> F </span>
								</div>
								<span class="text-lg font-semibold tracking-tight"> Frizetto </span>
							</a>
						</div>
						
						{#if user}
						<Separator />
							<div
								class="mx-2 flex items-center rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-stone-50 px-4 py-3"
							>
								<Avatar class="mr-4 h-10 w-10  shadow-lg">
									<AvatarFallback class="bg-amber-600 text-sm font-bold text-white">
										{userInitials}
									</AvatarFallback>
								</Avatar>
								<span class="font-semibold text-stone-800">Salut, {userName}</span>
							</div>
							<a
								href="/cont/programari"
								onclick={() => (isOpen = false)}
								class="text-muted-foreground flex items-center rounded-md px-3 py-3 text-base text-sm font-medium transition-colors duration-200 hover:bg-amber-50 hover:text-amber-600"
							>
								<CalendarDays class="mr-4 h-5 w-5 text-amber-600 " />
								Programările mele
							</a>
							<a
								href="/cont/"
								onclick={() => (isOpen = false)}
								class="text-muted-foreground flex items-center rounded-md px-3 py-3 text-base text-sm font-medium transition-colors duration-200 hover:bg-amber-50 hover:text-amber-600"
							>
								<User class="mr-4 h-5 w-5 text-amber-600 " />
								Contul meu
							</a>
							{#if isAdmin}
														<a
								href="/admin/dashboard"
								onclick={() => (isOpen = false)}
								class="text-muted-foreground flex items-center rounded-md px-3 py-3 text-base text-sm font-medium transition-colors duration-200 hover:bg-amber-50 hover:text-amber-600"
							>
								<Dashboard class="mr-4 h-5 w-5 text-amber-600 " />
								Panou Administrator
							</a>
							{/if}
							<form method="POST" action="/logout">
								<button
									type="submit"
									class="text-muted-foreground flex w-full cursor-pointer items-center rounded-md px-3 py-3 text-base text-sm font-medium transition-colors duration-200 hover:bg-amber-50 hover:text-amber-600"
								>
									<LogOut class="mr-4 h-5 w-5 text-amber-600" />
									Deconectare
								</button>
							</form>
						{:else}
							<div class="flex flex-col space-y-3 border-t pt-6">
								<a href="/login">
									<Button variant="outline" class="w-full py-2 text-base font-medium"
										><User /> Autentificare</Button
									>
								</a>
								<a href="/inregistrare">
									<Button class="w-full py-2 text-base font-medium ">
										<Award /> Creează Cont
									</Button>
								</a>
							</div>
						{/if}
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</div>
	</div>
</nav>
