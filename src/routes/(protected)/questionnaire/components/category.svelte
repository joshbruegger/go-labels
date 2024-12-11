<script lang="ts">
	import type { FsSuperForm } from 'formsnap';
	import type { Infer, SuperForm, SuperValidated } from 'sveltekit-superforms/client';

	import type { ResponseSchema } from '../schema';
	import type { CategorizedQuestions } from '$lib/models/data-model';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import QuestionnaireQuestion from './question.svelte';

	let {
		category,
		form
	}: { category: CategorizedQuestions; form: FsSuperForm<Record<string, unknown>, any> } = $props();
</script>

<Card class="mb-6 p-4">
	<CardHeader>
		<h2 class="mb-4 text-xl font-bold">{category.ordering}. {category.name}</h2>
	</CardHeader>
	<CardContent>
		{#each category.questions as question}
			<QuestionnaireQuestion {question} {form} categoryId={category.$id} />
		{/each}
	</CardContent>
</Card>
