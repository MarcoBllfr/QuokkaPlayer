<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import Icon from '@iconify/svelte';
  import ThemeSwitch from './ThemeSwitch.svelte';
  
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
  
  function handleReloadFolder() {
    onReloadFolder?.();
  }
  
  function handleChangeFolder() {
    onChangeFolder?.();
  }
  
  function handleClearSession() {
    onClearSession?.();
  }
  

  let hasSavedSession = $state(false);
  
  $effect(() => {
    const saved = localStorage.getItem('musicPlayerSession');
    hasSavedSession = !!saved;
  });
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 select-none items-center justify-center rounded-full border text-sm font-medium active:scale-[0.98] transition-all"
  >
    <Icon icon="mdi:dots-horizontal" class="text-foreground h-6 w-6" />
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      class="border-muted bg-background/95 backdrop-blur-md shadow-popover outline-hidden focus-visible:outline-hidden w-[280px] rounded-xl border px-1 py-1.5 z-[9999]"
      sideOffset={8}
    >
      
   
      <div class="flex items-center justify-between py-3 pl-3 pr-1.5">
        <div class="flex items-center">
          <Icon icon="mdi:theme-light-dark" class="text-foreground-alt mr-2 size-5" />
          <span class="text-sm font-medium">Tema</span>
        </div>
        <ThemeSwitch />
      </div>

      <DropdownMenu.Separator class="bg-muted -mx-1 my-1 h-px" />
      
      
      {#if hasSavedSession}
        <DropdownMenu.Item
          onclick={handleReloadFolder}
          disabled={isLoadingFolder}
          class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-center">
            {#if isLoadingFolder}
              <Icon icon="mdi:loading" class="text-foreground-alt mr-2 size-5 animate-spin" />
            {:else}
              <Icon icon="mdi:reload" class="text-foreground-alt mr-2 size-5" />
            {/if}
            Ricarica Cartella
          </div>
        </DropdownMenu.Item>
      {/if}
      

      <DropdownMenu.Item
        onclick={handleChangeFolder}
        disabled={isLoadingFolder}
        class="rounded-button data-highlighted:bg-primary-500/10 hover:bg-primary-500/20 ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-primary-500"
      >
        <div class="flex items-center">
          <Icon icon="mdi:folder-music" class="mr-2 size-5" />
          {hasSavedSession ? 'Cambia Cartella' : 'Seleziona Cartella'}
        </div>
      </DropdownMenu.Item>
      

      {#if hasSavedSession}
        <DropdownMenu.Item
          onclick={handleClearSession}
          class="rounded-button data-highlighted:bg-error-500/10 hover:bg-error-500/20 ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer text-error-500 font-semibold"
        >
          <div class="flex items-center">
            <Icon icon="mdi:delete" class="mr-2 size-5" />
            Elimina Sessione
          </div>
        </DropdownMenu.Item>
      {/if}
      
   
      <DropdownMenu.Separator class="bg-muted -mx-1 my-1 h-px" />
      
      
      <DropdownMenu.Sub>
  <DropdownMenu.SubTrigger
    class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted 
           ring-0! ring-transparent! flex h-10 select-none items-center 
           py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
  >
    <div class="flex items-center">
      <Icon icon="mdi:information" class="text-foreground-alt mr-2 size-5" />
      Info
    </div>
    <div class="ml-auto flex items-center">
      <Icon icon="mdi:chevron-down" class="text-foreground-alt size-4" />
    </div>
  </DropdownMenu.SubTrigger>

  <DropdownMenu.Portal>
    <DropdownMenu.SubContent
      side="bottom"
      align="start"
      sideOffset={6}
      class="border-muted bg-background/95 backdrop-blur-md shadow-popover 
             ring-0! ring-transparent! w-[200px] rounded-xl border px-1 py-1.5 
             outline-none z-[9999]"
    >
      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! 
               flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm 
               font-medium focus-visible:outline-none cursor-pointer"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center">
            <Icon icon="mdi:information" class="text-foreground-alt mr-2 size-4" />
            Versione
          </div>
          <span class="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </DropdownMenu.Item>

      <DropdownMenu.Separator class="bg-muted -mx-1 my-1 h-px" />

      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! 
               flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm 
               font-medium focus-visible:outline-none cursor-pointer"
      >
        <div class="flex items-center">
          <Icon icon="mdi:github" class="text-foreground-alt mr-2 size-4" />
         <span><a href="https://github.com/MarcoBllfr/QuokkaPlayer">GitHub</a></span>
        </div>
      </DropdownMenu.Item>

      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! 
               flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm 
               font-medium focus-visible:outline-none cursor-pointer"
      >
        <div class="flex items-center">
          <Icon icon="mdi:help-circle" class="text-foreground-alt mr-2 size-4" />
          Aiuto
        </div>
      </DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Portal>
</DropdownMenu.Sub>
      
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>