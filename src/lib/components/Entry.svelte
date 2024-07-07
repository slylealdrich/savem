<script lang="ts">
  import type { DeleteEntryFormSchema } from "$lib/schemas";
  import { type Entry } from "@prisma/client";
  import { format } from "date-fns";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";

  const {
    data,
    deleteForm,
  }: { data: Entry; deleteForm: SuperValidated<Infer<DeleteEntryFormSchema>> } = $props();
  const { enhance: deleteEntryEnhance } = superForm(deleteForm);
</script>

<div class="p-2 flex items-center bg-emerald-800 text-center text-emerald-200 rounded-md">
  <div class="basis-11/12 flex items-center divide-x divide-emerald-700">
    <span class="basis-1/3 w-full text-sm">{format(data.date, "MM-dd-yyyy")}</span>
    <div class="basis-2/3 w-full flex flex-col justify-center items-center gap-y-2">
      <span class="w-full text-sm">{data.description}</span>
      <span class="w-full text-xl">
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
    <button type="submit">
      <i class="fa-solid fa-xmark text-emerald-700"></i>
    </button>
  </form>
</div>
