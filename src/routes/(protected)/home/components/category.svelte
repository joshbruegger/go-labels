<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import QuestionnaireQuestion from './question.svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	let { category, form } = $props<{
		category: any;
		form: SuperForm<any>;
	}>();
</script>

<Card class="mb-6 p-4">
	<CardHeader>
		<h2 class="mb-4 text-xl font-bold">{category.name}</h2>
	</CardHeader>
	<CardContent>
		{#each category.questions as question}
			<QuestionnaireQuestion {question} {form} categoryId={category.$id} />
		{/each}
	</CardContent>
</Card>
