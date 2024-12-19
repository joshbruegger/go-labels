<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';
	import CategorySidebar from './CategorySidebar.svelte';
	import DraggableQuestions from './DraggableQuestions.svelte';

	let { data } = $props();
	let selectedCategoryId = $state<string | null>(null);

	// Set initial selected category when data loads
	$effect(() => {
		if (data.categories instanceof Promise) {
			data.categories.then((categories) => {
				if (categories.length > 0) {
					selectedCategoryId = categories[0].$id;
				}
			});
		}
	});

	function handleSelectCategory(event: CustomEvent<string>) {
		selectedCategoryId = event.detail;
	}
</script>

<Sidebar.Provider>
	{#await data.categories}
		<div class="flex h-screen items-center justify-center">
			<Skeleton class="h-[500px] w-[200px]" />
		</div>
	{:then categories}
		<CategorySidebar {categories} {selectedCategoryId} on:selectCategory={handleSelectCategory} />
	{:catch error}
		<Alert.Root variant="destructive">
			<CircleAlert class="size-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>Error loading categories: {error.message}</Alert.Description>
		</Alert.Root>
	{/await}

	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center border-b px-4">
			<div class="flex items-center gap-2">
				<h1 class="text-xl font-bold tracking-tight">Edit Questionnaire</h1>
			</div>
		</header>

		<div class="container mx-auto max-w-5xl space-y-6 p-6">
			{#await data.categories}
				<div class="space-y-6">
					{#each Array(3) as _}
						<Card.Root>
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
				{#if selectedCategoryId}
					{@const selectedCategory = categories.find((c) => c.$id === selectedCategoryId)}
					{#if selectedCategory}
						<Card.Root
							class={cn(
								'transition-all hover:shadow-md',
								'border-l-4',
								selectedCategory.ordering % 2 === 0 ? 'border-l-primary' : 'border-l-secondary'
							)}
						>
							<Card.Header>
								<Card.Title class="flex items-center gap-2 text-xl">
									<span
										class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted"
									>
										{selectedCategory.ordering}
									</span>
									<span>{selectedCategory.name}</span>
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<DraggableQuestions
									categoryIdx={categories.indexOf(selectedCategory)}
									questions={selectedCategory.questions}
								/>
							</Card.Content>
						</Card.Root>
					{/if}
				{:else}
					<Alert.Root>
						<Alert.Title>No category selected</Alert.Title>
						<Alert.Description>Please select a category from the sidebar.</Alert.Description>
					</Alert.Root>
				{/if}
			{:catch error}
				<Alert.Root variant="destructive">
					<CircleAlert class="size-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>Error loading questionnaire: {error.message}</Alert.Description>
				</Alert.Root>
			{/await}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
