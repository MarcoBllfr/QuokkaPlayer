<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { SongInfo } from "$lib/types/song";

  let { song }: { song: SongInfo } = $props();
  let showMenu = $state(false);

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function segnala() {
    console.log("Segnalazione inviata 🚨");
    showMenu = false;
  }

  function bitrate() {
    console.log("Mostra bitrate 🎵");
    showMenu = false;
  }
</script>

<div class="flex items-center justify-center p-10 bg-surface-50-900">
  <div
    class="card preset-filled-surface-100-900 border border-surface-200-900 max-w-sm w-full p-3 text-center space-y-6 shadow-xl"
  >
    <div class="relative">
      <img
        src={song.cover}
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
              <button
                onclick={segnala}
                class="w-full flex items-center gap-2 px-4 py-2 hover:bg-surface-200-800 rounded-xl preset-tonal-error"
              >
                <Icon icon="ph:flag-banner-fill" class="w-5 h-5 opacity-80" />
                <span>Segnala</span>
              </button>
            </li>

            <li>
              <button
                onclick={bitrate}
                class="w-full flex items-center gap-2 px-4 py-2 hover:bg-surface-200-800 rounded-xl preset-tonal-success"
              >
                <Icon
                  icon="fluent:device-eq-16-filled"
                  class="w-5 h-5 opacity-80"
                />
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
  </div>
</div>
