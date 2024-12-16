<script lang="ts">
	import { tick } from 'svelte';
	import { on } from 'svelte/events';

	type Props = {
		value: string;
		required?: boolean;
		onValueChange: (newValue: string) => Promise<string>;
	};
	let { value = $bindable(), required = true, onValueChange }: Props = $props();

	let editing = $state(false);

	let text = $state(value);

	let inputRef = $state<HTMLInputElement>();

	async function edit() {
		editing = true;
		await tick();
		inputRef?.focus();
	}

	async function onChange() {
		editing = false;
		if (text != value) {
			text = await onValueChange(text);
		}
	}
</script>

{#if editing}
	<input
		bind:value={text}
		bind:this={inputRef}
		onblur={onChange}
		{required}
		class="m-0 w-full bg-transparent p-1 leading-normal outline-none focus:ring-0"
		onkeydown={(e) => {
			if (e.key === 'Enter') onChange();
		}}
	/>
{:else}
	<div
		role="button"
		onkeydown={edit}
		tabindex="0"
		onclick={edit}
		class=" w-full p-1 leading-normal"
	>
		{value}
	</div>
{/if}
