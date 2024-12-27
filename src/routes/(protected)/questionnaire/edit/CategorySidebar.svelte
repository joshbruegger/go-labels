<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Ellipsis, Home, Plus } from 'lucide-svelte';

	import type { Category } from '$lib/models/data-model';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let {
		ref = $bindable(null),
		categories,
		selectedCategoryId,
		onSelected,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		categories: Category[];
		selectedCategoryId: string | null;
		onSelected: (id: string) => void;
	} = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<h1 class="p-2 text-lg font-semibold">Edit Questionnaire</h1>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Categories</Sidebar.GroupLabel>
			<Sidebar.GroupAction>
				<Plus /><span class="sr-only">Add Category</span>
			</Sidebar.GroupAction>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each categories as category}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={selectedCategoryId === category.$id}
								onclick={() => onSelected(category.$id)}
							>
								<Home class="h-4 w-4" />
								<span>{category.ordering} {category.name}</span>
							</Sidebar.MenuButton>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuAction {...props}>
											<Ellipsis />
										</Sidebar.MenuAction>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content side="right" align="start">
									<DropdownMenu.Item>
										<span>Edit Icon</span>
									</DropdownMenu.Item>
									<DropdownMenu.Item>
										<span>Delete Category</span>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />

	<Sidebar.Footer class="border-t p-4">
		<p class="px-2 text-xs text-muted-foreground">
			Click on a category to view and edit its questions
		</p>
	</Sidebar.Footer>
</Sidebar.Root>
