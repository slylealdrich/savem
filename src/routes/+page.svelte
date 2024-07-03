<script lang="ts">
  import AddEntryForm from "$lib/components/AddEntryForm.svelte";
  import { format } from "date-fns";
  import { superForm } from "sveltekit-superforms";

  const { data } = $props();

  const { enhance: deleteEntryEnhance } = superForm(data.deleteEntryForm);
</script>

<div class="divide-y">
  <AddEntryForm data={data.addEntryForm} />

  {#each data.entries as entry}
    <div
      class="w-full h-12 px-4 flex justify-start items-center gap-x-4 odd:bg-emerald-100 even:bg-emerald-200"
    >
      <form use:deleteEntryEnhance method="post" action="?/deleteEntry">
        <input name="id" type="string" value={entry.id} class="hidden" />
        <button class="w-8 bg-red-200">X</button>
      </form>
      <p>{format(entry.date, "MM-dd-yyyy")}</p>
      <p>
        ${entry.cents / 100n}.{entry.cents % 100n < 10
          ? "0" + (entry.cents % 100n)
          : entry.cents % 100n}
      </p>
      <p>{entry.description}</p>
    </div>
  {/each}
</div>
