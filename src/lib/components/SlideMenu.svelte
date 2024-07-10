<script lang="ts">
  import type { Snippet } from "svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const { children }: { children: Snippet } = $props();

  let isOpen = $state(false);
</script>

{#if isOpen}
  <div
    transition:slide={{ duration: 300, easing: quintOut }}
    class="fixed w-full lg:w-[50%] bottom-12 flex justify-center"
  >
    {@render children()}
  </div>
  <button
    type="button"
    onclick={() => (isOpen = false)}
    class="fixed w-full lg:w-[50%] h-12 bottom-0 bg-emerald-600 rounded-t-md"
  >
    <i class="fa-solid fa-chevron-down"></i>
  </button>
{:else}
  <button
    type="button"
    onclick={() => (isOpen = true)}
    class="fixed w-full lg:w-[50%] h-12 bottom-0 bg-emerald-600 rounded-t-md"
  >
    <i class="fa-solid fa-chevron-up"></i>
  </button>
{/if}
