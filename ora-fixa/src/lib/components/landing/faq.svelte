<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';

	const faqItems = [
		{
			question: 'Cum pot plăti? Se poate cu cardul?',
			answer: 'Plata se face doar cash. Momentan nu acceptăm plăți cu cardul.'
		},
		{
			question: 'Unde pot parca în zonă?',
			answer:
				'Avem parcare gratuită chiar în fața salonului. De asemenea, există locuri de parcare pe strada laterală, la doar 50m distanță.'
		},
		{
			question: 'Cum pot anula sau modifica o programare?',
			answer:
				'Pentru a anula o programare, accesează secțiunea «Programările mele» de pe site, selectează programarea dorită și apasă «Anulează Programarea». Asigură-te că faci acest lucru cu cel puțin 4 de ore înainte pentru a elibera locul altor clienți.'
		},
		{
			question: 'Este necesară programarea în prealabil?',
			answer:
				'Recomandăm programarea pentru a evita timpul de așteptare. Acceptăm și clienți fără programare, în funcție de disponibilitate.'
		}
	];
</script>

<section id="faq" class="bg-white py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mx-auto max-w-3xl">
			<div class="mb-12 text-center">
				<Badge class="mb-6 border-stone-200 bg-stone-100 px-4 py-2 text-stone-700">
					Întrebări frecvente
				</Badge>
				<h2 class="mb-4 text-4xl font-bold text-stone-900 md:mb-6 md:text-5xl">
					Răspunsuri la întrebările tale.
				</h2>
			</div>
			<Accordion type="single" class="space-y-4">
				{#each faqItems as item, index}
					<AccordionItem
						value={`items-${index + 1}`}
						class="rounded-xl border border-stone-200 px-6"
					>
						<AccordionTrigger class="text-left font-semibold text-stone-900 hover:text-amber-600">
							{item.question}
						</AccordionTrigger>
						<AccordionContent class="text-stone-600">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</div>
</section>
