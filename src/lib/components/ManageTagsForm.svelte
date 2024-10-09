<script lang="ts">
  import { enhance } from "$app/forms";
  import type { CreateTagSchema, DeleteTagSchema, UpdateTagSchema } from "$lib/schemas";
  import type { Tag } from "@prisma/client";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import Modal from "./Modal.svelte";

  const {
    tags,
    createTagData,
    updateTagData,
    deleteTagData,
  }: {
    tags: Tag[];
    createTagData: SuperValidated<Infer<CreateTagSchema>>;
    updateTagData: SuperValidated<Infer<UpdateTagSchema>>;
    deleteTagData: SuperValidated<Infer<DeleteTagSchema>>;
  } = $props();

  let selectedTagId: string = $state("");

  let selectedTag = $derived(tags.filter((tag) => tag.id === selectedTagId)[0]);

  const { form: createTagForm, enhance: createTagEnhance } = superForm(createTagData);
  const { form: updateTagForm, enhance: updateTagEnhance } = superForm(updateTagData);
  const { form: deleteTagForm, enhance: deleteTagEnhance } = superForm(deleteTagData, {
    onResult: () => {
      showDeleteConfirmationModal = false;
      selectedTagId = "";
    },
  });

  let showDeleteConfirmationModal = $state(false);
</script>

<div
  class="w-80 max-w- p-5 flex flex-col justify-center items-center gap-y-5 bg-emerald-900 text-emerald-200 rounded-md"
>
  <h1 class="text-xl font-bold">Manage Tags</h1>

  <select bind:value={selectedTagId} class="w-5/6 p-2 bg-emerald-950 rounded-md">
    <option value="" selected>create new tag</option>
    {#each tags as tag}
      <option value={tag.id}>{tag.name}</option>
    {/each}
  </select>

  {#if selectedTagId === ""}
    <!-- Create New Tag -->
    <form
      use:createTagEnhance
      method="post"
      action="?/createTag"
      autocomplete="off"
      class="w-full flex flex-col gap-y-2"
    >
      <label class="flex flex-col">
        <span class="p-1 flex justify-center items-center bg-emerald-600 rounded-t-md">
          Tag Name
        </span>
        <input
          name="name"
          bind:value={$createTagForm.name}
          class="h-10 px-2 py-1 bg-emerald-950 rounded-b-md"
        />
      </label>
      <label class="flex flex-col">
        <span class="p-1 flex justify-center items-center bg-emerald-600 rounded-t-md">Color</span>
        <div class=" h-10 p-1 flex justify-center items-center bg-emerald-950 rounded-b-md">
          <input name="color" type="color" bind:value={$createTagForm.color} />
        </div>
      </label>
      <div class="flex gap-x-2">
        <button type="submit" class="basis-5/6 h-10 bg-emerald-600 rounded-md">Create Tag</button>
        <button type="submit" class="basis-1/6 h-10 bg-gray-600 text-gray-500 rounded-md">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </form>
  {:else}
    <!-- Edit Existing Tag -->
    <form
      use:updateTagEnhance
      method="post"
      action="?/updateTag"
      autocomplete="off"
      class="w-full flex flex-col gap-y-2"
    >
      <input name="id" value={selectedTag.id} class="hidden" />
      <label class="flex flex-col">
        <span class="p-1 flex justify-center items-center bg-emerald-600 rounded-t-md">
          Tag Name
        </span>
        <input
          name="name"
          value={selectedTag.name}
          class="h-10 px-2 py-1 bg-emerald-950 rounded-b-md"
        />
      </label>
      <label class="flex flex-col">
        <span class="p-1 flex justify-center items-center bg-emerald-600 rounded-t-md">Color</span>
        <div class="h-10 p-1 flex justify-center items-center bg-emerald-950 rounded-b-md">
          <input name="color" type="color" value={selectedTag.color} />
        </div>
      </label>
      <div class="flex gap-x-2">
        <button type="submit" class="basis-5/6 h-10 bg-emerald-600 rounded-md">Save Changes</button>
        <button
          type="submit"
          onclick={() => (showDeleteConfirmationModal = true)}
          class="basis-1/6 h-10 bg-red-400 text-white rounded-md"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </form>
  {/if}
</div>

<!-- Delete Form -->
{#if showDeleteConfirmationModal}
  <Modal offClick={() => (showDeleteConfirmationModal = false)}>
    <form
      use:deleteTagEnhance
      method="post"
      action="?/deleteTag"
      class="w-[90dvw] max-w-[400px] p-4 flex flex-col gap-y-4 bg-emerald-800 text-emerald-200 rounded-md"
    >
      <input name="id" type="string" value={selectedTag.id} hidden />
      <span class="p-4 text-center text-lg">Delete "{selectedTag.name}" tag?</span>
      <div class="h-10 flex gap-x-2">
        <button
          type="button"
          onclick={() => (showDeleteConfirmationModal = false)}
          class="basis-1/2 h-full bg-emerald-900 rounded-md"
        >
          No
        </button>
        <button type="submit" class="basis-1/2 h-full bg-emerald-700 rounded-md">Yes</button>
      </div>
    </form>
  </Modal>
{/if}
