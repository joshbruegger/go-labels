<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DraggableQuestions from './DraggableQuestions.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import type { Category, Question } from '$lib/models/data-model';
	import EditableQuestionnaire from './EditableQuestionnaire.svelte';

	let { data } = $props();
	// let categories = $state(data.categories);
	// $effect(() => {
	// 	categories = data.categories;
	// });

	let categories: Category[];
</script>

{#await data.categories}
	<div class="space-y-4">
		{#each Array(3) as _}
			<Card.Root class="mb-6 p-4">
				<Card.Header>
					<Skeleton class="h-6 w-48" />
				</Card.Header>
				<Card.Content>
					<Skeleton class="h-24 w-full" />
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{:then categories}
	<EditableQuestionnaire questionnaire={categories} />
{:catch error}
	<Alert.Root variant="destructive">
		<CircleAlert class="size-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>Error loading questionnaire: {error.message}</Alert.Description>
	</Alert.Root>
{/await}
