<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/schemas';
	import { toast } from 'svelte-sonner';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Loader2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const { form, errors, submitting, enhance, message } = superForm(data.form, {
		validators: zod(registerSchema),
		onResult: ({ result }) => {
			console.log('salut');

			if (result.type === 'success' && result.data?.form.message) {
				toast.success('Felicitări!', { description: result.data.form.message });
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				}, 1000);
			} else if (result.type === 'failure') {
				toast.error('A apărut o eroare', { description: 'pula' });
			}
		},
		resetForm: true
	});
</script>

<svelte:head>
	<title>Creează Cont - OraFixa</title>
</svelte:head>

<div class="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
	<div class="bg-muted relative hidden lg:block">
		<img
			src="/barber-signup-bg.jpg"
			alt="Interior barbershop"
			class="h-screen w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
	</div>

	<div class="flex h-screen items-center justify-center bg-stone-50 py-12">
		<Card.Root class="w-full max-w-sm border-stone-200 shadow-xl">
			<form method="POST" use:enhance>
				<Card.Header class="text-center">
					<Card.Title class="text-2xl font-bold">Creează un Cont Nou</Card.Title>
					<Card.Description>Este rapid, simplu și gratuit.</Card.Description>
				</Card.Header>

				<Card.Content class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="nume@exemplu.com"
							bind:value={$form.email}
							aria-invalid={$errors.email ? 'true' : undefined}
						/>

						{#if $errors.email}
							<p class="text-sm text-red-600">{$errors.email}</p>
						{/if}
					</div>

					<div class="grid gap-2">
						<Label for="password">Parolă</Label>
						<Input
							type="password"
							id="password"
							name="password"
							placeholder="Minim 8 caractere"
							bind:value={$form.password}
							aria-invalid={$errors.password ? 'true' : undefined}
						/>
						{#if $errors.password}
							<p class="text-sm text-red-600">{$errors.password}</p>
						{/if}
					</div>

					<div class="grid gap-2">
						<Label for="passwordConfirm">Confirmă Parola</Label>
						<Input
							type="password"
							id="passwordConfirm"
							name="passwordConfirm"
							placeholder="Repetă parola"
							bind:value={$form.passwordConfirm}
							aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
						/>
						{#if $errors.passwordConfirm}
							<p class="text-sm text-red-600">{$errors.passwordConfirm}</p>
						{/if}
					</div>

					<Button
						type="submit"
						class="mb-2 w-full bg-amber-600 text-white hover:bg-amber-700"
						disabled={$submitting}
					>
						{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Se creează...
						{:else}
							Creează Contul
						{/if}
					</Button>
				</Card.Content>

				<Card.Footer>
					<div class="w-full text-center text-sm">
						Ai deja un cont?
						<a href="/login" class="font-medium text-amber-700 underline hover:text-amber-800">
							Autentifică-te aici
						</a>
					</div>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>
