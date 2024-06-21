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

<div class="p-16">
	<SuperDebug data={$addEntryForm} theme="vscode" />
</div>
<form use:addEntryEnhance method="post" action="?/addEntry" class="border">
	<label for="description">Description</label>
	<input
		name="description"
		type="text"
		placeholder="describe the purchase"
		bind:value={$addEntryForm.description}
	/>

	<label for="dollars">Dollars</label>
	<input name="dollars" type="string" bind:value={$addEntryForm.dollars} />

	<label for="date">Date of Purchase</label>
	<input name="date" type="string" bind:value={$addEntryForm.date} />

	<button type="submit"> Add </button>
	{#if $addEntryErrors}
		<p>{$addEntryMessage}</p>
	{/if}
</form>

{#each data.entries as entry}
	<div class="border">
		<p>{format(entry.date, 'MM-dd-yyyy')}</p>
		<p>{entry.description}</p>
		<p>{entry.cents / 100n}.{entry.cents % 100n}</p>

		<form use:deleteEntryEnhance method="post" action="?/deleteEntry">
			<input name="id" type="string" value={entry.id} class="hidden" />
			<button>Delete</button>
		</form>
	</div>
{/each}
