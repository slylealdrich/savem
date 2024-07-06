<script lang="ts">
  import type { Snippet } from "svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const { children }: { children: Snippet } = $props();

  let isOpen = $state(false);
</script>

{#if isOpen}
  <div transition:slide={{ duration: 300, easing: quintOut }} class="fixed bottom-12">
    {@render children()}
  </div>
  <button
    type="button"
    onclick={() => (isOpen = false)}
    class="w-full h-12 fixed bottom-0 bg-emerald-600"
  >
    <i class="fa-solid fa-chevron-down"></i>
  </button>
{:else}
  <button
    type="button"
    onclick={() => (isOpen = true)}
    class="w-full h-12 fixed bottom-0 bg-emerald-600"
  >
    <i class="fa-solid fa-chevron-up"></i>
  </button>
{/if}
