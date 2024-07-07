import { isValid, parse } from "date-fns";
import { z } from "zod";

export const addEntrySchema = z
  .object({
    description: z.string(),
    dollars: z.number().min(0).max(999999),
    cents: z.number().min(0).max(99),
    month: z.number(),
    day: z.number(),
    year: z.number(),
  })
  .refine((schema) => {
    return schema.dollars + schema.cents !== 0;
  }, "Amount must be greater than 0")
  .refine((schema) => {
    const date = parse(schema.year + "-" + schema.month + "-" + schema.day, "yyyy-M-d", new Date());
    return isValid(date);
  }, "Invalid date");

export type AddEntrySchema = typeof addEntrySchema;

export const deleteEntryFormSchema = z.object({
  id: z.string(),
});

export type DeleteEntryFormSchema = typeof deleteEntryFormSchema;
