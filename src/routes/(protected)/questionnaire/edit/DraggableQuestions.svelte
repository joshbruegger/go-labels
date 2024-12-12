<script lang="ts">
	import type { DndEvent, Item } from 'svelte-dnd-action';
	import { generateKeyBetween } from 'fractional-indexing';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import { Client, Databases } from 'node-appwrite';
	import { dndzone, dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';

	import type { Question } from '$lib/models/data-model';
	import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from '$env/static/public';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	type Props = {
		questions: Question[];
		categoryIdx: number;
	};
	let { categoryIdx, questions }: Props = $props();

	// make reactive and update the state on page loads
	let originalQuestions: Question[] | null = $state(null);
	let questionsReactive = $state(questions);

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<Question>>) {
		if (!originalQuestions) originalQuestions = [...questionsReactive];
		questionsReactive = e.detail.items;
	}

	async function resetOrderingIndexes(questions: Question[]) {
		let before: string | null = null;
		questions.forEach(async (q, i) => {
			q.ordering = generateKeyBetween(before, null);
			before = q.ordering;
			await fetch('/api/questions/edit', {
				method: 'POST',
				body: JSON.stringify({
					id: q.$id,
					data: { ordering: q.ordering }
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
		});
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<Question>>): Promise<void> {
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
		console.log('previous:', previous, ' | next:', next);
		const newOrdering = generateKeyBetween(previous, next);

		try {
			const response = await fetch('/api/questions/edit', {
				method: 'POST',
				body: JSON.stringify({
					id: e.detail.info.id,
					data: { ordering: newOrdering }
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
			// if the response is not ok, throw an error
			if (!response.ok) throw new Error('Failed to reorder questions');

			// update the ordering of the moved question
			questionsReactive[newIndex].ordering = newOrdering;
		} catch {
			// rollback to original state if there's an error
			questionsReactive = originalQuestions!;

			toast.error('Error reordering questions', {
				description: 'Failed to reorder questions. Changes have been rolled back.'
			});
		}

		// clear the original questions
		originalQuestions = null;
	}

	let is_editing = false;
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
					<div use:dragHandle aria-label="drag-handle for question {question.ordering}">
						<GripHorizontal />
					</div>
					<Card.Title>
						{categoryIdx}.{question.ordering}
						<!-- <Input type="email" value={question.text} class="max-w-xs" /> -->
						{question.text}
					</Card.Title>
					<Card.Description>
						{question.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="list-disc pl-4 pt-2">
						{#each question.choices as choice}
							<li>
								{choice.text}
								<Badge variant="outline">{choice.points}</Badge>
							</li>
						{/each}
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
