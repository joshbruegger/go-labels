<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DraggableQuestions from './DraggableQuestions.svelte';
	import type { Category, Question } from '$lib/models/data-model';

	type Props = {
		questionnaire: Category[];
	};
	let { questionnaire }: Props = $props();

	// make reactive and update the state on page loads
	let categories = $state(questionnaire);
	$effect(() => {
		categories = questionnaire;
	});

	function updateQuestionnaire(categoryIdx: number, questions: Question[]) {
		console.log('categoryIdx: ', categoryIdx);
		categories[categoryIdx].questions = questions;
	}
</script>

<div class="space-y-4">
	{#each categories as category}
		<Card.Root class="mb-6 p-4">
			<Card.Header>
				<Card.Title>
					{category.ordering}. {category.name}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<DraggableQuestions
					categoryIdx={categories.indexOf(category)}
					bind:questions={category.questions}
					fnUpdate={updateQuestionnaire}
				/>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
