<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		Star,
		Clock,
		DollarSign,
		Rocket,
		Scissors,
		CalendarDays,
		Wallet,
		Check
	} from '@lucide/svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { accountSchema, passwordSchema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data: PageData;

	let localProfileData = { ...data.profileForm.data };

	const {
		form: profile,
		errors: profileErrors,
		enhance: profileEnhance
	} = superForm(data.profileForm, {
		id: 'profile',
		validators: zod(accountSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Profilul a fost actualizat cu succes!');
				invalidateAll();
			} else {
				toast.error('Eroare la actualizarea profilului. Te rugăm să încerci din nou.');
			}
		}
	});

	const {
		form: password,
		errors: passwordErrors,
		enhance: passwordEnhance,
		reset: passwordFormReset,
	} = superForm(data.passwordForm, { id: 'password', validators: zod(passwordSchema), onResult: ({result}) => {
		if(result.type === 'success'){
			toast.success('Parola a fost actualizată. Te poți loga cu noua parolă.')
			passwordFormReset()
		} else {
			toast.error('Parola nu poate fi schimbată. Verifică datele și încearcă din nou.')
		}
	}});

	const {
		form: preferences,
		errors: preferencesErrors,
		enhance: preferencesEnhance
	} = superForm(data.preferencesForm, { id: 'preferences' });

	const nextAppointmentDate = new Date(data.nextAppointment.start_time);
	const fullAppointmentDate = nextAppointmentDate.toLocaleDateString('ro-RO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	const fullAppointmentHour = nextAppointmentDate.toLocaleTimeString('ro-RO', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	$: if (data.profileForm.data) {
		localProfileData = { ...data.profileForm.data };
	}

	$: if (localProfileData) {
		$profile = localProfileData;
	}
</script>

<svelte:head>
	<title>Contul meu - Frizetto</title>
</svelte:head>

