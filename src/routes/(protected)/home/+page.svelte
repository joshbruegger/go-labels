<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion/';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Questionnaire from './questionnaire.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	const { submissionId, categories } = data;

	async function handleResponse(categoryId: string, questionId: string, answerId: string) {
		const response = {
			submissionId,
			categoryId,
			questionId,
			answerId
		};

		const result = await fetch('?/saveResponse', {
			method: 'POST',
			body: JSON.stringify({ response })
		});

		if (result.ok) {
			toast.success('Response saved');
		}
	}
</script>

<div class="container mx-auto space-y-6 p-4">
	<h1 class="text-3xl font-bold">Categories</h1>

	<div class="grid gap-6">
		{#each data.categories as category}
			<Card>
				<CardHeader>
					<CardTitle>{category.name}</CardTitle>
					{#if category.description}
						<CardDescription>{category.description}</CardDescription>
					{/if}
				</CardHeader>
				<CardContent>
					<Accordion type="single">
						{#each category.questions as question}
							<AccordionItem value={question.$id}>
								<AccordionTrigger>
									<div class="flex items-center gap-2">
										<span>{question.text}</span>
										<Badge variant={question.requires_evidence ? 'destructive' : 'secondary'}>
											{question.type}
										</Badge>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div class="space-y-4 p-4">
										{#if question.description}
											<p class="text-sm text-muted-foreground">{question.description}</p>
										{/if}
										{#if question.explanation}
											<div class="text-sm">
												<strong>Explanation:</strong>
												{question.explanation}
											</div>
										{/if}
									</div>
								</AccordionContent>
							</AccordionItem>
						{/each}
					</Accordion>
				</CardContent>
			</Card>
		{/each}
	</div>
</div>
