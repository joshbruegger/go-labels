<script lang="ts">
	import Questionnaire from './components/questionnaire.svelte';
	import EditModeButton from '$lib/components/edit-mode-button.svelte';

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

<Questionnaire {data} />
<EditModeButton bind:isEditMode />
