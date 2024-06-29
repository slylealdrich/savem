import { isValid, parse } from 'date-fns';
import { z } from 'zod';

export const addEntrySchema = z
	.object({
		description: z.string(),
		dollars: z.number(),
		cents: z.number().min(1).max(99),
		month: z.number(),
		day: z.number(),
		year: z.number()
	})
	.refine((schema) => {
		const date = parse(schema.year + '-' + schema.month + '-' + schema.day, 'yyyy-M-d', new Date());
		return isValid(date);
	}, 'Invalid date');

export type AddEntrySchema = typeof addEntrySchema;
