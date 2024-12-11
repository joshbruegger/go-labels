<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	import type { Category, Question } from '$lib/models/data-model';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import DraggableQuestions from './DraggableQuestions.svelte';

	let { data } = $props();
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
						questions={category.questions}
					/>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{:catch error}
	<Alert.Root variant="destructive">
		<CircleAlert class="size-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>Error loading questionnaire: {error.message}</Alert.Description>
	</Alert.Root>
{/await}
