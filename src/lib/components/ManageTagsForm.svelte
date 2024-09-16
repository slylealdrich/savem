<script lang="ts">
  import type { CreateTagSchema, UpdateTagSchema } from "$lib/schemas";
  import type { Tag } from "@prisma/client";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";

  const {
    tags,
    createTagData,
    updateTagData,
  }: {
    tags: Tag[];
    createTagData: SuperValidated<Infer<CreateTagSchema>>;
    updateTagData: SuperValidated<Infer<UpdateTagSchema>>;
  } = $props();

  let selectedTagId: string = $state("");

  let selectedTag = $derived(tags.filter((tag) => tag.id === selectedTagId)[0]);

  const { form: createTagForm, enhance: createTagEnhance } = superForm(createTagData);
  const { form: updateTagForm, enhance: updateTagEnhance } = superForm(updateTagData);
</script>

<div
  class="w-80 max-w- p-5 flex flex-col justify-center items-center gap-y-5 bg-emerald-900 text-emerald-200 rounded-md"
>
  <h1 class="text-xl font-bold">Manage Tags</h1>

  <select bind:value={selectedTagId} class="w-full p-2 bg-emerald-950 rounded-md">
    <option value="" selected>create new tag</option>
    {#each tags as tag}
      <option value={tag.id}>{tag.name}</option>
    {/each}
  </select>

  {#if selectedTagId === ""}
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
        <button type="submit" class="w-full h-10 bg-emerald-600 rounded-md">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </form>
  {:else}
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
        <button type="submit" class="w-full h-10 bg-emerald-600 rounded-md"> Save Edit </button>
      </div>
    </form>
  {/if}
</div>
