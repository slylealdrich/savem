import prisma from '$lib/prisma.js';
import type { Entry } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types.js';
import { addEntrySchema } from '$lib/schemas.js';

const deleteEntryFormSchema = z.object({
	id: z.string()
});

export const load: PageServerLoad = async () => {
	const today = new Date();
	const addEntryFormSeed = {
		description: '',
		dollars: 0,
		cents: 0,
		month: today.getMonth() + 1,
		day: today.getDate(),
		year: today.getFullYear()
	};

	const addEntryForm = await superValidate(addEntryFormSeed, zod(addEntrySchema));
	const deleteEntryForm = await superValidate(zod(deleteEntryFormSchema));

	const entries: Entry[] = await prisma.entry.findMany({
		orderBy: {
			date: 'desc'
		}
	});

	return {
		addEntryForm,
		deleteEntryForm,
		entries
	};
};

export const actions = {
	addEntry: async ({ request }) => {
		const form = await superValidate(request, zod(addEntrySchema));

		if (!form.valid) return fail(400, { form });

		await prisma.entry.create({
			data: {
				description: form.data.description,
				cents: form.data.dollars * 100 + form.data.cents,
				date: new Date(form.data.year, form.data.month - 1, form.data.day)
			}
		});
		return message(form, 'success');
	},
	deleteEntry: async ({ request }) => {
		const form = await superValidate(request, zod(deleteEntryFormSchema));

		if (!form.valid) return fail(400, { form });

		await prisma.entry.delete({
			where: {
				id: form.data.id
			}
		});

		return message(form, 'success');
	}
};
