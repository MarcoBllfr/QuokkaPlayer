<script lang="ts">
  import { Menubar } from "bits-ui";
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
  
  
  let hasSavedSession = $state(false);
  
  $effect(() => {
    const saved = localStorage.getItem('musicPlayerSession');
    hasSavedSession = !!saved;
  });
</script>

<Menubar.Root
  class="rounded-10px border-dark-10 bg-background-alt shadow-mini flex h-12 items-center gap-1 border px-[3px]"
>
  
  <div class="px-2.5">
    <Icon icon="mdi:music" class="size-6" />
  </div>
  
  
  <Menubar.Menu>
    <Menubar.Trigger
      class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
    >
      Cartella
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background/95 backdrop-blur-md shadow-popover focus-visible:outline-hidden z-[9999] w-fit min-w-[200px] rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
     
        <Menubar.Item
          onclick={onChangeFolder}
          disabled={isLoadingFolder}
          class="rounded-button data-highlighted:bg-primary-500/10 hover:bg-primary-500/20 flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-primary-500"
        >
          <div class="flex items-center gap-2">
            <Icon icon="mdi:folder-music" class="size-4" />
            {hasSavedSession ? 'Cambia Cartella' : 'Seleziona Cartella'}
          </div>
        </Menubar.Item>
     
        {#if hasSavedSession}
          <Menubar.Item
            onclick={onReloadFolder}
            disabled={isLoadingFolder}
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center gap-2">
              {#if isLoadingFolder}
                <Icon icon="mdi:loading" class="size-4 animate-spin" />
              {:else}
                <Icon icon="mdi:reload" class="size-4" />
              {/if}
              Ricarica Cartella
            </div>
          </Menubar.Item>
          
          <Menubar.Separator class="bg-muted my-1 -ml-1 -mr-1 block h-px" />
          
          
          <Menubar.Item
            onclick={onClearSession}
            class="rounded-button data-highlighted:bg-error-500/10 hover:bg-error-500/20 flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer text-error-500 font-semibold"
          >
            <div class="flex items-center gap-2">
              <Icon icon="mdi:delete" class="size-4" />
              Elimina Sessione
            </div>
          </Menubar.Item>
        {/if}
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>

  
  <Menubar.Menu>
    <Menubar.Trigger
      class="data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
    >
      Tema
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background/95 backdrop-blur-md shadow-popover focus-visible:outline-hidden z-[9999] w-fit min-w-[180px] rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        
        <div class="flex items-center justify-between py-3 pl-3 pr-1.5">
          <div class="flex items-center gap-2">
            <Icon icon="mdi:theme-light-dark" class="size-4" />
            <span class="text-sm font-medium">Modalità</span>
          </div>
          <ThemeSwitch />
        </div>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger
      class="data-highlighted:bg-muted data-[state=open]:bg-muted mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
    >
      Info
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background/95 backdrop-blur-md shadow-popover focus-visible:outline-hidden z-[9999] w-fit min-w-[160px] rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:information" class="size-4" />
              <span>Versione</span>
            </div>
            <span class="text-xs text-muted-foreground">v1.0.0</span>
          </div>
        </Menubar.Item>
        
        <Menubar.Separator class="bg-muted my-1 -ml-1 -mr-1 block h-px" />
        
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <Icon icon="mdi:github" class="size-4" />
            <span><a href="https://github.com/MarcoBllfr/QuokkaPlayer">GitHub</a></span>
          </div>
        </Menubar.Item>
        
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <Icon icon="mdi:help-circle" class="size-4" />
            <span>Aiuto</span>
          </div>
        </Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>