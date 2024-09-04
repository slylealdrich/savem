<script lang="ts">
  import AddEntryForm from "$lib/components/AddEntryForm.svelte";
  import Entry from "$lib/components/Entry.svelte";
  import SlideMenu from "$lib/components/SlideMenu.svelte";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();
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
    <Entry data={entry} deleteForm={data.deleteEntryForm} />
  {/each}
</div>

<SlideMenu>
  <div class="p-4">
    <AddEntryForm
      addEntryData={data.addEntryForm}
      createTagData={data.createTagForm}
      tags={data.tags}
    />
  </div>
</SlideMenu>
