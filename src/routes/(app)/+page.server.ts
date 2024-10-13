import prisma, { type EntryWithTag } from "$lib/prisma.js";
import type { Tag } from "@prisma/client";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";
import {
  createEntrySchema,
  createTagSchema,
  deleteEntrySchema,
  deleteTagSchema,
  updateEntrySchema,
  updateTagSchema,
} from "$lib/schemas.js";
import { auth } from "$lib/auth.js";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(307, "/sign-in");
  }

  const today = new Date();
  const createEntryFormSeed = {
    description: "",
    month: today.getMonth() + 1,
    day: today.getDate(),
    year: today.getFullYear(),
  };

  const createEntryForm = await superValidate(createEntryFormSeed, zod(createEntrySchema));
  const updateEntryForm = await superValidate(zod(updateEntrySchema));
  const deleteEntryForm = await superValidate(zod(deleteEntrySchema));

  const createTagForm = await superValidate(zod(createTagSchema));
  const updateTagForm = await superValidate(zod(updateTagSchema));
  const deleteTagForm = await superValidate(zod(deleteTagSchema));

  const entries: EntryWithTag[] = await prisma.entry.findMany({
    where: {
      userId: locals.user.id,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      tag: true,
    },
  });

  const tags: Tag[] = await prisma.tag.findMany({
    where: {
      userId: locals.user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    entries,
    tags,
    createEntryForm,
    updateEntryForm,
    deleteEntryForm,
    createTagForm,
    updateTagForm,
    deleteTagForm,
  };
};

export const actions: Actions = {
  signOut: async ({ locals, cookies }) => {
    if (!locals.session) return fail(401);

    await auth.invalidateSession(locals.session.id);
    auth.deleteSessionTokenCookie(cookies);
  },
  createEntry: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(createEntrySchema));

    if (!form.valid) return fail(400, { form });

    const utcDate = new Date(Date.UTC(form.data.year, form.data.month - 1, form.data.day));

    if (form.data.tag === "") {
      await prisma.entry.create({
        data: {
          user: {
            connect: {
              id: locals.user.id,
            },
          },
          description: form.data.description,
          cents: form.data.dollars * 100 + form.data.cents,
          date: utcDate,
        },
      });
    } else {
      await prisma.entry.create({
        data: {
          user: {
            connect: {
              id: locals.user.id,
            },
          },
          tag: {
            connect: {
              id: form.data.tag,
            },
          },
          description: form.data.description,
          cents: form.data.dollars * 100 + form.data.cents,
          date: utcDate,
        },
      });
    }

    return message(form, "success");
  },
  updateEntry: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(updateEntrySchema));

    if (!form.valid) return fail(400, { form });

    const utcDate = new Date(Date.UTC(form.data.year, form.data.month - 1, form.data.day));

    if (form.data.tagId === "") {
      await prisma.entry.update({
        where: {
          id: form.data.id,
          userId: locals.user.id,
        },
        data: {
          description: form.data.description,
          cents: form.data.dollars * 100 + form.data.cents,
          date: utcDate,
          tag: {
            disconnect: true,
          },
        },
      });
    } else {
      await prisma.entry.update({
        where: {
          id: form.data.id,
          userId: locals.user.id,
        },
        data: {
          description: form.data.description,
          cents: form.data.dollars * 100 + form.data.cents,
          date: utcDate,
          tag: {
            connect: {
              id: form.data.tagId,
            },
          },
        },
      });
    }

    return message(form, "success");
  },
  deleteEntry: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(deleteEntrySchema));

    if (!form.valid) return fail(400, { form });

    await prisma.entry.delete({
      where: {
        id: form.data.id,
        userId: locals.user.id,
      },
    });

    return message(form, "success");
  },
  createTag: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(createTagSchema));

    if (!form.valid) return fail(400, { form });

    await prisma.tag.create({
      data: {
        user: {
          connect: {
            id: locals.user.id,
          },
        },
        name: form.data.name,
        color: form.data.color,
      },
    });
    return message(form, "success");
  },
  updateTag: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(updateTagSchema));

    if (!form.valid) return fail(400, { form });

    await prisma.tag.update({
      where: {
        id: form.data.id,
        userId: locals.user.id,
      },
      data: {
        name: form.data.name,
        color: form.data.color,
      },
    });

    return message(form, "success");
  },
  deleteTag: async ({ request, locals }) => {
    if (!locals.user) throw redirect(307, "/sign-in");

    const form = await superValidate(request, zod(deleteTagSchema));

    if (!form.valid) return fail(400, { form });

    await prisma.tag.delete({
      where: {
        id: form.data.id,
        userId: locals.user.id,
      },
    });

    return message(form, "success");
  },
};
