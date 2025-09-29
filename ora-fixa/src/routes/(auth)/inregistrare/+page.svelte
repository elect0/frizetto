<script lang="ts">
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
	import { User } from '@lucide/svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let { data } = $props();

	const { form, errors, submitting, enhance } = superForm(data.form, {
		validators: zod(registerSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data?.form.message) {
				toast.success('Felicitări!', { description: result.data.form.message });
				goto('/cont/completeaza-profilul', { invalidateAll: true });
			} else if (result.type === 'failure') {
				toast.error('A apărut o eroare', { description: 'Completeaza formularu corect.' });
			}
		},
		resetForm: true
	});
</script>

<div class="w-full">
	<div class="flex h-screen items-center justify-center bg-stone-50 py-12">
		<Card.Root class="mx-3 w-full max-w-sm border-stone-200 shadow-xl md:mb-0">
			<form method="POST" use:enhance class="space-y-4">
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
							class="text-sm"
							name="email"
							placeholder="Ex: alexandrupopescu1@gmail.com"
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
							class="text-sm"
							name="password"
							placeholder="Minim 8 caractere."
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
							class="text-sm"
							name="passwordConfirm"
							placeholder="Repetă parola."
							bind:value={$form.passwordConfirm}
							aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
						/>
						{#if $errors.passwordConfirm}
							<p class="text-sm text-red-600">{$errors.passwordConfirm}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<Checkbox id="terms" required name="terms" />
							<Label for="terms" class="text-sm font-normal">
								Sunt de acord cu
								<a
									href="/termeni-si-conditii"
									class="font-medium text-amber-700 hover:text-amber-800"
								>
									Termenii și Condițiile
								</a>
							</Label>
						</div>

						<div class="flex items-center gap-2">
							<Checkbox id="gdpr" required name="gdpr" />
							<Label for="gdpr" class="text-sm font-normal ">
								Am citit
								<a
									href="/politica-confidentialitate"
									class="font-medium text-amber-700 hover:text-amber-800"
								>
									Politica de Confidențialitate
								</a>
							</Label>
						</div>
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
							<User /> Creează Contul
						{/if}
					</Button>
				</Card.Content>

				<Card.Footer>
					<div class="w-full text-center text-sm">
						Ai deja un cont?
						<a href="/login" class="font-medium text-amber-700 hover:text-amber-800">
							Autentifică-te aici
						</a>
					</div>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>
