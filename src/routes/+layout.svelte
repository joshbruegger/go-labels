<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import '../app.css';
	let { children } = $props();
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id');
</script>

<Toaster />
<ModeWatcher />

{@render children()}
