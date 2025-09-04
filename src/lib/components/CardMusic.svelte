<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Progress } from '@skeletonlabs/skeleton-svelte';
 import type { SongInfo } from "$lib/types/song";

   let { song }: { song: SongInfo } = $props();
  const imgSrc =
    'https://images.unsplash.com/photo-1463171515643-952cee54d42a?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  let isPlaying = $state(false);
  let showMenu = $state(false);


  function togglePlay() {
    isPlaying = !isPlaying;
  }

  function nextSong() {
    console.log('Next song 🎶');
  }

  function prevSong() {
    console.log('Previous song 🎶');
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function segnala() {
    console.log('Segnalazione inviata 🚨');
    showMenu = false;
  }

  function bitrate() {
    console.log('Mostra bitrate 🎵');
    showMenu = false;
  }
</script>

<div class="flex items-center justify-center p-10 bg-surface-50-900">
  <div
    class="card preset-filled-surface-100-900 border border-surface-200-900 max-w-sm w-full p-3 text-center space-y-6 shadow-xl"
  >
    
    <div class="relative">
      <img
        src={imgSrc}
        alt="cover"
        class="w-full aspect-square object-cover rounded-xl"
      />

      
      <button
        onclick={toggleMenu}
        class="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
      >
        <Icon icon="mdi:dots-vertical" class="w-6 h-6" />
      </button>

     
      {#if showMenu}
        <div
          class="absolute top-12 left-2 bg-surface-100-900 border border-surface-200-800 rounded-xl shadow-lg text-left z-10"
        >
          <ul class="divide-y divide-surface-200-800">
            <li>
              <button onclick={segnala} class="w-full flex items-center gap-2 px-4 py-2 hover:bg-surface-200-800 rounded-xl preset-tonal-error">
            <Icon icon="ph:flag-banner-fill" class="w-5 h-5 opacity-80" />
            <span>Segnala</span>
            </button>
            </li>
            
            <li>
               
            <button onclick={bitrate} class="w-full flex items-center gap-2 px-4 py-2 hover:bg-surface-200-800 rounded-xl preset-tonal-success">
            <Icon icon="fluent:device-eq-16-filled" class="w-5 h-5 opacity-80" />
            <span>Bitrate</span>
            </button>
            </li>
          </ul>
        </div>
      {/if}
    </div>

   
    <div class="space-y-1">
      <h2 class="text-xl font-semibold">{song.title}</h2>
      <p class="text-base opacity-70">{song.artist}</p>
    </div>

   
    <div class="flex items-center justify-center gap-6">
      <button
        onclick={prevSong}
        class="btn variant-ghost-surface p-3 rounded-full"
      >
        <Icon icon="mdi:skip-previous" class="w-8 h-8" />
      </button>

      <button
        onclick={togglePlay}
        class="btn variant-filled-primary p-4 rounded-full"
      >
        {#if isPlaying}
          <Icon icon="mdi:pause-circle" class="w-10 h-10" />
        {:else}
          <Icon icon="mdi:play-circle" class="w-10 h-10" />
        {/if}
      </button>

      <button
        onclick={nextSong}
        class="btn variant-ghost-surface p-3 rounded-full"
      >
        <Icon icon="mdi:skip-next" class="w-8 h-8" />
      </button>
    </div>

    
    <div class="flex w-full flex-col gap-8">
      <Progress value={50} max={100} meterBg="bg-secondary-500" />
    </div>
  </div>
</div>
