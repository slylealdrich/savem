<script lang="ts">
	import { format } from 'date-fns';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	const { data } = $props();

	const {
		form: addEntryForm,
		errors: addEntryErrors,
		enhance: addEntryEnhance,
		message: addEntryMessage
	} = superForm(data.addEntryForm, {
		resetForm: true
	});

	const { form: deleteEntryForm, enhance: deleteEntryEnhance } = superForm(data.deleteEntryForm);
</script>

<h1 class="text-xl font-bold">Budget App</h1>

<div class="divide-y">
	<form
		use:addEntryEnhance
		method="post"
		action="?/addEntry"
		autocomplete="off"
		class="w-full h-8 flex justify-start items-center gap-x-4"
	>
		<label for="description">Description:</label>
		<input
			name="description"
			type="text"
			placeholder="describe the purchase"
			bind:value={$addEntryForm.description}
			class="px-1 bg-gray-200"
		/>

		<label for="dollars">Amount:</label>
		<input
			name="dollars"
			type="string"
			bind:value={$addEntryForm.dollars}
			class="px-1 bg-gray-200"
		/>

		<label for="date">Date of Purchase:</label>
		<input name="date" type="string" bind:value={$addEntryForm.date} class="px-1 bg-gray-200" />

		<button type="submit" class="w-12 bg-blue-200"> Add </button>
	</form>

	{#each data.entries as entry}
		<div
			class="w-full h-8 flex justify-start items-center gap-x-4 odd:bg-gray-100 even:bg-gray-200"
		>
			<p>{format(entry.date, 'MM-dd-yyyy')}</p>
			<p>{entry.description}</p>
			<p>{entry.cents / 100n}.{entry.cents % 100n}</p>

			<form use:deleteEntryEnhance method="post" action="?/deleteEntry">
				<input name="id" type="string" value={entry.id} class="hidden" />
				<button class="w-16 bg-red-200">Delete</button>
			</form>
		</div>
	{/each}
</div>
