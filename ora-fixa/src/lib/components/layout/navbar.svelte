<script lang="ts">
	import { fly } from 'svelte/transition';
	import { isMobile } from '$lib/store/useMediaQuery';
	import { tick } from 'svelte';

	let isMenuOpen = false;
	let menuBackdropElement: HTMLDivElement | null = null;
	let menuToggleButtonElement: HTMLButtonElement | null = null;

	async function openMobileMenu() {
		if (isMenuOpen) return;
		isMenuOpen = true;
		await tick();
		menuBackdropElement?.focus();
	}

	function closeMobileMenu() {
		if (!isMenuOpen) return; // Avoid redundant calls
		isMenuOpen = false;
		menuToggleButtonElement?.focus();
	}

	async function toggleMobileMenu() {
		if (isMenuOpen) {
			closeMobileMenu();
		} else {
			await openMobileMenu();
		}
	}

	function handleMenuKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMobileMenu();
		}
	}
</script>

<header class="fixed top-0 left-0 right-0 z-20 p-4 md:p-6">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-lg md:text-2xl font-bold uppercase tracking-wider text-white">
			Barber
		</a>

		{#if !$isMobile}
			<div class="flex items-center space-x-10">
				<nav class="flex items-center space-x-6">
					<a href="/despre" class="text-sm md:text-base text-white  transition-colors">Despre Noi</a>
					<a href="#preturi" class="text-sm md:text-base text-white transition-colors">Servicii & Tarife</a>
					<a href="#testimoniale" class="text-sm md:text-base text-white  transition-colors">Recenzii</a>
				</nav>
				<div>
					<a href="/contact" class="text-sm md:text-base text-white  transition-colors">Contact</a>
				</div>
			</div>
		{:else}
			<button
				bind:this={menuToggleButtonElement}
				on:click={toggleMobileMenu}
				class="z-50 p-2 cursor-pointer"
				aria-label={isMenuOpen ? "Închide meniul" : "Deschide meniul"}
				aria-expanded={isMenuOpen}
				aria-controls="mobile-menu-nav"
			>
				{#if !isMenuOpen}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
				{:else}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{/if}
			</button>
		{/if}
	</div>
</header>

{#if $isMobile && isMenuOpen}
	<div
		bind:this={menuBackdropElement}
		id="mobile-menu-nav"
		class="fixed inset-0 bg-black/95 z-10 flex flex-col items-center justify-center space-y-8"
		transition:fly={{ y: -100, duration: 400, opacity: 0 }}
		on:click|self={closeMobileMenu}
		on:keydown={handleMenuKeyDown}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Meniu de navigare mobil"
	>
		<a href="/despre" on:click={closeMobileMenu} class="text-white/80 hover:text-white text-3xl font-bold uppercase">Despre Noi</a>
		<a href="#preturi" on:click={closeMobileMenu} class="text-white/80 hover:text-white text-3xl font-bold uppercase">Servicii & Tarife</a>
		<a href="#testimoniale" on:click={closeMobileMenu} class="text-white/80 hover:text-white text-3xl font-bold uppercase">Recenzii</a>
		<a href="/contact" on:click={closeMobileMenu} class="mt-8 border border-white rounded-full px-10 py-4 text-xl font-medium uppercase text-white hover:bg-white hover:text-black transition-colors">Contact</a>
	</div>
{/if}