<script lang="ts">
	import { tick } from 'svelte';

	type Props = {
		value: string;
		required?: boolean;
		onValueChange?: (original: string) => void;
	};
	let { value = $bindable(), required = true, onValueChange }: Props = $props();

	let editing = $state(false);
	let original = value;

	let inputRef = $state<HTMLInputElement>();

	async function edit() {
		editing = true;
		// wait for the next tick to focus the input
		await tick();
		inputRef?.focus();
		// check this https://stackoverflow.com/questions/57257499/how-to-focus-on-newly-added-inputs-in-svelte
	}

	function keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			editing = false;
			if (value != original) {
				onValueChange?.(value);
				original = value;
			}
		}
	}
</script>

{#if editing}
	<input
		bind:value
		bind:this={inputRef}
		onfocus={(e) => e.currentTarget.click()}
		onblur={() => (editing = false)}
		{required}
		class="m-0 w-full bg-transparent p-1 leading-normal outline-none focus:ring-0"
		onkeydown={keydown}
	/>
{:else}
	<div
		role="button"
		onkeypress={edit}
		tabindex="0"
		onclick={edit}
		class=" w-full p-1 leading-normal"
	>
		{value}
	</div>
{/if}
