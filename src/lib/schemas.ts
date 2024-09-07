import { isValid, parse } from "date-fns";
import { z } from "zod";

// Add Entry Schema

export const createEntrySchema = z
  .object({
    description: z.string().min(1, "Description must be included"),
    tag: z.string(),
    dollars: z
      .number()
      .min(0, "Dollar value must be positive or 0")
      .max(999999, "Dollar value too high"),
    cents: z
      .number()
      .min(0, "Cent value must be positive or 0")
      .max(99, "Cent value must be less than 100"),
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

export type CreateEntrySchema = typeof createEntrySchema;

// Delete Entry Schema

export const deleteEntryFormSchema = z.object({
  id: z.string(),
});

export type DeleteEntryFormSchema = typeof deleteEntryFormSchema;

// Create Tag Schema

export const createTagSchema = z.object({
  name: z.string().min(1).max(16),
  color: z.string().optional(),
});

export type CreateTagSchema = typeof createTagSchema;

// Sign Up Schema

export const signUpSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least 3 characters long")
    .max(16, "Username must be 16 characters or less")
    .regex(/^\w+$/, 'Username can only contain letters, numbers, and underscores "_"'),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less"),
});

export type SignUpSchema = typeof signUpSchema;

// Sign In Schema

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type SignInSchema = typeof signInSchema;
