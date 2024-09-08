<script lang="ts">
  import CreateEntryForm from "$lib/components/CreateEntryForm.svelte";
  import Entry from "$lib/components/Entry.svelte";
  import SlideMenu from "$lib/components/SlideMenu.svelte";
  import { format, parse } from "date-fns";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();

  const today = new Date();
  const monthFormat = "MMM yyyy";

  let selectedTagName: string = $state("");
  let selectedMonth: string = $state("");

  let tagFilter = $derived(data.tags.filter((tag) => tag.name === selectedTagName)[0]);
  let dateFilter = $derived(parse(selectedMonth, monthFormat, today));

  let filteredEntries = $derived(
    data.entries
      .filter((entry) => {
        if (selectedTagName === "") return true;
        return entry.tagId === tagFilter.id;
      })
      .filter((entry) => {
        if (selectedMonth === "") return true;
        return (
          entry.date.getMonth() === dateFilter.getMonth() &&
          entry.date.getFullYear() === dateFilter.getFullYear()
        );
      })
  );

  let months = $derived([...new Set(data.entries.map((entry) => format(entry.date, monthFormat)))]);

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
    class="w-full p-2 flex justify-center items-center gap-x-2 bg-emerald-900 text-emerald-200 rounded-md"
  >
    <div class="flex flex-col md:flex-row justify-center items-center gap-2">
      <span class="text-lg">Total spent on</span>

      <div class="flex justify-center items-center gap-x-2">
        <select bind:value={selectedTagName} class="min-w-20 p-2 bg-emerald-950 rounded-md">
          <option value="" selected>everything</option>
          {#each data.tags as tag}
            <option id={tag.id}>{tag.name}</option>
          {/each}
        </select>

        <span>in</span>

        <select bind:value={selectedMonth} class="min-w-20 p-2 bg-emerald-950 rounded-md">
          <option value="" selected>all months</option>
          {#each months as month}
            <option id={month}>{month}</option>
          {/each}
        </select>
      </div>
    </div>

    <span class="p-2 bg-emerald-950 text-xl rounded-md">
      ${total / 100n}.{total % 100n < 10 ? "0" + (total % 100n) : total % 100n}
    </span>
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
