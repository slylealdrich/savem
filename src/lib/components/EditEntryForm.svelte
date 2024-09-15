<script lang="ts">
  import type { Tag } from "@prisma/client";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import type { UpdateEntrySchema } from "$lib/schemas";
  import { type EntryWithTag } from "$lib/prisma";

  let {
    entry,
    tags,
    updateEntryData,
  }: {
    entry: EntryWithTag;
    tags: Tag[];
    updateEntryData: SuperValidated<Infer<UpdateEntrySchema>>;
  } = $props();

  const { enhance: updateEntryEnhance } = superForm(updateEntryData);
</script>

<form
  use:updateEntryEnhance
  method="post"
  action="?/updateEntry"
  autocomplete="off"
  class="p-4 flex flex-col justify-start items-center gap-y-5 bg-emerald-900 rounded-md text-emerald-200"
>
  <input name="id" value={entry.id} hidden />
  <!-- DESCRIPTION-->
  <label class="w-full flex flex-col">
    <span class="p-1 flex justify-center items-center bg-emerald-600 text-center rounded-t-md">
      Description
    </span>
    <input
      name="description"
      type="text"
      placeholder="Describe the purchase in a few words..."
      value={entry.description}
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
        value={entry.cents / 100n}
        class="w-full p-1 bg-emerald-950 text-center placeholder-emerald-900 rounded-r-md"
      />
    </label>
    <label class="flex basis-5/12">
      <input
        name="cents"
        placeholder="0"
        value={entry.cents % 100n}
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
        value={entry.date.getMonth() + 1}
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
        value={entry.date.getDate()}
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
        value={entry.date.getFullYear()}
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
    <label class="w-full flex justify-center items-center">
      <span class="basis-1/5 h-10 p-1 flex justify-center items-center bg-emerald-600 rounded-l-md">
        Tag
      </span>
      <select name="tagId" class="basis-4/5 h-10 px-2 bg-emerald-950 rounded-r-md">
        <option value=""></option>
        {#each tags as tag}
          {#if tag.id === entry.tag?.id}
            <option value={tag.id} selected>{tag.name}</option>
          {:else}
            <option value={tag.id}>{tag.name}</option>
          {/if}
        {/each}
      </select>
    </label>
  </div>

  <div class="w-full h-10 flex justify-around items-center gap-x-2">
    <button type="submit" class="w-full h-full bg-emerald-600 rounded-md">Save Changes</button>
  </div>
</form>
