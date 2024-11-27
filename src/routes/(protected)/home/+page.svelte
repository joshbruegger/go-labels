<script lang="ts">
	import Questionnaire from './components/questionnaire.svelte';

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
</script>

<Questionnaire {data} />
