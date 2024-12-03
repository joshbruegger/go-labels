<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import type { ResponseSchema } from '../schema';
	import type { Question } from '$lib/models/data-model';
	import type { FsSuperForm } from 'formsnap';

	let { question, form, categoryId } = $props<{
		question: Question;
		form: FsSuperForm<Record<string, unknown>, any>;
		categoryId: string;
	}>();

	async function handleResponse(categoryId: string, questionId: string, answerId: string) {
		toast('Response: ' + answerId);
	}
</script>

<Form.Field {form} name="question_id">
	<Form.Control>
		{#snippet children({ props })}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						{question.ordering}. {question.text}
					</Card.Title>
					<Card.Description>
						{question.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
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
				</Card.Content>
				<Card.Footer>
					{#if question.requires_evidence}
						<Badge variant="destructive">Requires Evidence</Badge>
					{/if}
				</Card.Footer>
			</Card.Root>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
