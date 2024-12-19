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

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Categories</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each categories as category}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								data-active={selectedCategoryId === category.$id}
								onclick={() => dispatch('selectCategory', category.$id)}
							>
								<span
									class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm"
								>
									{category.ordering}
								</span>
								<span>{category.name}</span>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