<div class="min-h-screen bg-stone-50 py-32">
	<div class="container mx-auto max-w-6xl px-4 lg:px-6">
		<div class="mb-6">
			<h2 class="mb-5 text-4xl font-bold text-stone-900 md:text-5xl">Setările Contului</h2>
			<p class="max-w-2xl text-xl text-stone-600">
				Aici îți poți actualiza detaliile personale, schimba parola și personaliza preferințele de
				comunicare.
			</p>
		</div>
		<div class="grid grid-cols-1 items-center gap-6">
			{#if data.favoriteService}
				<Card.Root
					class=" border-amber-200 bg-amber-50 shadow-lg transition-shadow hover:shadow-xl"
				>
					<Card.Content class="p-6">
						<div class="block md:flex items-center justify-between">
							<div class="flex items-center gap-4">
								<div class="rounded-lg bg-amber-100 p-2">
									<Rocket class="h-6 w-6 text-amber-600" />
								</div>
								<div>
									<h3 class="font-semibold text-amber-900">Rezervare Rapida</h3>
									<p class="text-amber-700">
										Serviciul tau favorite este {data.favoriteService.name}
									</p>
								</div>
							</div><a href={`/?serviceId=${data.favoriteService.id}#booking`}>
							
								<Button class="cursor-pointer mt-4 md:mt-0">Programeaza-l Acum</Button>
							
				 			</a>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card.Root class="border-stone-200 bg-white shadow-lg transition-shadow">
					<Card.Header>
						<Card.Title class="text-2xl">Urmatoarea Programare</Card.Title>
						<Card.Description class="text-md"
							>Vezi detaliile și confirmă următoarea ta programare.</Card.Description
						>
					</Card.Header>
					<Card.Content>
						<h2 class="text-2xl font-bold">{data.nextAppointment.services.name}</h2>
						<div class="mb-4 flex items-center space-x-3">
							<div class="mt-1 flex items-center text-sm text-stone-600">
								<Clock class="mr-1 h-4 w-4" />
								{data.nextAppointment.services.duration_minutes} minute
							</div>
							<div class="mt-1 flex items-center text-sm text-stone-600">
								<Wallet class="mr-1 h-4 w-4" />
								{data.nextAppointment.services.price} lei
							</div>
						</div>
						<Card.Root class="mb-4 border-stone-200 bg-stone-50 shadow-none">
							<Card.Content>
								<div class="flex items-center">
									<div
										class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
									>
										<CalendarDays class="h-5 w-5" />
									</div>
									<div>
										<p class="text-sm text-stone-500">Data si ziua:</p>
										<p class="font-semibold text-stone-800">
											{fullAppointmentDate} • {fullAppointmentHour}
										</p>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
						<a href="/cont/programari">
							<Button variant="default" class="cursor-pointer">Modifica Programarea</Button>
						</a>
					</Card.Content>
				</Card.Root>
				<Card.Root class="border-stone-200 bg-white shadow-lg transition-shadow">
					<Card.Header>
						<Card.Title class="text-2xl">Statutul tau de loialitate</Card.Title>
						<Card.Description class="text-md"
							>Află ce beneficii ai ca membru fidel.</Card.Description
						>
					</Card.Header>
					<Card.Content class="space-y-3">
						<div class="flex items-center">
							<div
								class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
							>
								<Star class="h-5 w-5" />
							</div>
							<div>
								<p class="text-sm text-stone-500">Statut:</p>
								<p class="font-semibold text-stone-800">
									{data.loyaltyStats.status}
								</p>
							</div>
						</div>
						<Separator />
						<div class="flex items-center">
							<div
								class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
							>
								<Check class="h-5 w-5" />
							</div>
							<div>
								<p class="text-sm text-stone-500">Vizite Totale:</p>
								<p class="font-semibold text-stone-800">
									{data.loyaltyStats.totalVisits}
								</p>
							</div>
						</div>
						<Separator />
						<div class="flex items-center">
							<div
								class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
							>
								<Wallet class="h-5 w-5" />
							</div>
							<div>
								<p class="text-sm text-stone-500">Total cheltuit:</p>
								<p class="font-semibold text-stone-800">{data.loyaltyStats.totalSpent} lei</p>
							</div>
						</div>
						<Separator />
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<p class="text-sm text-stone-800">
							Apreciem fiecare vizita, {data.loyaltyStats.name.split(' ')[1]}. Esti un client de
							top.
						</p>
					</Card.Footer>
				</Card.Root>
			</div>
			<Tabs.Root value="profile">
				<Tabs.List class="w-full gap-1.5 bg-transparent">
					<Tabs.Trigger
						class="cursor-pointer border-stone-200 bg-white p-4 shadow-lg ring-0 transition-shadow hover:shadow-xl data-[state=active]:border-amber-600 data-[state=active]:bg-amber-50 data-[state=active]:shadow-xl"
						value="profile">Profil</Tabs.Trigger
					>
					<Tabs.Trigger
						class="cursor-pointer border-stone-200 bg-white p-4 shadow-lg ring-0 transition-shadow hover:shadow-xl data-[state=active]:border-amber-600 data-[state=active]:bg-amber-50 data-[state=active]:shadow-xl"
						value="security">Securitate</Tabs.Trigger
					>
					<Tabs.Trigger
						class="cursor-pointer border-stone-200 bg-white p-4 shadow-lg ring-0 transition-shadow hover:shadow-xl data-[state=active]:border-amber-600 data-[state=active]:bg-amber-50 data-[state=active]:shadow-xl"
						value="notifications">Notificari</Tabs.Trigger
					>
				</Tabs.List>
				<Tabs.Content value="profile" class="mt-4">
					<Card.Root
						class="border border-stone-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
					>
						<Card.Header>
							<Card.Title class="text-2xl font-semibold text-stone-900 md:text-3xl">
								Informatiile Contului
							</Card.Title>
							<Card.Description class="text-md text-stone-600">
								Detaliile tale si informatiile de contact
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="mb-6 flex items-center gap-2">
								<Avatar.Root class="mr-4 h-20 w-20 border-2 border-amber-600 shadow-lg">
									<Avatar.Fallback class="text-md bg-amber-600 font-bold text-white">
										{data.loyaltyStats.name.split('')[0]}
									</Avatar.Fallback>
								</Avatar.Root>
								<div>
									<h3 class="mb-1 text-xl font-semibold text-stone-900 md:text-2xl">
										{data.loyaltyStats.name}
									</h3>
									<p class="text-md mb-2 text-stone-600">Membru din Ianuarie 2025</p>
									<Badge variant="outline" class="items-center bg-stone-100"><Star /> Vip</Badge>
								</div>
							</div>
							<Separator class="mb-6" />
							<form action="?/updateProfile" method="POST" use:profileEnhance>
								<div class="mb-6 grid grid-cols-1 gap-6">
									<div class="grid gap-2">
										<Label class="mb-1" for="full_name">Nume Complet</Label>
										<Input
											type="text"
											id="full_name"
											name="full_name"
											placeholder="Cinca Eduard"
											bind:value={localProfileData.full_name}
											aria-invalid={$profileErrors.full_name ? 'true' : undefined}
										/>
										{#if $profileErrors.full_name}
											<p class="text-sm text-red-600">
												{$profileErrors.full_name}
											</p>
										{/if}
									</div>
									<div class="grid gap-2">
										<Label class="mb-1" for="phone">Numar de telefon</Label>
										<Input
											type="text"
											id="phone"
											name="phone"
											placeholder="0743400883"
											bind:value={localProfileData.phone}
											aria-invalid={$profileErrors.phone ? 'true' : undefined}
										/>
										{#if $profileErrors.phone}
											<p class="text-sm text-red-600">
												{$profileErrors.phone}
											</p>
										{/if}
									</div>
									<div class="grid gap-2">
										<Label class="mb-1" for="notes">Notita Utilizator</Label>
										<Input
											type="text"
											id="notes"
											name="notes"
											placeholder="Ex: Prefer tuns mai scurt pe lateral"
											bind:value={localProfileData.notes}
											aria-invalid={$profileErrors.notes ? 'true' : undefined}
										/>
										{#if $profileErrors.notes}
											<p class="text-sm text-red-600">
												{$profileErrors.notes}
											</p>
										{/if}
									</div>
								</div>
								<Button type="submit" class="w-full cursor-pointer">Salveaza Modificarile</Button>
							</form>
							<!-- TODO: Maybe add card footer -->
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="security" class="mt-4">
					<Card.Root
						class="border border-stone-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
					>
						<Card.Header>
							<Card.Title class="text-2xl font-semibold text-stone-900 md:text-3xl">
								Securitatea Contului
							</Card.Title>
							<Card.Description class="text-md text-stone-600">
								Detaliile tale de securitate si actiuni
							</Card.Description>
						</Card.Header>
						<div class="px-6">
							<Separator />
						</div>
						<Card.Content>
							<form method='POST' action='?/updatePassword' use:passwordEnhance>
								<div class="mb-6 grid grid-cols-1 gap-6">
									<div class="grid gap-2">
										<Label class="mb-1" for="newPassword">Parolă nouă</Label>
										<Input type="password" id="newPassword" name="newPassword" bind:value={$password.newPassword} placeholder="Alege o parolă nouă (minim 8 caractere)" aria-invalid={$passwordErrors.newPassword ? 'true' : undefined} />
										{#if $passwordErrors.newPassword}
										<p class="text-sm text-red-600">
											{$passwordErrors.newPassword}
										</p>
										{/if}
									</div>
									<div class="grid gap-2">
										<Label class="mb-1" for="passwordConfirm">Confirmă parola</Label>
										<Input type="password" id="passwordConfirm" name="passwordConfirm" bind:value={$password.passwordConfirm} placeholder="Reintrodu parola pentru confirmare" aria-invalid={$passwordErrors.passwordConfirm ? 'true' : undefined} />
										{#if $passwordErrors.passwordConfirm}
										<p class="text-sm text-red-600">
											{$passwordErrors.passwordConfirm}
										</p>
										{/if}
									</div>
								</div>
								<Button type='submit' class="w-full cursor-pointer">Actualizează parola</Button>
							</form>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="notifications" class="mt-4">
					<Card.Root
						class="border border-stone-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
					>
						<Card.Header>
							<Card.Title class="text-2xl font-semibold text-stone-900 md:text-3xl">
								Preferinte Notificari
							</Card.Title>
							<Card.Description class="text-md text-stone-600">
								Configureaza mijloacele prin care primesti reminders si notificari.
							</Card.Description>
						</Card.Header>
						<div class="px-6">
							<Separator />
						</div>
						<Card.Content class="space-y-6">
							<div class="flex items-center justify-between">
								<div class="5 space-y-0">
									<Label>Oferte Promotionale</Label>
									<p class="text-muted-foreground text-sm">Recieve special deals and disscounts</p>
								</div>
								<Switch bind:checked={$preferences.marketing_opt_in} />
							</div>
							<div class="flex items-center justify-between">
								<div class="5 space-y-0">
									<Label>Reminder SMS</Label>
									<p class="text-muted-foreground text-sm">Recieve special deals and disscounts</p>
								</div>
								<Switch bind:checked={$preferences.notify_sms_reminder} />
							</div>
							<div class="flex items-center justify-between">
								<div class="5 space-y-0">
									<Label>Notificari Email</Label>
									<p class="text-muted-foreground text-sm">Recieve special deals and disscounts</p>
								</div>
								<Switch bind:checked={$preferences.notify_email_confirmation} />
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
