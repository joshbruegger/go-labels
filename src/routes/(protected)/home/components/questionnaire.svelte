<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import {
		superForm,
		type Infer,
		type SuperForm,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { responseSchema, type ResponseSchema } from '../schema';
	import QuestionnaireCategory from './category.svelte';
	import type { CategorizedQuestions } from '$lib/models/data-model';

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
