<script lang="ts">
  import { Headbar, CardMusic } from "$components";
  import type { SongInfo } from '$lib/types/song';
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
 import { parseBlob } from 'music-metadata';

  let songs: SongInfo[] = $state([]);
  let currentSong = $state(1);
  let paused = $state(false);
  let directoriIsSelected=$state(false);
  let audioPlayer: HTMLAudioElement;
  async function selectFolder() {
    // input "file picker" per cartelle
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true; // permette di scegliere intere cartelle
    input.multiple = true;

    input.onchange = async () => {
        if (!input.files) return;

        const files = Array.from(input.files)
            .filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.flac'));

        let idCounter = 0;
        songs = [];

        for (const file of files) {
            try {
                const metadata = await parseBlob(file);

                // cover art (opzionale)
                let cover: string | undefined;
                if (metadata.common.picture && metadata.common.picture.length > 0) {
                    const pic = metadata.common.picture[0];
                    const blob = new Blob([new Uint8Array(pic.data)], { type: pic.format });
                    cover = URL.createObjectURL(blob);
                }

                songs.push({
                    id: idCounter++,
                    title: metadata.common.title || file.name,
                    artist: metadata.common.artist || 'Sconosciuto',
                    album: metadata.common.album,
                    url: URL.createObjectURL(file),
                    cover,
                    duration: metadata.format.duration || 0
                    
                });
            } catch (err) {
                console.error('Errore leggendo metadati di', file.name, err);
            }
        }

        // inizializza prima canzone
        currentSong = 0;
        paused = false;
    };

    input.click();
    directoriIsSelected=true;
}
function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
/*
  onMount(async () => {
    const res = await fetch('/data/songs.json');
    if (res.ok) {
      songs = await res.json();
      duration = songs[currentSong].duration;
    } else {
      console.error("Errore caricando il JSON delle canzoni:", res.status);
    }
  });
*/
  function nextSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong + 1) % songs.length;
    playSong();
    
  }

  function prevSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong();
  
  }
function togglePlay() {
    if (paused) pauseSong();
    else playSong();
}
  
  function isPrev(i: number) {
  if (songs.length === 1) return false;
  return i === (currentSong - 1 + songs.length) % songs.length;
}

function isNext(i: number) {
  if (songs.length === 1) return false;
  return i === (currentSong + 1) % songs.length;
  
}
function playSong() {
    if (!songs[currentSong] || !audioPlayer) return;
    audioPlayer.src = songs[currentSong].url;
    audioPlayer.play();
    paused = true;
}
function pauseSong() {
    audioPlayer.pause();
    paused = false;
}
</script>

<Headbar />

<div class="flex flex-col items-center justify-center bg-surface-50-900 pt-4 sm:pt-8 gap-4">
  {#if directoriIsSelected}
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
  <audio bind:this={audioPlayer} onended={nextSong}></audio>
  
  <div class="flex items-center justify-center w-full sm:max-w-md gap-2 px-3 ">
  <span class="text-sm opacity-70 w-10 text-right">0:00</span>
  <div class="flex-1">
    <Progress value={50} max={100} meterBg="bg-secondary-500" />
  </div>
  <span class="text-sm opacity-70 w-10 text-left">{formatDuration(songs[currentSong]?.duration ?? 0)}</span>
</div>

  
  <div class="flex items-center justify-center gap-6">
    <button onclick={prevSong} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-previous" class="w-8 h-8" />
    </button>

    <button onclick={togglePlay} class="btn variant-filled-primary p-4 rounded-full">
      {#if paused}
        <Icon icon="mdi:pause-circle" class="w-10 h-10" />
      {:else}
        <Icon icon="mdi:play-circle" class="w-10 h-10" />
      {/if}
    </button>

    <button onclick={nextSong} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-next" class="w-8 h-8" />
    </button>
  </div>
  {:else}
  <button onclick={selectFolder}>Seleziona la tua cartella musicale</button>
  {/if}
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
