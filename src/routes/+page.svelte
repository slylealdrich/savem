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

<div class="divide-y">
	<form
		use:addEntryEnhance
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
				bind:value={$addEntryForm.description}
				class="px-1 bg-emerald-100"
			/>
		</div>

		<label for="amount">Amount:</label>
		<div>
			$
			<input
				name="dollars"
				bind:value={$addEntryForm.dollars}
				class="w-16 px-1 bg-emerald-100 text-right"
			/>
			.
			<input
				name="cents"
				bind:value={$addEntryForm.cents}
				class="w-8 px-1 bg-emerald-100 text-left"
			/>
		</div>

		<label for="date">Date of Purchase:</label>
		<div>
			<input
				name="month"
				bind:value={$addEntryForm.month}
				class="w-7 px-1 bg-emerald-100 text-right"
			/>
			/
			<input
				name="day"
				bind:value={$addEntryForm.day}
				class="w-7 px-1 bg-emerald-100 text-center"
			/>
			/
			<input
				name="year"
				bind:value={$addEntryForm.year}
				class="w-12 px-1 bg-emerald-100 text-left"
			/>
		</div>

		<button type="submit" class="w-8 h-8 bg-emerald-600 text-emerald-100">
			<i class="fa-solid fa-plus"></i>
		</button>
	</form>

	{#each data.entries as entry}
		<div
			class="w-full h-12 px-4 flex justify-start items-center gap-x-4 odd:bg-emerald-100 even:bg-emerald-200"
		>
			<form use:deleteEntryEnhance method="post" action="?/deleteEntry">
				<input name="id" type="string" value={entry.id} class="hidden" />
				<button class="w-8 bg-red-200">X</button>
			</form>
			<p>{format(entry.date, 'MM-dd-yyyy')}</p>
			<p>
				${entry.cents / 100n}.{entry.cents % 100n < 10
					? '0' + (entry.cents % 100n)
					: entry.cents % 100n}
			</p>
			<p>{entry.description}</p>
		</div>
	{/each}
</div>
