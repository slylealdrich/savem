<script lang="ts">
  import type { DeleteEntryFormSchema } from "$lib/schemas";
  import { type Entry } from "@prisma/client";
  import { format } from "date-fns";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import Modal from "./Modal.svelte";

  const {
    data,
    deleteForm,
  }: { data: Entry; deleteForm: SuperValidated<Infer<DeleteEntryFormSchema>> } = $props();
  const { enhance: deleteEntryEnhance, submit: submitDeleteEntryForm } = superForm(deleteForm);

  let deleteConfirmationModalVisible = $state(false);
</script>

<!-- Card -->
<div class="p-2 flex items-center bg-emerald-800 text-center text-emerald-200 rounded-md">
  <div class="basis-11/12 flex items-center divide-x divide-emerald-700">
    <span class="basis-[30%] w-full text-sm">{format(data.date, "MM-dd-yyyy")}</span>
    <div class="basis-[70%] w-full flex flex-col justify-center items-center gap-y-2">
      <span class="text-sm">{data.description}</span>
      <span class="w-3/4 py-1 bg-emerald-900 text-xl rounded-md">
        ${data.cents / 100n}.{data.cents % 100n < 10
          ? "0" + (data.cents % 100n)
          : data.cents % 100n}
      </span>
    </div>
  </div>
  <div class="basis-1/12 flex justify-around items-center">
    <div class="group relative">
      <button>
        <i class="fa-solid fa-ellipsis text-emerald-700 text-xl"></i>
      </button>
      <div
        class="absolute w-32 z-20 right-0 hidden group-focus-within:grid grid-cols-1 bg-emerald-900 divide-y divide-emerald-800 rounded-md"
      >
        <!-- TODO: add editing functionality -->
        <button class="h-12">Edit</button>
        <button onclick={() => (deleteConfirmationModalVisible = true)} class="h-12">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- Delete Confirmation -->
{#if deleteConfirmationModalVisible}
  <Modal offClick={() => (deleteConfirmationModalVisible = false)}>
    <div
      class="w-[90dvw] max-w-[400px] p-4 flex flex-col gap-y-4 bg-emerald-800 text-emerald-200 rounded-md"
    >
      <span class="p-4 text-center text-lg">Delete entry "{data.description}"?</span>
      <div class="h-10 flex gap-x-2">
        <button
          onclick={() => (deleteConfirmationModalVisible = false)}
          class="basis-1/2 h-full bg-emerald-900 rounded-md">No</button
        >
        <button
          onclick={() => {
            submitDeleteEntryForm();
            deleteConfirmationModalVisible = false;
          }}
          class="basis-1/2 h-full bg-emerald-700 rounded-md">Yes</button
        >
      </div>
    </div>
  </Modal>
{/if}

<!-- Delete Form -->
<form use:deleteEntryEnhance method="post" action="?/deleteEntry" class="hidden">
  <input name="id" type="string" value={data.id} />
</form>
