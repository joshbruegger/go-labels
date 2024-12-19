<script lang="ts">
	import type { DndEvent } from 'svelte-dnd-action';
	import { generateKeyBetween } from 'fractional-indexing';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import Plus from 'lucide-svelte/icons/plus';
	import X from 'lucide-svelte/icons/x';
	import { dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { number } from 'zod';

	import type { Choice, Question } from '$lib/models/data-model';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
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

	async function handleAddChoice(question: Question) {
		try {
			const response = await fetch('/api/choices/create', {
				method: 'POST',
				body: JSON.stringify({
					question_id: question.$id,
					text: 'New Choice',
					points: 0
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			if (!response.ok) throw new Error(response.statusText);

			const newChoice = await response.json();
			question.choices = [...(question.choices ?? []), newChoice];

			toast.success('Choice added successfully');
		} catch (e) {
			toast.error('Error adding choice!', {
				description: e instanceof Error ? e.message : 'Please try again.'
			});
		}
	}

	async function handleRemoveChoice(question: Question, choice: Choice) {
		try {
			const response = await fetch('/api/choices/delete', {
				method: 'POST',
				body: JSON.stringify({
					id: choice.$id
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			if (!response.ok) throw new Error(response.statusText);

			// Update UI optimistically
			question.choices = question.choices?.filter((c) => c.$id !== choice.$id) ?? [];

			toast.success('Choice removed successfully');
		} catch (e) {
			toast.error('Error removing choice!', {
				description: e instanceof Error ? e.message : 'Please try again.'
			});
		}
	}
</script>

<div
	use:dragHandleZone={{
		items: questionsReactive,
		flipDurationMs: flipDurationMs
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="space-y-3"
>
	{#each questionsReactive as question, i (question.$id)}
		<div
			animate:flip={{ duration: flipDurationMs }}
			class="group relative rounded-lg border bg-card text-card-foreground transition-all hover:shadow-sm"
		>
			<div class="flex items-start gap-3 p-4">
				<div
					use:dragHandle
					class="mt-1 cursor-grab rounded p-1 hover:bg-muted active:cursor-grabbing"
				>
					<GripHorizontal class="size-5 text-muted-foreground" />
				</div>

				<div class="flex-1 space-y-4">
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<Badge
								variant="outline"
								class="flex h-8 w-8 items-center justify-center rounded-full p-0"
							>
								{i + 1}
							</Badge>
							<InlineEdit
								value={question.text}
								onChangeCallback={(value) => handleQuestionTextChange(question, value)}
								class="flex-1 text-lg font-medium"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<div class="grid gap-2">
							{#each question.choices ?? [] as choice}
								<div class="flex items-center gap-3 rounded-md border bg-card p-2">
									<InlineEdit
										value={choice.text}
										onChangeCallback={(value) => handleChoiceTextChange(choice, value)}
										class="flex-1"
									/>
									<div class="flex items-center gap-1">
										<span class="text-sm text-muted-foreground">Points:</span>
										<InlineEdit
											value={choice.points.toString()}
											onChangeCallback={(value) => handleChoicePointsChange(choice, value)}
											class="w-12 text-center"
										/>
									</div>
									<Button
										variant="ghost"
										size="icon"
										class="size-8"
										onclick={() => handleRemoveChoice(question, choice)}
									>
										<X class="size-4" />
									</Button>
								</div>
							{/each}
							<Button variant="outline" class="w-full" onclick={() => handleAddChoice(question)}>
								<Plus class="mr-2 size-4" />
								Add Choice
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
