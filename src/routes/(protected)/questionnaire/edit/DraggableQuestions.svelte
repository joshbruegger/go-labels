<script lang="ts">
	import type { DndEvent, Item } from 'svelte-dnd-action';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import { dndzone, dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	import type { Question } from '$lib/models/data-model';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	type Props = {
		questions: Question[];
		categoryIdx: number;
	};
	let { categoryIdx, questions }: Props = $props();

	// make reactive and update the state on page loads
	let questionsReactive = $state(questions);
	// $effect(() => {
	// 	questionsReactive = questions;
	// });

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<Question>>) {
		questionsReactive = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Question>>) {
		// reorder the questions
		e.detail.items.forEach((item, idx) => {
			item.ordering = idx + 1;
		});
		questionsReactive = e.detail.items;
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
