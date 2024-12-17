<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	import type { Category, Question } from '$lib/models/data-model';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';
	import DraggableQuestions from './DraggableQuestions.svelte';

	let { data } = $props();
</script>

<div class="container mx-auto max-w-5xl space-y-6 py-6">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold tracking-tight">Edit Questionnaire</h1>
		<p class="text-muted-foreground">
			Manage your questionnaire categories and questions. Drag to reorder items.
		</p>
	</div>

	<Separator />

	{#await data.categories}
		<div class="space-y-6">
			{#each Array(3) as _}
				<Card.Root class="transition-all">
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
		<div class="space-y-6">
			{#each categories as category}
				<Card.Root
					class={cn(
						'transition-all hover:shadow-md',
						'border-l-4',
						category.ordering % 2 === 0 ? 'border-l-primary' : 'border-l-secondary'
					)}
				>
					<Card.Header>
						<Card.Title class="flex items-center gap-2 text-xl">
							<span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								{category.ordering}
							</span>
							<span>{category.name}</span>
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
</div>
