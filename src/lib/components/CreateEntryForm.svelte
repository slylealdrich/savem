<script lang="ts">
  import type { CreateEntrySchema, CreateTagSchema, UpdateTagSchema } from "$lib/schemas";
  import Modal from "$lib/components/Modal.svelte";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import type { Tag } from "@prisma/client";
  import ManageTagsForm from "./ManageTagsForm.svelte";

  const {
    tags,
    createEntryData,
    createTagData,
    updateTagData,
  }: {
    tags: Tag[];
    createEntryData: SuperValidated<Infer<CreateEntrySchema>>;
    createTagData: SuperValidated<Infer<CreateTagSchema>>;
    updateTagData: SuperValidated<Infer<UpdateTagSchema>>;
  } = $props();

  const { form: createEntryForm, enhance: createEntryEnhance } = superForm(createEntryData);

  let showManageTagsModal = $state(false);
</script>

<form
  use:createEntryEnhance
  method="post"
  action="?/createEntry"
  autocomplete="off"
  class="max-w-[500px] p-4 flex flex-col justify-start items-center gap-y-5 bg-emerald-900 rounded-md text-emerald-200"
>
  <h1 class="w-full text-2xl text-center font-bold">New Entry</h1>

  <!-- DESCRIPTION-->
  <label class="w-full flex flex-col">
    <span class="p-1 flex justify-center items-center bg-emerald-600 text-center rounded-t-md">
      Description
    </span>
    <input
      name="description"
      type="text"
      placeholder="Describe the purchase in a few words..."
      bind:value={$createEntryForm.description}
      class="h-10 px-2 bg-emerald-950 placeholder-emerald-900 rounded-b-md"
    />
  </label>

  <!-- AMOUNT -->
  <div class="w-full flex gap-x-1 justify-center text-2xl">
    <label class="basis-7/12 flex">
      <span class="w-6 flex justify-center items-center bg-emerald-600 text-sm rounded-l-md">
        <i class="fa-solid fa-dollar-sign"></i>
      </span>
      <input
        name="dollars"
        placeholder="0"
        bind:value={$createEntryForm.dollars}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-r-md"
      />
    </label>
    <label class="flex basis-5/12">
      <input
        name="cents"
        placeholder="0"
        bind:value={$createEntryForm.cents}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-l-md"
      />
      <span
        class="w-6 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-r-md"
      >
        <i class="fa-solid fa-cent-sign"></i>
      </span>
    </label>
  </div>

  <!-- DATE -->
  <div class="w-full flex gap-x-1">
    <label class="basis-1/3 flex flex-col">
      <input
        name="month"
        placeholder="month"
        bind:value={$createEntryForm.month}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-t-md"
      />
      <span
        class="h-5 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-b-md"
      >
        M
      </span>
    </label>
    <label class="basis-1/3 flex flex-col">
      <input
        name="day"
        placeholder="day"
        bind:value={$createEntryForm.day}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-t-md"
      />
      <span
        class="h-5 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-b-md"
      >
        D
      </span>
    </label>
    <label class="basis-1/3 flex flex-col">
      <input
        name="year"
        placeholder="year"
        bind:value={$createEntryForm.year}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-t-md"
      />
      <span
        class="h-5 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-b-md"
      >
        Y
      </span>
    </label>
  </div>

  <!-- TAG -->
  <div class="w-full flex gap-x-1">
    <label class="basis-[65%] flex justify-center items-center">
      <span class="basis-1/5 h-10 p-1 flex justify-center items-center bg-emerald-600 rounded-l-md">
        Tag
      </span>
      <select name="tag" class="basis-4/5 h-10 px-2 bg-emerald-950 rounded-r-md">
        <option value="" selected></option>
        {#each tags as tag}
          <option value={tag.id}>{tag.name}</option>
        {/each}
      </select>
    </label>
    <button
      type="button"
      onclick={() => (showManageTagsModal = true)}
      class="basis-[35%] h-10 bg-emerald-700 rounded-md"
    >
      Manage Tags
    </button>
  </div>

  <div class="w-full h-10 flex justify-around items-center gap-x-2">
    <button type="submit" class="w-full h-full bg-emerald-600 rounded-md">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</form>

{#if showManageTagsModal}
  <Modal offClick={() => (showManageTagsModal = false)}>
    <ManageTagsForm {tags} {createTagData} {updateTagData} />
  </Modal>
{/if}
