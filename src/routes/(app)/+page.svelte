<script lang="ts">
  import AddEntryForm from "$lib/components/AddEntryForm.svelte";
  import Entry from "$lib/components/Entry.svelte";
  import SlideMenu from "$lib/components/SlideMenu.svelte";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();
</script>

<div class="p-2 grid grid-cols-1 gap-y-2">
  {#each data.entries as entry}
    <Entry data={entry} deleteForm={data.deleteEntryForm} />
  {/each}
</div>

<SlideMenu>
  <div class="p-4">
    <AddEntryForm data={data.addEntryForm} />
  </div>
</SlideMenu>
