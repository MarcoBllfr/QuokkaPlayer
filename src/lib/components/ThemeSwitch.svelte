<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import Icon from '@iconify/svelte';

	let checked = $state(false);

	// Recupera il tema salvato
	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';
	});

	// Quando lo switch cambia
	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		const mode = localStorage.getItem('mode') || 'light';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<Switch
	name="mode"
	checked={checked}
	onCheckedChange={(e) => onCheckedChange(e)}
	controlActive="bg-surface-200"
>
	<!-- Icona quando non attivo -->
	{#snippet inactiveChild()}
		<Icon icon="lucide:sun" class="w-4 h-4 text-yellow-500" />
	{/snippet}

	<!-- Icona quando attivo -->
	{#snippet activeChild()}
        <Icon icon="lucide:moon" class="w-4 h-4 text-surface-700" />
	{/snippet}
</Switch>
