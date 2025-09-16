<script lang="ts">
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import Icon from "@iconify/svelte";

  const { songs = [], currentSong = 0, onPrev, onNext } = $props<{
    songs: { url: string; duration: number; title?: string; artist?: string; cover?: string }[];
    currentSong: number;
    onPrev: () => void;
    onNext: () => void;
  }>();

  let paused = $state(false);
  let audioPlayer: HTMLAudioElement;
  let progress = $state(0);

  function togglePlay() {
    if (!audioPlayer) return;
    if (paused) {
      audioPlayer.pause();
      paused = false;
    } else {
      audioPlayer.play();
      paused = true;
    }
  }

  function onTimeUpdate() {
    if (!audioPlayer?.duration) return;
    progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  }

  function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

 
  $effect(() => {
    if (songs[currentSong] && audioPlayer) {
      audioPlayer.src = songs[currentSong].url;
      if (paused) audioPlayer.play();
    }
  });
</script>


<audio
  bind:this={audioPlayer}
  ontimeupdate={onTimeUpdate}
  onended={onNext}
></audio>

<div class="flex flex-col items-center gap-2 w-full sm:max-w-md">

 
  <div class="flex items-center justify-center w-full gap-2 px-3">
    <span class="text-sm opacity-70 w-10 text-right">0:00</span>
    <div class="flex-1">
      <Progress value={progress} max={100} meterBg="bg-secondary-500" />
    </div>
    <span class="text-sm opacity-70 w-10 text-left">
      {formatDuration(songs[currentSong]?.duration ?? 0)}
    </span>
  </div>


  <div class="flex items-center justify-center gap-6 mt-2">
    <button onclick={onPrev} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-previous" class="w-8 h-8" />
    </button>

    <button onclick={togglePlay} class="btn variant-filled-primary p-4 rounded-full">
      {#if paused}
        <Icon icon="mdi:pause-circle" class="w-10 h-10" />
      {:else}
        <Icon icon="mdi:play-circle" class="w-10 h-10" />
      {/if}
    </button>

    <button onclick={onNext} class="btn variant-ghost-surface p-3 rounded-full">
      <Icon icon="mdi:skip-next" class="w-8 h-8" />
    </button>
  </div>
</div>
