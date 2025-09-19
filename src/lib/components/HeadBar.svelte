<script lang="ts">
  import { AppBar, Avatar } from '@skeletonlabs/skeleton-svelte';
  import { MyDropdownMenu, MyMenu } from '$components';
  
  interface Props {
    isLoadingFolder?: boolean;
    onReloadFolder?: () => void;
    onChangeFolder?: () => void;
    onClearSession?: () => void;
  }
  
  let { 
    isLoadingFolder = false,
    onReloadFolder,
    onChangeFolder,
    onClearSession
  }: Props = $props();
</script>

<AppBar>
  {#snippet lead()}
    <Avatar src="/logo.png" name="skeleton" />
  {/snippet}
  {#snippet trail()}

    <div class="hidden md:block">
      <MyMenu 
        {isLoadingFolder}
        {onReloadFolder}
        {onChangeFolder}
        {onClearSession}
      />
    </div>
    
    
    <div class="block md:hidden">
      <MyDropdownMenu 
        {isLoadingFolder}
        {onReloadFolder}
        {onChangeFolder}
        {onClearSession}
      />
    </div>
  {/snippet}
  <span>Quokkas Player</span>
</AppBar>