<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { responseSchema } from '../schema';
	import QuestionnaireCategory from './category.svelte';

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

	const form = superForm(data.form, {
		validators: zodClient(responseSchema)
	});

	const { enhance } = form;
</script>

<div class="space-y-4">
	<form method="POST" use:enhance>
		{#each data.categories as category}
			<QuestionnaireCategory {category} {form} />
		{/each}

		<Form.Button>Complete Questionnaire</Form.Button>
	</form>
</div>
