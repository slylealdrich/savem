<script lang="ts">
  import AddEntryForm from "$lib/components/AddEntryForm.svelte";
  import Entry from "$lib/components/Entry.svelte";
  import SlideMenu from "$lib/components/SlideMenu.svelte";
  import { fly, blur } from "svelte/transition";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();

  let toasts: string[] = $state([]);

  const addToast = (toast: string) => {
    toasts.push(toast);
    setTimeout(() => toasts.shift(), 2000);
  };
</script>

<div class="p-2 pb-14 grid grid-cols-1 gap-y-2 justify-center">
  <div
    class="w-full p-2 flex justify-center items-center gap-x-4 bg-emerald-900 text-emerald-200 rounded-md"
  >
    <span class="text-lg">Total Spent this Month:</span>
    <span class="p-2 bg-emerald-950 text-xl rounded-md">
      ${data.monthTotal / 100n}.{data.monthTotal % 100n < 10
        ? "0" + (data.monthTotal % 100n)
        : data.monthTotal % 100n}
    </span>
  </div>
  {#each data.entries as entry}
    <Entry
      data={entry}
      deleteForm={data.deleteEntryForm}
      onSuccess={() => {
        addToast(`Successfully deleted "${entry.description}"`);
      }}
    />
  {/each}
</div>

<SlideMenu>
  <div class="p-4">
    <AddEntryForm addEntryData={data.addEntryForm} createTagData={data.createTagForm} />
  </div>
</SlideMenu>

{#each toasts as toast}
  <div class="fixed inset-x-0 top-0 p-2">
    <span
      in:fly={{ y: -100 }}
      out:blur
      class="h-12 flex justify-center items-center bg-emerald-700 text-emerald-200 rounded-md"
    >
      {toast}
    </span>
  </div>
{/each}
