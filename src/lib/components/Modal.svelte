<script lang="ts">
  import { type Snippet } from "svelte";
  import { fade } from "svelte/transition";

  let backdrop: HTMLDivElement;

  const { children, offClick }: { children: Snippet; offClick: () => void } = $props();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === backdrop) offClick();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={backdrop}
  onclick={handleBackdropClick}
  transition:fade|local={{ duration: 50 }}
  class="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur"
>
  <div class="overflow-x-hidden overflow-y-auto">
    {@render children()}
  </div>
</div>
