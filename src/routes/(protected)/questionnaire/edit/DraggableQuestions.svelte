<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		dndzone,
		dragHandle,
		dragHandleZone,
		overrideItemIdKeyNameBeforeInitialisingDndZones,
		type DndEvent,
		type Item
	} from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { Question, QuestionWithChoices } from '$lib/models/data-model';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import { Input } from '$lib/components/ui/input';
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id'); // TODO: Add this top level?

	let { questions = $bindable(), category } = $props();

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<Item>>) {
		questions = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Item>>) {
		console.log('update questions for category: ', category);
		console.log('old questions: ', questions);
		console.log('new questions: ', e.detail.items);
		questions = e.detail.items;
	}

	let is_editing = false;
</script>

<div
	use:dragHandleZone={{ items: questions, flipDurationMs: flipDurationMs }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each questions as question (question.$id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Card.Root>
				<Card.Header>
					<div use:dragHandle aria-label="drag-handle for question {question.ordering}">
						<GripHorizontal />
					</div>
					<Card.Title>
						{question.ordering}
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
