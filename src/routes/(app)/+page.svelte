<script lang="ts">
  import CreateEntryForm from "$lib/components/CreateEntryForm.svelte";
  import Entry from "$lib/components/Entry.svelte";
  import SlideMenu from "$lib/components/SlideMenu.svelte";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();

  let selectedTagName: string = $state("");

  let tagFilter = $derived(data.tags.filter((tag) => tag.name === selectedTagName)[0]);

  let filteredEntries = $derived(
    data.entries.filter((entry) => {
      if (!tagFilter) return true;
      return entry.tagId === tagFilter.id;
    })
  );

  let total = $derived(
    filteredEntries
      .flatMap((entry) => {
        return entry.cents;
      })
      .reduce((sum: bigint, n) => sum + n, 0n)
  );
</script>

<div class="p-2 pb-14 grid grid-cols-1 gap-y-2 justify-center">
  <div
    class="w-full p-2 flex justify-center items-center gap-x-4 bg-emerald-900 text-emerald-200 rounded-md"
  >
    <span class="text-lg">Total Spent this Month:</span>
    <span class="p-2 bg-emerald-950 text-xl rounded-md">
      ${total / 100n}.{total % 100n < 10 ? "0" + (total % 100n) : total % 100n}
    </span>
  </div>
  <div
    class="w-full p-2 flex gap-x-1 justify-center items-center bg-emerald-900 text-emerald-200 rounded-md"
  >
    <span>Filter by tag:</span>
    <select bind:value={selectedTagName} class="w-20 p-1 bg-emerald-950 rounded-md">
      <option></option>
      {#each data.tags as tag}
        <option id={tag.id}>{tag.name}</option>
      {/each}
    </select>
  </div>
  {#each filteredEntries as entry}
    <Entry data={entry} deleteForm={data.deleteEntryForm} />
  {/each}
</div>

<SlideMenu>
  <div class="p-4">
    <CreateEntryForm
      createEntryData={data.createEntryForm}
      createTagData={data.createTagForm}
      tags={data.tags}
    />
  </div>
</SlideMenu>
