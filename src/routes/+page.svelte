<script lang="ts">
  import { Headbar, CardMusic } from "$components";
  import type { SongInfo } from '$lib/types/song';
    import { Progress } from "@skeletonlabs/skeleton-svelte";

  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  let songs: SongInfo[] = $state([]);
  let currentSong = $state(0);
  let duration = $state("0:00");
  let isPlaying = $state(false);

  onMount(async () => {
    const res = await fetch('/data/songs.json');
    if (res.ok) {
      songs = await res.json();
      duration = songs[currentSong].duration;
    } else {
      console.error("Errore caricando il JSON delle canzoni:", res.status);
    }
  });

  function nextSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong + 1) % songs.length;
    isPlaying = true;
    duration = songs[currentSong].duration;
  }

  function prevSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    isPlaying = true;
    duration = songs[currentSong].duration;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
  }

  
  function isPrev(i: number) {
    return i === (currentSong - 1 + songs.length) % songs.length;
  }

  function isNext(i: number) {
    return i === (currentSong + 1) % songs.length;
  }
</script>

<Headbar />

<div class="flex flex-col items-center justify-center bg-surface-50-900 pt-4 sm:pt-8 gap-4">
  
  <div class="relative flex items-center justify-center w-full max-w-4xl h-[500px] sm:h-[550px] overflow-hidden">
    {#each songs as song, i}
      <div
        class="absolute transition-all duration-500"
        class:selected={i === currentSong}
        class:prev={isPrev(i)}
        class:next={isNext(i)}
        class:hiddenCard={!isPrev(i) && !isNext(i) && i !== currentSong}
      >
        <CardMusic song={song} />
      </div>
    {/each}
  </div>

  
  <div class="flex items-center justify-center w-full sm:max-w-md gap-2 px-3 ">
  <span class="text-sm opacity-70 w-10 text-right">0:00</span>
  <div class="flex-1">
    <Progress value={50} max={100} meterBg="bg-secondary-500" />
  </div>
  <span class="text-sm opacity-70 w-10 text-left">{duration}</span>
</div>

  
  <div class="flex items-center justify-center gap-6">
    <button onclick={prevSong} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-previous" class="w-8 h-8" />
    </button>

    <button onclick={togglePlay} class="btn variant-filled-primary p-4 rounded-full">
      {#if isPlaying}
        <Icon icon="mdi:pause-circle" class="w-10 h-10" />
      {:else}
        <Icon icon="mdi:play-circle" class="w-10 h-10" />
      {/if}
    </button>

    <button onclick={nextSong} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-next" class="w-8 h-8" />
    </button>
  </div>
</div>

<style>
.selected {
  transform: scale(0.85) translateX(0);
  opacity: 1;
  z-index: 30;
}

.prev {
  transform: scale(0.65) translateX(-100px);
  opacity: 0.6;
  z-index: 20;
}

.next {
  transform: scale(0.65) translateX(100px);
  opacity: 0.6;
  z-index: 20;
}

.hiddenCard {
  transform: scale(0.45) translateY(120px);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

@media (min-width: 640px) {
  .selected {
    transform: scale(0.95) translateX(0);
  }
  .prev {
    transform: scale(0.75) translateX(-200px);
  }
  .next {
    transform: scale(0.75) translateX(200px);
  }
  .hiddenCard {
    transform: scale(0.5) translateY(180px);
  }
}
</style>
