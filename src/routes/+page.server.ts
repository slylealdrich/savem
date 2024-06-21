import prisma from '$lib/prisma.js';
import type { Entry } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types.js';
import { format } from 'date-fns';

const addEntryFormSchema = z.object({
	description: z.string(),
	dollars: z.number().min(0.01).multipleOf(0.01),
	date: z.string().date()
});

const deleteEntryFormSchema = z.object({
	id: z.string()
});

export const load: PageServerLoad = async () => {
	const today = format(new Date(), 'yyyy-MM-dd');
	const addEntryFormSeed = {
		description: '',
		dollars: 0,
		date: today
	};

	const addEntryForm = await superValidate(addEntryFormSeed, zod(addEntryFormSchema));
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
		const form = await superValidate(request, zod(addEntryFormSchema));
		console.log(form);
		if (!form.valid) return fail(400, { form });
		await prisma.entry.create({
			data: {
				description: form.data.description,
				cents: form.data.dollars * 100,
				date: new Date(form.data.date)
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
