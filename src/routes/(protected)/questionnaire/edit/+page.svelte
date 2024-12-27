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

	function handleSelectCategory(id: string) {
		selectedCategoryId = id;
	}
</script>

<Sidebar.Provider>
	{#await data.categories}
		<div class="flex h-screen items-center justify-center">
			<Skeleton class="h-[500px] w-[200px]" />
		</div>
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<h1 class="text-xl font-bold tracking-tight">Loading...</h1>
			</header>
			<div class="container mx-auto max-w-5xl space-y-6 p-6">
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
			</div>
		</Sidebar.Inset>
	{:then categories}
		<CategorySidebar {categories} {selectedCategoryId} onSelected={handleSelectCategory} />
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="ml-2 mr-2 h-4" />
				<h1 class="text-xl font-bold tracking-tight">
					{#if selectedCategoryId}
						{@const selectedCategory = categories.find((c) => c.$id === selectedCategoryId)}
						{selectedCategory?.name ?? 'No category selected'}
					{:else}
						Select a category
					{/if}
				</h1>
			</header>

			<div class="container mx-auto max-w-5xl space-y-6 p-6">
				{#if selectedCategoryId}
					{@const selectedCategory = categories.find((c) => c.$id === selectedCategoryId)}
					{#if selectedCategory}
						<DraggableQuestions
							categoryIdx={categories.indexOf(selectedCategory)}
							questions={selectedCategory.questions}
						/>
					{/if}
				{:else}
					<Alert.Root>
						<Alert.Title>No category selected</Alert.Title>
						<Alert.Description>Please select a category from the sidebar.</Alert.Description>
					</Alert.Root>
				{/if}
			</div>
		</Sidebar.Inset>
	{:catch error}
		<Alert.Root variant="destructive">
			<CircleAlert class="size-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>Error loading categories: {error.message}</Alert.Description>
		</Alert.Root>
	{/await}
</Sidebar.Provider>
