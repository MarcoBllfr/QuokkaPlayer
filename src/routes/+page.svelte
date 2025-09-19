<script lang="ts">
  import { Headbar, CardMusic } from "$components";
  import type { SongInfo } from '$lib/types/song';
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { parseBlob } from 'music-metadata';


  interface SavedSongMetadata {
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    fileName: string;
  }

  interface SavedSession {
    songs: SavedSongMetadata[];
    lastUsed: number;
    folderName?: string;
    totalSongs: number;
  }

  let songs: SongInfo[] = $state([]);
  let currentSong = $state(1);
  let paused = $state(false);
  let directoriIsSelected = $state(false);
  let audioPlayer: HTMLAudioElement;
  let showReloadPrompt = $state(false);
  let savedSession: SavedSession | null = $state(null);
  let isLoadingFolder = $state(false);

  let directoryHandle: FileSystemDirectoryHandle | null = null;
  let supportsFileSystemAccess = $state(false);


  onMount(() => {
    supportsFileSystemAccess = 'showDirectoryPicker' in window;
    loadSavedSession();
  });

  function loadSavedSession() {
    const saved = localStorage.getItem('musicPlayerSession');
    if (saved) {
      try {
        savedSession = JSON.parse(saved);
        if (savedSession && savedSession.songs.length > 0) {
          showReloadPrompt = true;
        }
      } catch (err) {
        console.error('Errore caricamento sessione salvata:', err);
        localStorage.removeItem('musicPlayerSession');
      }
    }
  }

  function saveSession(folderName?: string) {
    if (songs.length === 0) return;
    
    const session: SavedSession = {
      songs: songs.map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: song.duration,
        fileName: song.title
      })),
      lastUsed: Date.now(),
      folderName,
      totalSongs: songs.length
    };
    
    localStorage.setItem('musicPlayerSession', JSON.stringify(session));
    console.log(`Sessione salvata: ${songs.length} brani`);
  }

  async function selectFolder() {
    if (supportsFileSystemAccess) {
      await selectFolderModern();
    } else {
      await selectFolderLegacy();
    }
  }

  async function selectFolderModern() {
    try {
      isLoadingFolder = true;
      directoryHandle = await window.showDirectoryPicker();
      await loadSongsFromDirectory(directoryHandle);
      
      if (songs.length > 0) {
        currentSong = 0;
        paused = false;
        directoriIsSelected = true;
        showReloadPrompt = false;
        saveSession(directoryHandle.name);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Errore selezione cartella:', err);
      }
    } finally {
      isLoadingFolder = false;
    }
  }

  async function selectFolderLegacy() {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    input.onchange = async () => {
      if (!input.files) return;
      
      isLoadingFolder = true;
      const files = Array.from(input.files)
        .filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.flac'));
      
      await processMusicFiles(files);
      
      if (songs.length > 0) {
        currentSong = 0;
        paused = false;
        directoriIsSelected = true;
        showReloadPrompt = false;
        
        const folderPath = files[0]?.webkitRelativePath;
        const folderName = folderPath ? folderPath.split('/')[0] : 'Cartella Musica';
        saveSession(folderName);
      }
      
      isLoadingFolder = false;
    };
    
    input.click();
  }

  async function loadSongsFromDirectory(dirHandle: FileSystemDirectoryHandle) {
    const musicFiles: File[] = [];
    
    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'file' && 
          (name.endsWith('.mp3') || name.endsWith('.flac'))) {
        const file = await handle.getFile();
        musicFiles.push(file);
      }
    }
    
    await processMusicFiles(musicFiles);
  }

  async function processMusicFiles(files: File[]) {
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
  }

  async function reloadLastFolder() {
    if (!savedSession) return;
    
    if (supportsFileSystemAccess && directoryHandle) {
      await loadSongsFromDirectory(directoryHandle);
    } else {
      await selectFolder();
    }
  }

  function dismissReloadPrompt() {
    showReloadPrompt = false;
    savedSession = null;
  }

  function clearSavedSession() {
    localStorage.removeItem('musicPlayerSession');
    savedSession = null;
    showReloadPrompt = false;
  }

  function formatLastUsed(timestamp: number): string {
    const now = Date.now();
    const diffHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'meno di un\'ora fa';
    if (diffHours < 24) return `${diffHours} ore fa`;
    if (diffDays === 1) return 'ieri';
    return `${diffDays} giorni fa`;
  }

  function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

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
    if (!audioPlayer) return;
    audioPlayer.pause();
    paused = false;
  }
</script>

<div>
  <Headbar 
    {isLoadingFolder}
    onReloadFolder={reloadLastFolder}
    onChangeFolder={selectFolder}
    onClearSession={clearSavedSession}
  />


  {#if showReloadPrompt && savedSession && !directoriIsSelected}
    <div class="bg-surface-100-800-token p-4 rounded-lg mb-4 border border-primary-500 mx-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-2">
            <Icon icon="mdi:history" class="inline mr-2" />
            Sessione precedente trovata
          </h3>
          <p class="text-sm opacity-80 mb-3">
            {savedSession.folderName || 'Cartella musica'} • 
            {savedSession.totalSongs} brani • 
            {formatLastUsed(savedSession.lastUsed)}
          </p>
          
          <div class="flex gap-2 flex-wrap">
            <button 
              class="btn btn-sm variant-filled-primary"
              onclick={reloadLastFolder}
              disabled={isLoadingFolder}>
              {#if isLoadingFolder}
                <Icon icon="mdi:loading" class="animate-spin mr-1" />
              {:else}
                <Icon icon="mdi:reload" class="mr-1" />
              {/if}
              Ricarica cartella
            </button>
            
            <button 
              class="btn btn-sm variant-outline-surface"
              onclick={selectFolder}
              disabled={isLoadingFolder}>
              <Icon icon="mdi:folder-music" class="mr-1" />
              Nuova cartella
            </button>
          </div>
        </div>
        
        <button 
          class="btn btn-sm variant-ghost-surface"
          onclick={dismissReloadPrompt}
          title="Chiudi">
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  {/if}

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
          <CardMusic {song} />
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
    <div class="flex flex-col items-center justify-center min-h-100 bg-surface-50-900">
      <button
        onclick={selectFolder}
        disabled={isLoadingFolder}
        class="mt-auto mb-12 px-6 py-3 rounded-2xl flex items-center gap-2
               bg-surface-50-800/70 backdrop-blur-md border border-surface-200-700
               shadow-lg shadow-black/40 dark:shadow-white/30
               hover:shadow-xl hover:shadow-black/60 dark:hover:shadow-white/50
               transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100">
        {#if isLoadingFolder}
          <Icon icon="mdi:loading" class="w-6 h-6 opacity-80 animate-spin" />
          <span class="font-medium">Caricamento...</span>
        {:else}
          <Icon icon="mdi:folder-music-outline" class="w-6 h-6 opacity-80" />
          <span class="font-medium">Seleziona la tua cartella</span>
        {/if}
      </button>
    </div>
    {/if}
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