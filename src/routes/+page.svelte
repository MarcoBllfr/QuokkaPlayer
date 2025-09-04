<script lang="ts">
  import { Headbar, CardMusic } from "$components";

  interface SongInfo {
    id: number;
    title: string;
    artist: string;
  }

  let songs: SongInfo[] = [
    { id: 1, title: "Dreaming in Code", artist: "Alex Doe" },
    { id: 2, title: "Ocean Waves", artist: "Lia Sun" },
    { id: 3, title: "Neon Nights", artist: "Kai Lin" },
    { id: 4, title: "Silent Forest", artist: "Maya V." }
  ];

  let currentSong = 0;

  function prev() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
  }

  function next() {
    currentSong = (currentSong + 1) % songs.length;
  }

  function isPrev(i: number) {
    return i === (currentSong - 1 + songs.length) % songs.length;
  }

  function isNext(i: number) {
    return i === (currentSong + 1) % songs.length;
  }
</script>

<Headbar />

<div class="flex items-center justify-center bg-surface-50-900 pt-4 sm:pt-8">
  <div class="relative flex items-center justify-center w-full max-w-4xl h-[500px] sm:h-[550px]">
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
</div>

<div class="flex justify-center gap-4 mt-6">
  <button onclick={prev} class="btn variant-filled-primary">Prev</button>
  <button onclick={next} class="btn variant-filled-primary">Next</button>
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
