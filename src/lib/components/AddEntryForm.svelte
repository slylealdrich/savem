<script lang="ts">
  import type { AddEntrySchema } from "$lib/schemas";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";

  const { data }: { data: SuperValidated<Infer<AddEntrySchema>> } = $props();

  const { form, enhance } = superForm(data);
</script>

<form
  use:enhance
  method="post"
  action="?/addEntry"
  autocomplete="off"
  class="p-4 flex flex-col justify-start items-center gap-y-4 bg-emerald-900 rounded-md text-emerald-200"
>
  <h1 class="w-full text-2xl text-center font-bold">New Entry</h1>

  <label class="w-full flex flex-col">
    <span class="h-7 flex justify-center items-center bg-emerald-600 text-center rounded-t-md">
      Description
    </span>
    <input
      name="description"
      type="text"
      bind:value={$form.description}
      class="h-10 px-1 bg-emerald-950 rounded-b-md"
    />
  </label>

  <div class="w-full flex gap-x-1 justify-center text-2xl">
    <label class="basis-7/12 flex">
      <span class="w-6 flex justify-center items-center bg-emerald-600 text-sm rounded-l-md">
        <i class="fa-solid fa-dollar-sign"></i>
      </span>
      <input
        name="dollars"
        bind:value={$form.dollars}
        class="w-full p-1 bg-emerald-950 text-center rounded-r-md"
      />
    </label>
    <label class="flex basis-5/12">
      <input
        name="cents"
        bind:value={$form.cents}
        class="w-full p-1 bg-emerald-950 text-center rounded-l-md"
      />
      <span
        class="w-6 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-r-md"
      >
        <i class="fa-solid fa-cent-sign"></i>
      </span>
    </label>
  </div>

  <div class="w-full flex gap-x-1">
    <label class="basis-1/3 flex flex-col">
      <input
        name="month"
        bind:value={$form.month}
        class="w-full p-1 bg-emerald-950 text-center rounded-t-md"
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
        bind:value={$form.day}
        class="w-full p-1 bg-emerald-950 text-center rounded-t-md"
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
        bind:value={$form.year}
        class="w-full p-1 bg-emerald-950 text-center rounded-t-md"
      />
      <span
        class="h-5 flex justify-center items-center bg-emerald-600 text-sm text-center rounded-b-md"
      >
        Y
      </span>
    </label>
  </div>

  <div class="w-full h-10 flex justify-around items-center gap-x-2">
    <button type="submit" class="w-full h-full bg-emerald-600 text-emerald-100 rounded-md">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</form>
