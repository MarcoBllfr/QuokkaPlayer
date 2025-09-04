<script lang="ts">
import { AppBar, Avatar } from '@skeletonlabs/skeleton-svelte';
  import { ThemeSwitch } from '$components';

</script>

<AppBar >
  {#snippet lead()}
    <Avatar src="src/lib/assets/logo.png" name="skeleton"  />
  {/snippet}
  {#snippet trail()}
	    <ThemeSwitch />
  {/snippet}
  <span>Quokkas Player</span>
</AppBar>

