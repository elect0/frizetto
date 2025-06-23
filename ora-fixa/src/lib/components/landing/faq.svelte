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
			answer:
				'Acceptăm plata cash și cu cardul (Visa, Mastercard). De asemenea, poți plăti și prin transfer bancar sau aplicații mobile (Revolut, ING Pay).'
		},
		{
			question: 'Unde pot parca în zonă?',
			answer:
				'Avem parcare gratuită chiar în fața salonului. De asemenea, există locuri de parcare pe strada laterală, la doar 50m distanță.'
		},
		{
			question: 'Cum pot anula sau modifica o programare?',
			answer:
				'Poți anula sau modifica programarea prin telefon la 0723.456.789 sau prin mesaj WhatsApp. Te rugăm să anunți cu cel puțin 2 ore înainte.'
		},
		{
			question: 'Acceptați și walk-in-uri (fără programare)?',
			answer:
				'Da, acceptăm și clienți fără programare, însă recomandăm programarea în avans pentru a evita timpul de așteptare, mai ales în weekend.'
		},
		{
			question: 'Ce produse folosiți pentru îngrijire?',
			answer:
				'Folosim exclusiv produse premium: American Crew, Reuzel, și Proraso. Toate produsele sunt profesionale și adaptate tipului de păr și piele.'
		}
	];
</script>

<section id="faq" class="bg-white py-24">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="mx-auto max-w-3xl">
			<div class="mb-12 text-center">
				<Badge class="mb-6 border-stone-200 bg-stone-100 px-4 py-2 text-stone-700"
					>Intrebari Frecvente</Badge
				>
				<h2 class="mb-6 text-4xl font-bold text-stone-900 md:text-5xl">
					Raspunsuri la intrebarile tale.
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
