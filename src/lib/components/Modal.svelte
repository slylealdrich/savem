<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  let backdrop: HTMLDivElement;

  const dispatch = createEventDispatcher<{ offClick: void }>();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === backdrop) dispatch("offClick");
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={backdrop}
  on:click={handleBackdropClick}
  transition:fade|local={{ duration: 50 }}
  class="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur"
>
  <div class="overflow-x-hidden overflow-y-auto">
    <slot />
  </div>
</div>
