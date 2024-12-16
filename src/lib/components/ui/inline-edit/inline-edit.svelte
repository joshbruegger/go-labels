<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { tick } from 'svelte';

	import { cn } from '$lib/utils.js';

	let {
		value,
		onChangeCallback,
		class: className,
		...restProps
	}: HTMLInputAttributes & {
		onChangeCallback: (newValue: any) => Promise<any>;
	} = $props();

	let editing = $state(false);
	let ref = $state<HTMLInputElement>();
	let text = $state(value);

	async function edit() {
		editing = true;
		await tick();
		ref?.focus();
	}

	async function onChange() {
		editing = false;
		if (text != value) {
			text = await onChangeCallback(text);
		}
	}
</script>

{#if editing}
	<input
		bind:this={ref}
		class={cn('m-0 w-full bg-transparent p-1 leading-normal outline-none focus:ring-0', className)}
		bind:value={text}
		onblur={onChange}
		onkeydown={(e) => {
			if (e.key === 'Enter') onChange();
		}}
		{...restProps}
	/>
{:else}
	<div
		role="button"
		onkeydown={edit}
		tabindex="0"
		onclick={edit}
		class={cn('w-full p-1 leading-normal', className)}
	>
		{value}
	</div>
{/if}
