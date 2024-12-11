<script lang="ts">
	import type { Infer, SuperForm, SuperValidated } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ResponseSchema } from '../schema';
	import type { CategorizedQuestions } from '$lib/models/data-model';
	import * as Form from '$lib/components/ui/form';
	import { responseSchema } from '../schema';
	import QuestionnaireCategory from './category.svelte';

	// Define the props interface
	interface Props {
		data: {
			submissionId: string;
			categories: CategorizedQuestions[];
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
