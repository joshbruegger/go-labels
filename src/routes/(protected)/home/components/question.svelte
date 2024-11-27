<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardFooter
	} from '$lib/components/ui/card';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import type { ResponseSchema } from '../schema';
	import type { Question } from '$lib/models/data-model';

	let { question, form, categoryId } = $props<{
		question: Question;
		form: SuperValidated<Infer<ResponseSchema>>;
		categoryId: string;
	}>();

	async function handleResponse(categoryId: string, questionId: string, answerId: string) {
		toast('Response: ' + answerId);
	}
</script>

<Form.Field {form} name="question_id">
	<Form.Control>
		{#snippet children({ props })}
			<Card>
				<CardHeader>
					<Form.Label>
						<h3 class="mb-4 text-xl font-bold">
							{question.text}
						</h3>
					</Form.Label>
				</CardHeader>
				<CardDescription>
					{question.description}
				</CardDescription>
				<CardContent>
					<RadioGroup
						{...props}
						onValueChange={(value) => handleResponse(categoryId, question.$id, value)}
					>
						{#each question.choices as choice}
							<div class="flex items-center space-x-2">
								<RadioGroupItem value={choice.$id} id={choice.$id} />
								<Form.Label for={choice.$id}>
									{choice.text}
									<Badge variant="outline">{choice.points}</Badge>
								</Form.Label>
							</div>
						{/each}
					</RadioGroup>
				</CardContent>
				<CardFooter>
					{#if question.requires_evidence}
						<Badge variant="destructive">Requires Evidence</Badge>
					{/if}
				</CardFooter>
			</Card>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
