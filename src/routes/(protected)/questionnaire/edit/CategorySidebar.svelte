<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { Category } from '$lib/models/data-model';
	import * as Sidebar from '$lib/components/ui/sidebar';

	type Props = {
		categories: Category[];
		selectedCategoryId: string | null;
	};

	let { categories, selectedCategoryId }: Props = $props();
	const dispatch = createEventDispatcher<{
		selectCategory: string;
	}>();
</script>

<Sidebar.Root class="border-r">
	<Sidebar.Header class="border-b px-6 py-4">
		<h2 class="text-lg font-semibold tracking-tight">Categories</h2>
		<p class="text-sm text-muted-foreground">Manage your questionnaire categories</p>
	</Sidebar.Header>

	<Sidebar.Content class="px-4 py-2">
		<Sidebar.Menu>
			{#each categories as category}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						data-active={selectedCategoryId === category.$id}
						onclick={() => dispatch('selectCategory', category.$id)}
						class="group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted {selectedCategoryId ===
						category.$id
							? 'bg-muted'
							: ''}"
					>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary group-hover:bg-primary/20"
						>
							{category.ordering}
						</span>
						<span class="truncate text-sm font-medium">{category.name}</span>
						{#if selectedCategoryId === category.$id}
							<span class="absolute right-2 h-2 w-2 rounded-full bg-primary" />
						{/if}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Content>

	<Sidebar.Footer class="border-t p-4">
		<p class="px-2 text-xs text-muted-foreground">
			Click on a category to view and edit its questions
		</p>
	</Sidebar.Footer>
</Sidebar.Root>
