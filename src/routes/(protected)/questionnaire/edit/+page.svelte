<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import type { PageData } from '../$types';
	import DraggableQuestions from './DraggableQuestions.svelte';

	export let data: PageData;
</script>

<div class="space-y-4">
	{#each data.categories as category}
		<Card.Root class="mb-6 p-4">
			<Card.Header>
				<Card.Title>
					{category.ordering}. {category.name}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<DraggableQuestions bind:questions={category.questions} category={category.name} />
			</Card.Content>
		</Card.Root>
	{/each}
</div>
