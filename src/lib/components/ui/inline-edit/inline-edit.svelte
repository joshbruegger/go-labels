<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { tick } from 'svelte';

	import { cn } from '$lib/utils.js';

	let {
		value,
		onChangeCallback,
		class: className,
		...restProps
	}: HTMLTextareaAttributes & {
		onChangeCallback: (newValue: any) => Promise<any>;
	} = $props();

	let editing = $state(false);
	let ref = $state<HTMLTextAreaElement>();
	let text = $state(value);

	async function edit() {
		editing = true;
		await tick();
		ref?.focus();
		autoResize();
	}

	async function onChange() {
		editing = false;
		if (text != value) {
			text = await onChangeCallback(text);
		}
	}

	function autoResize() {
		if (!ref) return;
		ref.style.height = '0';
		const computedStyle = window.getComputedStyle(ref);
		const lineHeight = parseInt(computedStyle.lineHeight);
		const paddingTop = parseInt(computedStyle.paddingTop);
		const paddingBottom = parseInt(computedStyle.paddingBottom);
		const height = ref.scrollHeight - paddingTop - paddingBottom;
		ref.style.height = `${height}px`;
	}
</script>

{#if editing}
	<textarea
		bind:this={ref}
		class={cn(
			'w-full resize-none overflow-hidden bg-transparent p-0 leading-normal outline-none focus:ring-0',
			className
		)}
		bind:value={text}
		onblur={onChange}
		onkeydown={(e) => {
			if (e.key === 'Enter') onChange();
		}}
		oninput={autoResize}
		rows="1"
		{...restProps}
	></textarea>
{:else}
	<div
		role="button"
		onkeydown={edit}
		tabindex="0"
		onclick={edit}
		class={cn('w-full leading-normal', className)}
	>
		{value}
	</div>
{/if}
