<script lang="ts">
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';

	import { Toaster } from '$lib/components/ui/sonner';

	import '../app.css';

	let { children } = $props();
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id');

	setMode('light');
</script>

<Toaster />
<ModeWatcher defaultMode={'light'} track={false} />

{@render children()}
