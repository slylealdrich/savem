<script lang="ts">
  import type { DeleteEntrySchema, UpdateEntrySchema } from "$lib/schemas";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import Modal from "./Modal.svelte";
  import type { EntryWithTag } from "$lib/prisma";
  import EditEntryForm from "./EditEntryForm.svelte";
  import type { Tag } from "@prisma/client";
  import { formatAmountToCurrencyString } from "$lib/utils";
  import { format } from "date-fns-tz";
  import { toZonedTime } from "date-fns-tz/toZonedTime";

  const {
    entry,
    tags,
    updateEntryData,
    deleteEntryData,
  }: {
    entry: EntryWithTag;
    tags: Tag[];
    updateEntryData: SuperValidated<Infer<UpdateEntrySchema>>;
    deleteEntryData: SuperValidated<Infer<DeleteEntrySchema>>;
  } = $props();

  const { enhance: deleteEntryEnhance } = superForm(deleteEntryData, {
    onSubmit: () => {
      deleteConfirmationModalVisible = false;
    },
  });

  let deleteConfirmationModalVisible = $state(false);
  let editEntryFormVisible = $state(false);
</script>

<!-- Card -->
<div class="p-2 flex items-center bg-emerald-800 text-center text-emerald-200 rounded-md">
  <div class="basis-11/12 flex items-center divide-x divide-emerald-700">
    <span class="basis-[30%] w-full flex flex-col justify-center items-center">
      <span class="text-sm">
        {format(toZonedTime(entry.date, "UTC"), "MM-dd-yyyy", { timeZone: "UTC" })}
      </span>
      <div class="flex justify-center items-center gap-x-2 text-sm">
        {#if entry.tag}
          <span>
            {entry.tag.name}
          </span>
          <i class="fa-solid fa-tag pt-1" style="color: {entry.tag.color}"></i>
        {:else}
          <span class="text-emerald-700">no tag</span>
        {/if}
      </div>
    </span>
    <div class="basis-[70%] w-full flex flex-col justify-center items-center gap-y-2">
      <span class="text-sm">{entry.description}</span>
      <span class="w-3/4 py-1 bg-emerald-900 text-xl rounded-md">
        {formatAmountToCurrencyString(entry.cents)}
      </span>
    </div>
  </div>
  <div class="basis-1/12 flex justify-around items-center">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="group relative" tabindex="0">
      <button>
        <i class="fa-solid fa-ellipsis text-emerald-700 text-xl"></i>
      </button>
      <div
        class="absolute w-32 z-20 right-0 hidden group-focus-within:grid grid-cols-1 bg-emerald-900 divide-y divide-emerald-800 rounded-md"
      >
        <!-- TODO: add editing functionality -->
        <button onclick={() => (editEntryFormVisible = true)} class="h-12">Edit</button>
        <button onclick={() => (deleteConfirmationModalVisible = true)} class="h-12">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- Edit Form -->
{#if editEntryFormVisible}
  <Modal offClick={() => (editEntryFormVisible = false)}>
    <div class="max-w-[90dvw] lg:max-w-[20dvw]">
      <EditEntryForm {entry} {tags} {updateEntryData} />
    </div>
  </Modal>
{/if}

<!-- Delete Form -->
{#if deleteConfirmationModalVisible}
  <Modal offClick={() => (deleteConfirmationModalVisible = false)}>
    <form
      use:deleteEntryEnhance
      method="post"
      action="?/deleteEntry"
      class="w-[90dvw] max-w-[400px] p-4 flex flex-col gap-y-4 bg-emerald-800 text-emerald-200 rounded-md"
    >
      <input name="id" type="string" value={entry.id} hidden />
      <span class="p-4 text-center text-lg">Delete entry "{entry.description}"?</span>
      <div class="h-10 flex gap-x-2">
        <button
          type="button"
          onclick={() => (deleteConfirmationModalVisible = false)}
          class="basis-1/2 h-full bg-emerald-900 rounded-md"
        >
          No
        </button>
        <button type="submit" class="basis-1/2 h-full bg-emerald-700 rounded-md">Yes</button>
      </div>
    </form>
  </Modal>
{/if}
