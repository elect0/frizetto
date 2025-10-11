<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Angry, Frown, Meh, Smile, Laugh, Send } from '@lucide/svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { reviewSchema } from '$lib/schemas';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const { form, enhance } = superForm(data.form, {
		validators: zod(reviewSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.form.message);
				goto('/cont');
			} else if (result.type === 'failure') {
				toast.error(result.data?.form.message);
			}
		}
	});
</script>

<div class="flex min-h-screen items-center bg-white py-32">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold text-stone-900 md:mb-6 md:text-5xl">
				Cum ți s-a părut <br /> experiența?
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-stone-600 md:text-xl">
				Ne-ar plăcea să știm cum te-ai simțit. Lasă-ne o recenzie sinceră și ajută-i și pe ceilalți
				să afle ce merită cu adevărat.
			</p>
			<form
				action="?/review"
				method="POST"
				class="mt-10 flex flex-col items-center space-y-6"
				use:enhance
			>
				<RadioGroup.Root
					bind:value={$form.mood}
					name="mood"
					class="grid max-w-sm grid-cols-5 gap-5"
				>
					<div class="w-fit">
						<RadioGroup.Item value="angry" id="angry" class="peer sr-only" />
						<Label
							for="angry"
							class="block w-fit cursor-pointer rounded-full border-2 border-stone-200 bg-stone-50 p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-50"
						>
							<Angry />
						</Label>
					</div>
					<div class="w-fit">
						<RadioGroup.Item value="frown" id="frown" class="peer sr-only" />
						<Label
							for="frown"
							class="block w-fit cursor-pointer rounded-full border-2 border-stone-200 bg-stone-50 p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-100"
						>
							<Frown />
						</Label>
					</div>
					<div class="w-fit">
						<RadioGroup.Item value="meh" id="meh" class="peer sr-only" />
						<Label
							for="meh"
							class="block w-fit cursor-pointer rounded-full border-2 border-stone-200 bg-stone-50 p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-100"
						>
							<Meh />
						</Label>
					</div>
					<div class="w-fit">
						<RadioGroup.Item value="smile" id="smile" class="peer sr-only" />
						<Label
							for="smile"
							class="block w-fit cursor-pointer rounded-full border-2 border-stone-200 bg-stone-50 p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-100"
						>
							<Smile />
						</Label>
					</div>
					<div class="w-fit">
						<RadioGroup.Item value="laugh" id="laugh" class="peer sr-only" />
						<Label
							for="laugh"
							class="block w-fit cursor-pointer rounded-full border-2 border-stone-200 bg-stone-50 p-4 transition-all peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 peer-data-[state=checked]:shadow-lg hover:bg-stone-100"
						>
							<Laugh />
						</Label>
					</div>
				</RadioGroup.Root>
				<Textarea
					bind:value={$form.reviewContent}
					name="reviewContent"
					placeholder="Împărtășește-ne cum te-ai simțit și ce ți-a plăcut cel mai mult."
					class="h-[150px] max-w-lg border-stone-200 bg-stone-50 text-sm md:text-base"
				/>
				<input type="hidden" value={data.session?.user.id} name="userId" />
				<input type="hidden" value={data.appointment.id} name="appointmentId" />
				<Button type="submit" class="w-full max-w-lg py-5"><Send /> Trimite</Button>
			</form>
		</div>
	</div>
</div>
