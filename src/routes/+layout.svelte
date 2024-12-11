<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';

	import { Toaster } from '$lib/components/ui/sonner';

	import '../app.css';

	let { children } = $props();
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id');
</script>

<Toaster />
<ModeWatcher />

{@render children()}
