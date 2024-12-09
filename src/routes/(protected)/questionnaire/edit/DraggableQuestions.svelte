<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Badge } from '$lib/components/ui/badge';
	import {
		dndzone,
		dragHandle,
		dragHandleZone,
		overrideItemIdKeyNameBeforeInitialisingDndZones,
		type DndEvent
	} from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { QuestionWithChoices } from '$lib/models/data-model';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id'); // Add this top level?

	export let questions: QuestionWithChoices[];
	export let category: string;

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<QuestionWithChoices>>) {
		questions = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<QuestionWithChoices>>) {
		console.log('update questions for category: ', category);
		console.log('old questions: ', questions);
		console.log('new questions: ', e.detail.items);
		questions = e.detail.items;
	}
</script>

<div
	use:dragHandleZone={{ items: questions, flipDurationMs: flipDurationMs }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each questions as question (question.$id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div use:dragHandle aria-label="drag-handle for question {question.ordering}">
							<GripHorizontal />
						</div>
						{question.ordering}. {question.text}
					</Card.Title>
					<Card.Description>
						{question.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<RadioGroup.Root>
						{#each question.choices as choice}
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value={choice.$id} id={choice.$id} />
								{choice.text}
								<Badge variant="outline">{choice.points}</Badge>
							</div>
						{/each}
					</RadioGroup.Root>
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
