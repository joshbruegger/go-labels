<script lang="ts">
	import type { DndEvent } from 'svelte-dnd-action';
	import { generateKeyBetween } from 'fractional-indexing';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import { dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { number } from 'zod';

	import type { Choice, Question } from '$lib/models/data-model';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import InlineEdit from '$lib/components/ui/inline-edit/inline-edit.svelte';

	type Props = {
		questions: Question[];
		categoryIdx: number;
	};
	let { categoryIdx, questions }: Props = $props();

	// make reactive and update the state on page loads
	let originalQuestions: Question[] | null = $state(null);
	let questionsReactive = $state(questions);

	const flipDurationMs = 300;

	async function handleChoiceTextChange(choice: Choice, newValue: string) {
		const originalText = choice.text; // save for rollback
		choice.text = newValue; // optimistic UI update
		try {
			await postUpdate('choices', choice.$id, { text: choice.text });
		} catch (e) {
			toast.error('Error updating choice!', {
				description: e instanceof Error ? e.message : 'Please try again.'
			});
			// rollback to original state if there's an error
			choice.text = originalText;
		} finally {
			return choice.text;
		}
	}

	async function handleChoicePointsChange(choice: Choice, newValue: string) {
		// try to parse newvalue

		const originalPoints = choice.points; // save for rollback
		try {
			choice.points = parseInt(newValue); // optimistic UI update
			await postUpdate('choices', choice.$id, { points: choice.points });
		} catch (e) {
			toast.error('Error updating choice!', {
				description: e instanceof Error ? e.message : 'Please try again.'
			});
			// rollback to original state if there's an error
			choice.points = originalPoints;
		} finally {
			return choice.points;
		}
	}

	async function postUpdate(endpoint: string, id: string, newData: Partial<Choice>) {
		const response = await fetch('/api/' + endpoint + '/edit', {
			method: 'POST',
			body: JSON.stringify({
				id: id,
				data: newData
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		if (!response.ok) throw new Error(response.statusText);
		return response;
	}

	async function handleQuestionTextChange(question: Question, newValue: string) {
		const originalText = question.text; // save for rollback
		question.text = newValue; // optimistic UI update
		try {
			await postUpdate('questions', question.$id, { text: question.text });
		} catch (e) {
			toast.error('Error updating question!', {
				description: e instanceof Error ? e.message : 'Please try again.'
			});
			// rollback to original state if there's an error
			question.text = originalText;
		} finally {
			return question.text;
		}
	}

	function handleDndConsider(e: CustomEvent<DndEvent<Question>>) {
		if (!originalQuestions) originalQuestions = [...questionsReactive];
		questionsReactive = e.detail.items;
	}

	async function resetOrderingIndexes(questions: Question[]) {
		let before: string | null = null;

		// first replace with index ordering
		questions.forEach(async (q, i) => {
			await postUpdate('questions', q.$id, { ordering: i.toString() });
		});

		// then reset the fractional ordering
		questions.forEach(async (q, i) => {
			q.ordering = generateKeyBetween(before, null);
			before = q.ordering;
			await postUpdate('questions', q.$id, { ordering: q.ordering });
		});
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<Question>>): Promise<void> {
		// resetOrderingIndexes(questionsReactive);
		// return;
		// Optimistic UI update
		questionsReactive = e.detail.items;

		// find the moved question
		const newIndex = questionsReactive.findIndex((q) => q.$id === e.detail.info.id);

		// find if it actually moved, do nothing if it didn't
		if (originalQuestions![newIndex].ordering === questionsReactive[newIndex].ordering) return;

		// generate new ordering key between the previous and next question (null if it's the first or last question)
		let previous = newIndex === 0 ? null : questionsReactive[newIndex - 1].ordering;
		let next =
			newIndex === questionsReactive.length - 1 ? null : questionsReactive[newIndex + 1].ordering;
		const newOrdering = generateKeyBetween(previous, next);

		try {
			const response = await postUpdate('questions', e.detail.info.id, { ordering: newOrdering });
			// if the response is not ok, throw an error

			// update the ordering of the moved question
			questionsReactive[newIndex].ordering = newOrdering;
		} catch {
			// rollback to original state if there's an error
			questionsReactive = originalQuestions!;

			toast.error('Error reordering questions', {
				description: 'Failed to reorder questions. Please try again.'
			});
		}

		// clear the original questions
		originalQuestions = null;
	}
</script>

<div
	use:dragHandleZone={{
		items: questionsReactive,
		flipDurationMs: flipDurationMs
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each questionsReactive as question (question.$id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Card.Root>
				<Card.Header>
					<div
						use:dragHandle
						aria-label="drag-handle for question {categoryIdx}.{questionsReactive.indexOf(
							question
						) + 1}"
					>
						<GripHorizontal />
					</div>
					<Card.Title>
						{categoryIdx}.{questionsReactive.indexOf(question) + 1} ({question.ordering})
						<br />
						<InlineEdit
							value={question.text}
							onChangeCallback={async (newValue) =>
								await handleQuestionTextChange(question, newValue)}
						/>
					</Card.Title>
					<Card.Description>
						{question.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="list-disc pl-4 pt-2">
						{#if question.choices}
							{#each question.choices as choice}
								<li class="flex pb-1 pt-1">
									<Badge variant="outline" class="mr-3 w-16 text-center">
										<InlineEdit
											value={choice.points.toString()}
											class="w-full"
											onChangeCallback={async (newValue) =>
												await handleChoicePointsChange(choice, newValue)}
										/>
									</Badge>
									<InlineEdit
										value={choice.text}
										onChangeCallback={async (newValue) =>
											await handleChoiceTextChange(choice, newValue)}
									/>
								</li>
							{/each}
						{/if}
					</ul>
				</Card.Content>
				<Card.Footer>
					{#if question.requires_evidence}
						<Badge variant="destructive">Requires Evidence</Badge>
					{/if}
				</Card.Footer>
			</Card.Root>
		</div>
	{/each}
</div>
