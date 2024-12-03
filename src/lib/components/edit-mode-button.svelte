<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Pencil } from 'lucide-svelte';

	export let isEditMode = false;
</script>

<div class="fixed bottom-4 right-4">
	<Button
		variant="secondary"
		size="icon"
		class="h-12 w-12 rounded-full shadow-lg"
		on:click={() => (isEditMode = !isEditMode)}
	>
		<Pencil class="h-6 w-6" />
	</Button>
</div>
