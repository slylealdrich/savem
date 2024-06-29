<script lang="ts">
	import type { AddEntrySchema } from '$lib/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	const { data }: { data: SuperValidated<Infer<AddEntrySchema>> } = $props();

	const { form, enhance } = superForm(data);
</script>

<form
	use:enhance
	method="post"
	action="?/addEntry"
	autocomplete="off"
	class="w-full h-12 px-4 flex justify-start items-center gap-x-4 bg-emerald-800"
>
	<div>
		<label for="description">Description:</label>
		<input
			name="description"
			type="text"
			bind:value={$form.description}
			class="px-1 bg-emerald-100"
		/>
	</div>

	<label for="amount">Amount:</label>
	<div>
		$
		<input name="dollars" bind:value={$form.dollars} class="w-16 px-1 bg-emerald-100 text-right" />
		.
		<input name="cents" bind:value={$form.cents} class="w-8 px-1 bg-emerald-100 text-left" />
	</div>

	<label for="date">Date of Purchase:</label>
	<div>
		<input name="month" bind:value={$form.month} class="w-7 px-1 bg-emerald-100 text-right" />
		/
		<input name="day" bind:value={$form.day} class="w-7 px-1 bg-emerald-100 text-center" />
		/
		<input name="year" bind:value={$form.year} class="w-12 px-1 bg-emerald-100 text-left" />
	</div>

	<button type="submit" class="w-8 h-8 bg-emerald-600 text-emerald-100">
		<i class="fa-solid fa-plus"></i>
	</button>
</form>
