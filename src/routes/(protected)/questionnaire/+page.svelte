<script lang="ts">
	import Questionnaire from './components/questionnaire.svelte';
	import EditModeButton from '$lib/components/edit-mode-button.svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';

	// Define the props interface
	interface Props {
		data: {
			submissionId: string;
			categories: any[];
			form: any;
		};
	}

	// Define the props
	export let data: Props['data'];

	// Edit mode state
	let isEditMode = false;
</script>

{#if isEditMode}
	<Alert variant="destructive" class="sticky top-0 z-50">
		<AlertDescription class="flex items-center justify-between">
			<span>You are currently in edit mode</span>
			<Button variant="outline" onclick={() => (isEditMode = false)}>Exit Edit Mode</Button>
		</AlertDescription>
	</Alert>
{/if}

<Questionnaire {data} />
{#if !isEditMode}
	<EditModeButton bind:isEditMode />
{/if}
