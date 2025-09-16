<script lang="ts">
  import { Headbar, CardMusic, Player } from "$components";
  import type { SongInfo } from '$lib/types/song';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { parseBlob } from 'music-metadata';



  let songs: SongInfo[] = $state([]);
  let currentSong = $state(1);
  let paused = $state(false);
  let directoriIsSelected = $state(false);

  async function selectFolder() {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
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

      if (songs.length > 0) {
        currentSong = 0;
        paused = false;
        directoriIsSelected = true;
      }
    };

    input.click();
  }

  function nextSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong + 1) % songs.length;
  }

  function prevSong() {
    if (songs.length === 0) return;
    currentSong = (currentSong - 1 + songs.length) % songs.length;
  }

  function isPrev(i: number) {
    if (songs.length === 1) return false;
    return i === (currentSong - 1 + songs.length) % songs.length;
  }

  function isNext(i: number) {
    if (songs.length === 1) return false;
    return i === (currentSong + 1) % songs.length;
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

    <Player {songs} {currentSong} onPrev={prevSong} onNext={nextSong} />
  {:else}
    <div class="flex flex-col items-center justify-center min-h-100 bg-surface-50-900">
      <button
        onclick={selectFolder}
        class="mt-auto mb-12 px-6 py-3 rounded-2xl flex items-center gap-2
               bg-surface-50-800/70 backdrop-blur-md border border-surface-200-700
               shadow-lg shadow-black/40 dark:shadow-white/30
               hover:shadow-xl hover:shadow-black/60 dark:hover:shadow-white/50
               transition-all hover:scale-105 active:scale-95">
        <Icon icon="mdi:folder-music-outline" class="w-6 h-6 opacity-80" />
        <span class="font-medium">Seleziona la tua cartella</span>
      </button>
    </div>
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
  .selected { transform: scale(0.95) translateX(0); }
  .prev { transform: scale(0.75) translateX(-200px); }
  .next { transform: scale(0.75) translateX(200px); }
  .hiddenCard { transform: scale(0.5) translateY(180px); }
}
</style>
