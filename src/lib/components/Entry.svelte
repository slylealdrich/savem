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
  <form
    use:deleteEntryEnhance
    method="post"
    action="?/deleteEntry"
    class="basis-1/12 w-full flex justify-center items-center"
  >
    <input name="id" type="string" value={data.id} class="hidden" />
    <button type="button" onclick={() => (deleteConfirmationModalVisible = true)}>
      <i class="fa-solid fa-xmark text-emerald-700 text-xl"></i>
    </button>
  </form>
</div>

<!-- Confirmation -->
{#if deleteConfirmationModalVisible}
  <Modal offClick={() => (deleteConfirmationModalVisible = false)}>
    <div class="w-[80dvw] p-10 flex flex-col gap-y-4 bg-emerald-800 text-emerald-200 rounded-md">
      <span class="text-center">Are you sure you want to delete this?</span>
      <div class="h-8 flex gap-x-2">
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
